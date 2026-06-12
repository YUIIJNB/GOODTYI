-- Mettre à jour les prix existants sans supprimer les offres (à exécuter dans Supabase SQL Editor)
UPDATE public.investment_offers SET price_per_share = 28700, minimum_investment = 28700 WHERE title ILIKE '%SNTS%';
UPDATE public.investment_offers SET price_per_share = 15650, minimum_investment = 15650 WHERE title ILIKE '%ORAC%';
UPDATE public.investment_offers SET price_per_share = 36200, minimum_investment = 36200 WHERE title ILIKE '%SGBC%';
UPDATE public.investment_offers SET price_per_share = 16000, minimum_investment = 16000 WHERE title ILIKE '%ECOC%' AND title NOT ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 8325, minimum_investment = 8325 WHERE title ILIKE '%SIBC%';
UPDATE public.investment_offers SET price_per_share = 13425, minimum_investment = 13425 WHERE title ILIKE '%NTLC%';
UPDATE public.investment_offers SET price_per_share = 6895, minimum_investment = 6895 WHERE title ILIKE '%SPHC%';
UPDATE public.investment_offers SET price_per_share = 2855, minimum_investment = 2855 WHERE title ILIKE '%ONTBF%';
UPDATE public.investment_offers SET price_per_share = 2880, minimum_investment = 2880 WHERE title ILIKE '%TTLC%';
UPDATE public.investment_offers SET price_per_share = 20700, minimum_investment = 20700 WHERE title ILIKE '%CBIBF%';
UPDATE public.investment_offers SET price_per_share = 8835, minimum_investment = 8835 WHERE title ILIKE '%BOAB%' AND title NOT ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 5415, minimum_investment = 5415 WHERE title ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 8880, minimum_investment = 8880 WHERE title ILIKE '%BOAC%';
UPDATE public.investment_offers SET price_per_share = 4940, minimum_investment = 4940 WHERE title ILIKE '%BOAM%';
UPDATE public.investment_offers SET price_per_share = 3700, minimum_investment = 3700 WHERE title ILIKE '%BOAN%';
UPDATE public.investment_offers SET price_per_share = 8000, minimum_investment = 8000 WHERE title ILIKE '%BOAS%';
UPDATE public.investment_offers SET price_per_share = 18965, minimum_investment = 18965 WHERE title ILIKE '%NSBC%';
UPDATE public.investment_offers SET price_per_share = 30, minimum_investment = 3000 WHERE title ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 27000, minimum_investment = 27000 WHERE title ILIKE '%BICI%' OR title ILIKE '%BICC%';
UPDATE public.investment_offers SET price_per_share = 7700, minimum_investment = 7700 WHERE title ILIKE '%PALC%';
UPDATE public.investment_offers SET price_per_share = 12895, minimum_investment = 12895 WHERE title ILIKE '%SMBC%';
UPDATE public.investment_offers SET price_per_share = 7400, minimum_investment = 7400 WHERE title ILIKE '%SOGC%';
UPDATE public.investment_offers SET price_per_share = 37945, minimum_investment = 37945 WHERE title ILIKE '%SLBC%';
UPDATE public.investment_offers SET price_per_share = 2300, minimum_investment = 2300 WHERE title ILIKE '%FTSC%';
UPDATE public.investment_offers SET price_per_share = 4610, minimum_investment = 4610 WHERE title ILIKE '%SICC%';
UPDATE public.investment_offers SET price_per_share = 21250, minimum_investment = 21250 WHERE title ILIKE '%STBC%';
UPDATE public.investment_offers SET price_per_share = 59900, minimum_investment = 59900 WHERE title ILIKE '%UNLC%';
UPDATE public.investment_offers SET price_per_share = 2645, minimum_investment = 2645 WHERE title ILIKE '%SCRC%';
UPDATE public.investment_offers SET price_per_share = 4040, minimum_investment = 4040 WHERE title ILIKE '%CIEC%';
UPDATE public.investment_offers SET price_per_share = 11100, minimum_investment = 11100 WHERE title ILIKE '%SDCC%';
UPDATE public.investment_offers SET price_per_share = 1455, minimum_investment = 1455 WHERE title ILIKE '%CFAC%';
UPDATE public.investment_offers SET price_per_share = 3240, minimum_investment = 3240 WHERE title ILIKE '%TTLS%';

-- Ensuite, exécutez adjust_balances_after_price_update.sql pour créditer les soldes des investisseurs.
