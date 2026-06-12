-- Insérer les 20 offres d'investissement dans la base de données
INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES 
    ('Sonatel SN (SNTS)', 'Leader des télécommunications au Sénégal. Rendement très stable et dividendes réguliers sur le marché UEMOA.', 'Action', 8.5, 17500, 17500, true),
    ('BOA CI (BOAC)', 'Bank of Africa Côte d''Ivoire. Opportunité bancaire de croissance avec de forts fondamentaux.', 'Action', 6.2, 7450, 7450, true),
    ('Emprunt Obligataire TPCI 2024', 'Trésor Public de Côte d''Ivoire. Sécurité maximale, paiement semestriel des intérêts par l''État.', 'Obligation', 5.9, 10000, 10000, true),
    ('CFAO Motors CI (CFAC)', 'Secteur automobile. Solide part de marché et forte politique de dividendes.', 'Action', 4.8, 900, 900, true),
    ('Ecobank Transnational Inc (ETIT)', 'Groupe bancaire panafricain. Forte liquidité et perspective de redressement.', 'Action', 5.1, 18, 1800, true),
    ('Société Générale CI (SGBC)', 'Valeur de croissance incontournable dans le secteur bancaire Ivoirien.', 'Action', 7.2, 16500, 16500, true),
    ('Nestlé CI (NTLC)', 'Valeur défensive. Leader dans le secteur agroalimentaire avec revenus récurrents.', 'Action', 3.5, 8000, 8000, true),
    ('SITAB CI (STBC)', 'Compagnie ivoirienne des tabacs. Distribution historique de dividendes généreux.', 'Action', 9.1, 6500, 6500, true),
    ('TOTAL Sénégal (TTLS)', 'Distribution de produits pétroliers. Leader au Sénégal avec un profil conservateur.', 'Action', 6.0, 2600, 2600, true),
    ('NSIA Banque CI (NSBC)', 'Croissance soutenue et forte distribution de crédit aux PME.', 'Action', 5.8, 5800, 5800, true),
    ('Uniwax CI (UNXC)', 'Industrie textile et pagne. Valeur cyclique et potentielle relance post-crise.', 'Action', 4.2, 800, 800, true),
    ('CIE CI (CIEC)', 'Compagnie Ivoirienne d''Électricité. Monopole et rendements fixes constants.', 'Action', 10.5, 2200, 2200, true),
    ('SUCAFOR CI (SCRC)', 'Sucrivoire. Secteur agro-industriel en structuration.', 'Action', 2.1, 950, 950, true),
    ('Filtisac CI (FTSC)', 'Industrie d''emballage. Dépendance au cacao atténuée par les investissements.', 'Action', 3.8, 1300, 1300, true),
    ('PALM CI (PALC)', 'Société agricole. Fortement corrélée au cours mondial de l''huile de palme.', 'Action', 14.5, 7000, 7000, true),
    ('Coris Bank Int (CBIF)', 'Banque d''origine burkinabé très performante en rentabilité.', 'Action', 7.9, 9200, 9200, true),
    ('ONATEL BF (ONTBF)', 'Opérateur historique du Burkina Faso. Politique de dividendes généreuse.', 'Action', 12.0, 2800, 2800, true),
    ('Emprunt Sukuk État SN', 'Finance islamique, émis par l''état du Sénégal. Taux garanti de 6%.', 'Obligation', 6.0, 10000, 100000, true),
    ('Obligation Sonatel 2020-2027', 'Emprunt corpo par Sonatel pour la 4G/5G. Très liquide et sécurisé.', 'Obligation', 6.5, 10000, 50000, true),
    ('Tractafric Motors CI (TRAM)', 'Véhicules et engins. Profite massivement des projets du BTP.', 'Action', 5.5, 2100, 2100, true);
