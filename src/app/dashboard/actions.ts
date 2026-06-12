'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { syncPortfolioBalances } from '@/lib/syncPortfolioBalances';

const MISSING_TABLE_CODE = '42P01';

export async function submitWithdrawalRequest(formData: FormData) {
  const amount = parseFloat((formData.get('amount') as string) || '0');
  const method = (formData.get('method') as string) || '';
  const holderName = (formData.get('holderName') as string) || '';

  if (!amount || amount <= 0) return { error: 'Montant invalide.' };
  if (method !== 'mobile_money' && method !== 'bank_transfer') return { error: 'Mode de paiement invalide.' };
  if (!holderName.trim()) return { error: 'Le nom du beneficiaire est obligatoire.' };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifie.' };

  const { data: dbUser } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single();

  const currentBalance = parseFloat(dbUser?.balance || 0);
  if (amount > currentBalance) return { error: 'Montant superieur au solde disponible.' };

  let description = '';
  if (method === 'mobile_money') {
    const operator = (formData.get('mobileOperator') as string) || '';
    const phone = (formData.get('mobileNumber') as string) || '';
    if (!operator || !phone) return { error: 'Informations Mobile Money incompletes.' };
    description = `Demande retrait Mobile Money - Operateur: ${operator}, Numero: ${phone}, Beneficiaire: ${holderName}`;
  } else {
    const bankName = (formData.get('bankName') as string) || '';
    const accountNumber = (formData.get('accountNumber') as string) || '';
    if (!bankName || !accountNumber) return { error: 'Informations bancaires incompletes.' };
    description = `Demande retrait Virement - Banque: ${bankName}, Compte: ${accountNumber}, Beneficiaire: ${holderName}`;
  }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    type: 'retrait',
    amount,
    status: 'en_attente',
    description
  });

  if (error) {
    if (error.code === MISSING_TABLE_CODE) {
      return { error: 'Base non initialisée: créez la table transactions (SQL setup requis).' };
    }
    return { error: "Impossible d'envoyer la demande de retrait." };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/active-investments');
  revalidatePath('/admin/transactions');

  return { success: true };
}

/** Ajuste le solde du client connecté selon les cours actuels de ses actions */
export async function syncMyPortfolioBalances() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const result = await syncPortfolioBalances(supabase, { userId: user.id });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/active-investments');

  return {
    success: result.errors.length === 0 || result.totalCredited !== 0,
    credited: result.totalCredited,
    error: result.errors[0],
  };
}
