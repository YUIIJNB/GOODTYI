import { createClient } from '@/utils/supabase/server';
import { Plus, Trash2, Tag, TrendingUp, DollarSign, Activity } from 'lucide-react';
import OfferForm from './OfferForm';
import DeleteOfferButton from './DeleteOfferButton';

export default async function AdminOffers() {
  const supabase = createClient();
  const { data: offers } = await supabase
    .from('investment_offers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
             <h1 className="text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight">Catalogue des Offres</h1>
             <p className="text-gray-500 text-sm font-medium">Ajoutez, modifiez ou supprimez les titres financiers disponibles sur le marché.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Form Section */}
           <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm sticky top-8">
                 <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-brand-dark dark:text-white">
                    <Plus className="text-brand-accent" /> Nouvelle Offre
                 </h2>
                 <OfferForm />
              </div>
           </div>
           
           {/* List Section */}
           <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
                 <Activity size={16} /> Offres Actuellement En Ligne
              </h2>
              
              {(!offers || offers.length === 0) ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800 p-12 text-center text-gray-400">
                   Aucune offre enregistrée dans la base de données.
                </div>
              ) : (
                offers.map(offer => (
                  <div key={offer.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand/30 transition-colors group">
                    <div className="flex gap-4 items-center">
                       <div className={`p-3 rounded-lg ${offer.type === 'Action' ? 'bg-blue-50 text-brand' : 'bg-amber-50 text-amber-600'}`}>
                          <Tag size={20} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-black text-gray-800 dark:text-white">{offer.title}</h3>
                             <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded">{offer.type}</span>
                          </div>
                          <div className="flex gap-4 mt-1">
                             <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                <TrendingUp size={12} /> {offer.roi_percentage}%
                             </div>
                             <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                <DollarSign size={12} /> {parseFloat(offer.price_per_share).toLocaleString('fr-FR')} FCFA
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                       <DeleteOfferButton offerId={offer.id} />
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
