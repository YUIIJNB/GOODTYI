'use client';

import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Layers, Activity } from 'lucide-react';
import ClientInvestmentCard from './ClientInvestmentCard';

export default function MarketplaceContent({ 
  initialOffers, 
  userBalance, 
  isKycValid 
}: { 
  initialOffers: any[], 
  userBalance: number, 
  isKycValid: boolean 
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tous');

  const filteredOffers = initialOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(search.toLowerCase()) || 
                         offer.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'Tous' || offer.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une action, une obligation..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
          {['Tous', 'Action', 'Obligation'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterType === type 
                ? 'bg-white dark:bg-zinc-700 text-brand-dark dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {type === 'Tous' ? 'Tout voir' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map(offer => (
            <ClientInvestmentCard 
              key={offer.id} 
              offer={offer} 
              userBalance={userBalance} 
              isKycValid={isKycValid} 
            />
          ))
        ) : (
          <div className="col-span-full p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <Layers size={48} className="text-gray-200 mb-4" />
            <h3 className="text-gray-800 dark:text-white font-bold text-lg">Aucun résultat trouvé</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Essayez de modifier votre recherche ou vos filtres pour trouver des opportunités.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
