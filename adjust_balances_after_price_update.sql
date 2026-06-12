-- =============================================================================
-- Ajustement des soldes après mise à jour des cours BRVM
-- À exécuter APRÈS update_brvm_prices.sql
--
-- Pour chaque investissement actif :
--   nouvelle_valeur = nombre_actions × prix_actuel
--   ajustement = nouvelle_valeur - valeur_enregistrée
--   → crédit/débit du solde utilisateur + mise à jour current_value
-- Idempotent : relancer sans double-crédit si les prix n'ont pas changé.
-- =============================================================================

BEGIN;

WITH computed AS (
  SELECT
    ui.id AS investment_id,
    ui.user_id,
    ui.shares_bought,
    io.title AS offer_title,
    COALESCE(ui.current_value, ui.amount_invested) AS old_value,
    (ui.shares_bought * io.price_per_share) AS new_value,
    (ui.shares_bought * io.price_per_share) - COALESCE(ui.current_value, ui.amount_invested) AS balance_adjustment
  FROM public.user_investments ui
  INNER JOIN public.investment_offers io ON ui.offer_id = io.id
  WHERE ui.status = 'actif'
    AND ui.offer_id IS NOT NULL
    AND ui.shares_bought > 0
    AND ABS(
      (ui.shares_bought * io.price_per_share) - COALESCE(ui.current_value, ui.amount_invested)
    ) >= 0.01
),
updated_investments AS (
  UPDATE public.user_investments ui
  SET current_value = c.new_value
  FROM computed c
  WHERE ui.id = c.investment_id
  RETURNING c.user_id, c.balance_adjustment, c.offer_title
),
user_totals AS (
  SELECT
    user_id,
    SUM(balance_adjustment) AS total_adjustment,
    string_agg(
      offer_title || ': ' ||
      CASE WHEN balance_adjustment >= 0 THEN '+' ELSE '' END ||
      to_char(round(balance_adjustment), 'FM999G999G999') || ' FCFA',
      '; '
    ) AS details
  FROM updated_investments
  GROUP BY user_id
),
updated_users AS (
  UPDATE public.users u
  SET balance = COALESCE(u.balance, 0) + ut.total_adjustment
  FROM user_totals ut
  WHERE u.id = ut.user_id
  RETURNING u.id, ut.total_adjustment, ut.details
)
INSERT INTO public.transactions (user_id, type, amount, status, description)
SELECT
  id,
  'distribution_dividende',
  ABS(total_adjustment),
  'complété',
  CASE
    WHEN total_adjustment >= 0 THEN
      'Plus-value suite mise à jour cours BRVM (' || details || ')'
    ELSE
      'Ajustement suite baisse des cours BRVM (' || details || ')'
  END
FROM updated_users;

COMMIT;
