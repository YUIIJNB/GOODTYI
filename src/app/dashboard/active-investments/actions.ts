'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sellInvestment(formData: FormData) {
  const investmentId = formData.get('investmentId') as string;
  const offerTitle = (formData.get('offerTitle') as string) || 'position';

  if (!investmentId) {
    return { error: 'Position invalide.' };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour vendre.' };
  }

  const { data: investment, error: investmentError } = await supabase
    .from('user_investments')
    .select('id, user_id, amount_invested, current_value, status')
    .eq('id', investmentId)
    .single();

  if (investmentError || !investment) {
    return { error: 'Position introuvable.' };
  }

  if (investment.user_id !== user.id) {
    return { error: 'Position non autorisée.' };
  }

  if (investment.status !== 'actif') {
    return { error: 'Cette position est déjà clôturée.' };
  }

  const saleAmount = parseFloat(String(investment.current_value ?? investment.amount_invested ?? 0));
  if (saleAmount <= 0) {
    return { error: 'Valeur de vente invalide.' };
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return { error: 'Impossible de récupérer le solde utilisateur.' };
  }

  const currentBalance = parseFloat(String(userData.balance || 0));
  const newBalance = currentBalance + saleAmount;

  const { error: balanceError } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', user.id);

  if (balanceError) {
    return { error: 'Impossible de mettre à jour le solde.' };
  }

  const { error: closeError } = await supabase
    .from('user_investments')
    .update({ status: 'clôturé' })
    .eq('id', investmentId);

  if (closeError) {
    return { error: 'Impossible de clôturer la position.' };
  }

  const { error: txError } = await supabase.from('transactions').insert({
    user_id: user.id,
    type: 'vente_investissement',
    amount: saleAmount,
    status: 'complété',
    description: `Vente de ${offerTitle}`,
  });

  if (txError) {
    console.error('sellInvestment transaction error:', txError.message);
  }

  revalidatePath('/dashboard/active-investments');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/investments');

  return { success: true };
}
