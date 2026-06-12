-- Supprimer les anciennes offres démo pour faire place aux vraies cotations de la BRVM
DELETE FROM public.investment_offers;

-- Insérer les 32 entreprises cotées — prix BRVM (mai 2026)
INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES
  ('Sonatel (SNTS)', 'Secteur des Télécoms - Sénégal. Plus grande capitalisation de la BRVM (~2 850 milliards FCFA).', 'Action', 8.5, 28700, 28700, true),
  ('Orange Côte d''Ivoire (ORAC)', 'Secteur des Télécoms - CI. Capitalisation de ~2 500 milliards FCFA.', 'Action', 7.2, 15650, 15650, true),
  ('Société Générale CI (SGBC)', 'Secteur Bancaire. 3ème capitalisation de la BRVM (~1 027 milliards FCFA).', 'Action', 9.1, 36200, 36200, true),
  ('Ecobank CI (ECOC)', 'Secteur Bancaire - Côte d''Ivoire.', 'Action', 8.0, 16000, 16000, true),
  ('SIB Côte d''Ivoire (SIBC)', 'Secteur Bancaire - Société Ivoirienne de Banque.', 'Action', 7.5, 8325, 8325, true),
  ('Nestlé Togo (NTLC)', 'Secteur Agroalimentaire - Défensif et solide.', 'Action', 5.4, 13425, 13425, true),
  ('SAPH Côte d''Ivoire (SPHC)', 'Agriculture (Caoutchouc) leader sur le marché.', 'Action', 6.8, 6895, 6895, true),
  ('Onatel Burkina (ONTBF)', 'Secteur Télécom - Burkina Faso. Rendements élevés historiques.', 'Action', 11.5, 2855, 2855, true),
  ('TotalEnergies Togo (TTLC)', 'Distribution pétrolière au Togo.', 'Action', 6.2, 2880, 2880, true),
  ('Coris Bank Int. (CBIBF)', 'Banque d''origine Burkinabé à très fort taux de croissance.', 'Action', 9.0, 20700, 20700, true),
  ('BOA Bénin (BOAB)', 'Groupe Bank of Africa - Filiale Bénin.', 'Action', 8.4, 8835, 8835, true),
  ('BOA Burkina Faso (BOABF)', 'Groupe Bank of Africa - Filiale Burkina Faso.', 'Action', 9.2, 5415, 5415, true),
  ('BOA Côte d''Ivoire (BOAC)', 'Groupe Bank of Africa - Filiale Côte d''Ivoire.', 'Action', 7.8, 8880, 8880, true),
  ('BOA Mali (BOAM)', 'Groupe Bank of Africa - Filiale Mali.', 'Action', 8.8, 4940, 4940, true),
  ('BOA Niger (BOAN)', 'Groupe Bank of Africa - Filiale Niger.', 'Action', 9.5, 3700, 3700, true),
  ('BOA Sénégal (BOAS)', 'Groupe Bank of Africa - Filiale Sénégal.', 'Action', 7.9, 8000, 8000, true),
  ('Nestlé Sénégal (NSBC)', 'Secteur Agroalimentaire - Sénégal.', 'Action', 8.1, 18965, 18965, true),
  ('Ecobank Trans. Inc. (ETIT)', 'Action holding ETI (Mère de toutes les Ecobank). La plus accessible de la bourse.', 'Action', 5.5, 30, 3000, true),
  ('BICI Côte d''Ivoire (BICC)', 'Secteur bancaire historique en Côte d''Ivoire.', 'Action', 6.9, 27000, 27000, true),
  ('Palm Côte d''Ivoire (PALC)', 'Agro-industrie (Huile de palme). Dépendant des cours mondiaux.', 'Action', 12.0, 7700, 7700, true),
  ('SMB Côte d''Ivoire (SMBC)', 'Action industrielle.', 'Action', 7.4, 12895, 12895, true),
  ('SOGB Côte d''Ivoire (SOGC)', 'Agro-industrie (Caoutchouc et Palme).', 'Action', 8.2, 7400, 7400, true),
  ('Solibra (SLBC)', 'Leader de la brasserie en Côte d''Ivoire.', 'Action', 4.5, 37945, 37945, true),
  ('Filtisac (FTSC)', 'Leader de l''emballage (Jute/Plastique) en Afrique de l''Ouest.', 'Action', 6.1, 2300, 2300, true),
  ('Sicable (SICC)', 'Secteur industriel / Câbles électriques.', 'Action', 4.8, 4610, 4610, true),
  ('Servair Togo (STBC)', 'Services aériens et restauration en zone UEMOA.', 'Action', 9.8, 21250, 21250, true),
  ('Unilever CI (UNLC)', 'Secteur de la distribution et biens de grande consommation.', 'Action', 5.1, 59900, 59900, true),
  ('Sucrivoire (SCRC)', 'Production et commercialisation du sucre.', 'Action', 3.5, 2645, 2645, true),
  ('CIE Côte d''Ivoire (CIEC)', 'Monopole de la distribution d''électricité en CI.', 'Action', 8.8, 4040, 4040, true),
  ('Sodeci (SDCC)', 'Distribution d''eau en Côte d''Ivoire.', 'Action', 7.7, 11100, 11100, true),
  ('CFAO Motors CI (CFAC)', 'Distribution automobile - Leader du marché ivoirien.', 'Action', 5.6, 1455, 1455, true),
  ('TotalEnergies Sénégal (TTLS)', 'Distribution pétrolière au Sénégal.', 'Action', 6.8, 3240, 3240, true);
