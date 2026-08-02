import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';
import MarketSidebar from '@/components/MarketSidebar';
import ClientInvestmentCard from './ClientInvestmentCard';
import MarketplaceContent from './MarketplaceContent';

export default async function InvestmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Récupérer toutes les offres actives du marché
  const { data: dbOffers } = await supabase.from('investment_offers').select('*').eq('is_active', true).order('created_at', { ascending: true });
  
  const DEMO_OFFERS = [
    // TOP 10 Capitalisations — cotations (mai 2026)
    { id: 'snts', title: 'Sonatel (SNTS)', description: 'Secteur des Télécoms - Sénégal. Plus grande capitalisation du marché (~2 850 milliards FCFA).', type: 'Action', roi_percentage: 8.5, price_per_share: 29400, minimum_investment: 29400, is_active: true },
    { id: 'orac', title: 'Orange Côte d\'Ivoire (ORAC)', description: 'Secteur des Télécoms - CI. Capitalisation de ~2 500 milliards FCFA.', type: 'Action', roi_percentage: 7.2, price_per_share: 16250, minimum_investment: 16250, is_active: true },
    { id: 'sgbc', title: 'Société Générale CI (SGBC)', description: 'Secteur Bancaire. 3ème capitalisation du marché (~1 027 milliards FCFA).', type: 'Action', roi_percentage: 9.1, price_per_share: 37000, minimum_investment: 37000, is_active: true },
    { id: 'ecoc', title: 'Ecobank CI (ECOC)', description: 'Secteur Bancaire - Côte d\'Ivoire.', type: 'Action', roi_percentage: 8.0, price_per_share: 16250, minimum_investment: 16250, is_active: true },
    { id: 'sibc', title: 'SIB Côte d\'Ivoire (SIBC)', description: 'Secteur Bancaire - Société Ivoirienne de Banque.', type: 'Action', roi_percentage: 7.5, price_per_share: 8450, minimum_investment: 8450, is_active: true },
    { id: 'ntlc', title: 'Nestlé Côte d\'Ivoire (NTLC)', description: 'Secteur Agroalimentaire - Défensif et solide.', type: 'Action', roi_percentage: 5.4, price_per_share: 13650, minimum_investment: 13650, is_active: true },
    { id: 'sphc', title: 'SAPH Côte d\'Ivoire (SPHC)', description: 'Agriculture (Caoutchouc) leader sur le marché.', type: 'Action', roi_percentage: 6.8, price_per_share: 7050, minimum_investment: 7050, is_active: true },
    { id: 'ontbf', title: 'Onatel Burkina (ONTBF)', description: 'Secteur Télécom - Burkina Faso. Rendements élevés historiques.', type: 'Action', roi_percentage: 11.5, price_per_share: 2950, minimum_investment: 2950, is_active: true },
    { id: 'ttlc', title: 'TotalEnergies Togo (TTLC)', description: 'Distribution pétrolière au Togo.', type: 'Action', roi_percentage: 6.2, price_per_share: 2980, minimum_investment: 2980, is_active: true },
    { id: 'teci', title: 'TotalEnergies Côte d\'Ivoire (TECI)', description: 'TotalEnergies operations in Côte d\'Ivoire. Integrated energy major with upstream and downstream activities.', type: 'Action', roi_percentage: 6.0, price_per_share: 3250, minimum_investment: 3250, is_active: true },
    { id: 'cbibf', title: 'Coris Bank Int. (CBIBF)', description: 'Banque d\'origine Burkinabé à très fort taux de croissance.', type: 'Action', roi_percentage: 9.0, price_per_share: 21250, minimum_investment: 21250, is_active: true },

    // SECTEUR BANCAIRE ET FINANCE
    { id: 'boab', title: 'BOA Bénin (BOAB)', description: 'Groupe Bank of Africa - Filiale Bénin.', type: 'Action', roi_percentage: 8.4, price_per_share: 9000, minimum_investment: 9000, is_active: true },
    { id: 'boabf', title: 'BOA Burkina Faso (BOABF)', description: 'Groupe Bank of Africa - Filiale Burkina Faso.', type: 'Action', roi_percentage: 9.2, price_per_share: 5550, minimum_investment: 5550, is_active: true },
    { id: 'boac', title: 'BOA Côte d\'Ivoire (BOAC)', description: 'Groupe Bank of Africa - Filiale Côte d\'Ivoire.', type: 'Action', roi_percentage: 7.8, price_per_share: 9000, minimum_investment: 9000, is_active: true },
    { id: 'boam', title: 'BOA Mali (BOAM)', description: 'Groupe Bank of Africa - Filiale Mali.', type: 'Action', roi_percentage: 8.8, price_per_share: 5050, minimum_investment: 5050, is_active: true },
    { id: 'boan', title: 'BOA Niger (BOAN)', description: 'Groupe Bank of Africa - Filiale Niger.', type: 'Action', roi_percentage: 9.5, price_per_share: 3750, minimum_investment: 3750, is_active: true },
    { id: 'boas', title: 'BOA Sénégal (BOAS)', description: 'Groupe Bank of Africa - Filiale Sénégal.', type: 'Action', roi_percentage: 7.9, price_per_share: 8200, minimum_investment: 8200, is_active: true },
    { id: 'nsbc', title: 'Nestlé Sénégal (NSBC)', description: 'Secteur Agroalimentaire - Filiale sénégalaise du groupe Nestlé.', type: 'Action', roi_percentage: 8.1, price_per_share: 19250, minimum_investment: 19250, is_active: true },
    { id: 'etit', title: 'Ecobank Trans. Inc. (ETIT)', description: 'Action holding ETI (Mère de toutes les Ecobank). La plus accessible de la bourse.', type: 'Action', roi_percentage: 5.5, price_per_share: 35, minimum_investment: 3000, is_active: true },
    { id: 'bici', title: 'BICI Côte d\'Ivoire (BICC)', description: 'Secteur bancaire historique en Côte d\'Ivoire.', type: 'Action', roi_percentage: 6.9, price_per_share: 27500, minimum_investment: 27500, is_active: true },

    // INDUSTRIE ET AGRICULTURE
    { id: 'palc', title: 'Palm Côte d\'Ivoire (PALC)', description: 'Agro-industrie (Huile de palme). Dépendant des cours mondiaux.', type: 'Action', roi_percentage: 12.0, price_per_share: 7850, minimum_investment: 7850, is_active: true },
    { id: 'smbc', title: 'SMB Côte d\'Ivoire (SMBC)', description: 'Action industrielle.', type: 'Action', roi_percentage: 7.4, price_per_share: 13050, minimum_investment: 13050, is_active: true },
    { id: 'sogc', title: 'SOGB Côte d\'Ivoire (SOGC)', description: 'Agro-industrie (Caoutchouc et Palme).', type: 'Action', roi_percentage: 8.2, price_per_share: 7600, minimum_investment: 7600, is_active: true },
    { id: 'slbc', title: 'Solibra (SLBC)', description: 'Leader de la brasserie en Côte d\'Ivoire.', type: 'Action', roi_percentage: 4.5, price_per_share: 38800, minimum_investment: 38800, is_active: true },
    { id: 'ftsc', title: 'Filtisac (FTSC)', description: 'Leader de l\'emballage (Jute/Plastique) en Afrique de l\'Ouest.', type: 'Action', roi_percentage: 6.1, price_per_share: 2350, minimum_investment: 2350, is_active: true },
    { id: 'sicc', title: 'Sicable (SICC)', description: 'Secteur industriel / Câbles électriques.', type: 'Action', roi_percentage: 4.8, price_per_share: 4700, minimum_investment: 4700, is_active: true },
    { id: 'stbc', title: 'Servair Togo (STBC)', description: 'Services aériens et restauration en zone UEMOA.', type: 'Action', roi_percentage: 9.8, price_per_share: 21650, minimum_investment: 21650, is_active: true },
    { id: 'unlc', title: 'Unilever CI (UNLC)', description: 'Secteur de la distribution et biens de grande consommation.', type: 'Action', roi_percentage: 5.1, price_per_share: 61000, minimum_investment: 61000, is_active: true },
    { id: 'scrc', title: 'Sucrivoire (SCRC)', description: 'Production et commercialisation du sucre.', type: 'Action', roi_percentage: 3.5, price_per_share: 2680, minimum_investment: 2680, is_active: true },

    // SERVICES PUBLICS ET DISTRIBUTION
    { id: 'ciec', title: 'CIE Côte d\'Ivoire (CIEC)', description: 'Monopole de la distribution d\'électricité en CI.', type: 'Action', roi_percentage: 8.8, price_per_share: 4100, minimum_investment: 4100, is_active: true },
    { id: 'sdcc', title: 'Sodeci (SDCC)', description: 'Distribution d\'eau en Côte d\'Ivoire.', type: 'Action', roi_percentage: 7.7, price_per_share: 11250, minimum_investment: 11250, is_active: true },
    { id: 'cfac', title: 'CFAO Motors CI (CFAC)', description: 'Distribution automobile - Leader du marché ivoirien.', type: 'Action', roi_percentage: 5.6, price_per_share: 1480, minimum_investment: 1480, is_active: true },
    { id: 'ttls', title: 'TotalEnergies Sénégal (TTLS)', description: 'Distribution pétrolière au Sénégal.', type: 'Action', roi_percentage: 6.8, price_per_share: 3300, minimum_investment: 3300, is_active: true },
  ];

  const offers = dbOffers && dbOffers.length > 0 ? dbOffers : DEMO_OFFERS;
  
  // Récupérer le statut du client pour sécuriser les transactions
  const { data: userData } = await supabase.from('users').select('balance, kyc_status').eq('id', user?.id).single();

  const userBalance = parseFloat(userData?.balance || 0);
  const isKycValid = userData?.kyc_status === 'validé';

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <aside className="w-full md:w-64 flex flex-col gap-6">
        <MarketSidebar />
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1 flex items-center gap-2">
               <Activity className="text-brand-accent" /> Placer un Ordre
             </h1>
             <p className="text-gray-500 text-sm font-medium">
               Achetez des actions et obligations directement sur le marché financier.
             </p>
           </div>
           
           <div className="flex flex-col items-end text-right">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre Solde Actuel</span>
             <span className="text-2xl font-black text-brand-dark">{userBalance.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span></span>
           </div>
        </div>

        {!isKycValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Vérification de compte requise</h3>
                  <p className="text-sm text-amber-800">Conformément à la réglementation boursière, vous devez valider votre identité avant d'investir.</p>
                </div>
             </div>
             <Link href="/dashboard/kyc" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap shadow-sm text-sm">
                Valider mon KYC
             </Link>
          </div>
        )}

        <MarketplaceContent 
          initialOffers={offers} 
          userBalance={userBalance} 
          isKycValid={isKycValid} 
        />
      </main>
    </div>
  );
}
