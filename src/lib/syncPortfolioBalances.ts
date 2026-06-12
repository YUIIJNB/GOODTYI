import { SupabaseClient } from '@supabase/supabase-js';

type InvestmentRow = {
  id: string;
  user_id: string;
  shares_bought: number | string | null;
  amount_invested: number | string;
  current_value: number | string | null;
  offer_id: string | null;
  investment_offers: { price_per_share: number | string; title: string } | { price_per_share: number | string; title: string }[] | null;
};

/**
 * Recalcule la valeur des positions au prix actuel et crédite/débite le solde
 * de la différence depuis la dernière valorisation (idempotent).
 */
export async function syncPortfolioBalances(
  supabase: SupabaseClient,
  options?: { userId?: string }
): Promise<{ adjustedUsers: number; totalCredited: number; errors: string[] }> {
  const errors: string[] = [];
  let adjustedUsers = 0;
  let totalCredited = 0;

  let query = supabase
    .from('user_investments')
    .select(`
      id,
      user_id,
      shares_bought,
      amount_invested,
      current_value,
      offer_id,
      investment_offers ( price_per_share, title )
    `)
    .eq('status', 'actif')
    .not('offer_id', 'is', null)
    .gt('shares_bought', 0);

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  const { data: investments, error: fetchError } = await query;

  if (fetchError) {
    return { adjustedUsers: 0, totalCredited: 0, errors: [fetchError.message] };
  }

  const creditsByUser = new Map<string, { total: number; details: string[] }>();

  for (const row of (investments || []) as InvestmentRow[]) {
    const offer = Array.isArray(row.investment_offers)
      ? row.investment_offers[0]
      : row.investment_offers;

    const pricePerShare = parseFloat(String(offer?.price_per_share ?? ''));
    const shares = parseFloat(String(row.shares_bought ?? ''));
    if (!pricePerShare || !shares) continue;

    const newValue = shares * pricePerShare;
    const oldValue = parseFloat(String(row.current_value ?? row.amount_invested ?? 0));
    const credit = newValue - oldValue;

    if (Math.abs(credit) < 0.01) continue;

    const { error: invError } = await supabase
      .from('user_investments')
      .update({ current_value: newValue })
      .eq('id', row.id);

    if (invError) {
      errors.push(`Investissement ${row.id}: ${invError.message}`);
      continue;
    }

    const existing = creditsByUser.get(row.user_id) ?? { total: 0, details: [] };
    existing.total += credit;
    existing.details.push(
      `${offer?.title ?? 'Action'}: ${credit >= 0 ? '+' : ''}${Math.round(credit).toLocaleString('fr-FR')} FCFA`
    );
    creditsByUser.set(row.user_id, existing);
  }

  for (const [userId, { total, details }] of Array.from(creditsByUser.entries())) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      errors.push(`Utilisateur ${userId}: ${userError?.message ?? 'introuvable'}`);
      continue;
    }

    const currentBalance = parseFloat(String(user.balance ?? 0));
    const newBalance = currentBalance + total;

    const { error: balanceError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (balanceError) {
      errors.push(`Solde ${userId}: ${balanceError.message}`);
      continue;
    }

    const description =
      total >= 0
        ? `Plus-value suite mise à jour des cours (${details.join('; ')})`
        : `Ajustement suite baisse des cours (${details.join('; ')})`;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'distribution_dividende',
      amount: Math.abs(total),
      status: 'complété',
      description,
    });

    adjustedUsers += 1;
    totalCredited += total;
  }

  return { adjustedUsers, totalCredited, errors };
}
