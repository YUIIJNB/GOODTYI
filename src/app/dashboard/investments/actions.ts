'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MISSING_TABLE_CODE = '42P01';
const FORBIDDEN_CODE = '42501';

export async function buyInvestment(formData: FormData) {
  const offerId = formData.get('offerId') as string;
  const shares = parseInt(formData.get('shares') as string);
  const totalCost = parseFloat(formData.get('totalCost') as string);
  const title = formData.get('title') as string;

  if (!offerId || !shares || !totalCost || shares < 1) {
    return { error: 'Requete invalide.' };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  // Vérifier d'abord le KYC et le solde de manière sécurisée en base
  const { data: dbUser } = await supabase
    .from('users')
    .select('balance, kyc_status')
    .eq('id', user.id)
    .single();

  if (!dbUser) return { error: 'Utilisateur introuvable.' };
  if (dbUser.kyc_status !== 'validé') return { error: 'Votre KYC doit être validé par un administrateur pour investir.' };
  
  const currentBalance = parseFloat(dbUser.balance) || 0;
  if (currentBalance < totalCost) return { error: 'Fonds insuffisants sur votre portefeuille.' };

  // 1. Débiter l'argent
  const { error: debitError } = await supabase
    .from('users')
    .update({ balance: currentBalance - totalCost })
    .eq('id', user.id);
    
  if (debitError) return { error: 'Erreur lors du débit.' };

  // 2. Enregistrer l'investissement dans le portefeuille.
  // Les offres de démonstration ont des IDs non-UUID : on stocke alors offer_id à null.
  const sanitizedOfferId = UUID_REGEX.test(offerId) ? offerId : null;
  const investmentPayload: any = {
    user_id: user.id,
    amount_invested: totalCost,
    shares_bought: shares,
    status: 'actif',
    current_value: totalCost
  };
  if (sanitizedOfferId) {
    investmentPayload.offer_id = sanitizedOfferId;
  }

  // Ne pas bloquer l'achat si l'offre n'est pas stockable dans user_investments.
  // L'historique transactions reste la source de secours pour l'affichage.
  const { error: investmentError } = await supabase
    .from('user_investments')
    .insert(investmentPayload);

  if (investmentError) {
    if (investmentError.code === MISSING_TABLE_CODE) {
      await supabase
        .from('users')
        .update({ balance: currentBalance })
        .eq('id', user.id);
      return { error: 'Base non initialisée: créez la table user_investments (SQL setup requis).' };
    }
    console.error('Investment insert warning:', investmentError.message);
  }

  // 3. Ajouter à l'historique de transactions (CELUI-CI SERA AFFICHE)
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'achat_investissement',
      amount: totalCost,
      status: 'complété',
      description: `Achat de ${shares} titre(s) : ${title}`
    });

  if (txError) {
    // Fallback: certains environnements ont des contraintes différentes sur "status"/"description".
    const { error: fallbackTxError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'achat_investissement',
        amount: totalCost
      });

    if (fallbackTxError) {
      await supabase
        .from('users')
        .update({ balance: currentBalance })
        .eq('id', user.id);

      await supabase
        .from('user_investments')
        .delete()
        .eq('user_id', user.id)
        .eq('amount_invested', totalCost)
        .eq('shares_bought', shares)
        .eq('status', 'actif');

      if (txError.code === MISSING_TABLE_CODE || fallbackTxError.code === MISSING_TABLE_CODE) {
        return { error: 'Base non initialisée: créez la table transactions (SQL setup requis).' };
      }
      if (txError.code === FORBIDDEN_CODE || fallbackTxError.code === FORBIDDEN_CODE) {
        return { error: "Acces refuse a la table transactions (RLS/policies). Desactivez RLS ou ajoutez la policy d'insertion." };
      }
      console.error('Transaction insert warning:', txError.message, fallbackTxError.message);
      return { error: `Echec enregistrement transaction: ${fallbackTxError.message || txError.message}` };
    }
  }

  // Rafraîchir toutes les vues pour appliquer le nouveau solde instantanément
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/investments');
  revalidatePath('/dashboard/active-investments');
  
  return { success: true };
}
