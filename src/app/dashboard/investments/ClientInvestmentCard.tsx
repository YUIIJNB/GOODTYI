'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { buyInvestment } from './actions';
import { useRouter } from 'next/navigation';

export default function ClientInvestmentCard({ 
  offer, 
  userBalance, 
  isKycValid 
}: { 
  offer: any; 
  userBalance: number;
  isKycValid: boolean;
}) {
  const [shares, setShares] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const totalPrice = shares * offer.price_per_share;
  const canAfford = userBalance >= totalPrice;
  const router = useRouter();

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKycValid) {
      setErrorMsg('Votre compte (KYC) doit être validé.');
      return;
    }
    if (!canAfford) {
      setErrorMsg('Fonds insuffisants.');
      return;
    }
    
    setIsPending(true);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('offerId', offer.id);
    formData.append('shares', shares.toString());
    formData.append('totalCost', totalPrice.toString());
    formData.append('title', offer.title);
    
    const res = await buyInvestment(formData);
    
    if (res?.error) {
      setErrorMsg(res.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setIsPending(false);
      setTimeout(() => {
        setSuccess(false);
        setShares(1);
        router.refresh();
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full -mr-12 -mt-12 group-hover:bg-brand-accent/10 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${offer.type === 'Action' ? 'bg-blue-50 text-brand' : 'bg-amber-50 text-amber-600'}`}>
            {offer.type}
          </span>
          <h3 className="text-lg font-black text-gray-800 dark:text-white mt-3 leading-tight tracking-tight">{offer.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-green-600 font-black text-xl flex items-center justify-end gap-1">
            {offer.roi_percentage}% <TrendingUp size={16} />
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rendement</div>
        </div>
      </div>
      
      <p className="text-gray-500 text-xs mb-6 h-10 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed font-medium">
        {offer.description}
      </p>

      <div className="flex justify-between items-end mb-6 bg-gray-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/50">
         <div>
           <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Prix du titre</div>
           <div className="font-black text-gray-900 dark:text-white text-xl">
             {parseFloat(offer.price_per_share).toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">FCFA</span>
           </div>
         </div>
         <div className="text-right">
           <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Cote</div>
           <div className="text-xs font-bold text-green-500 flex items-center justify-end gap-1">Stable</div>
         </div>
      </div>

      <form onSubmit={handleBuy} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 mb-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Unités
          </label>
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1 border border-gray-200 dark:border-zinc-700">
            <button 
              type="button"
              onClick={() => setShares(Math.max(1, shares - 1))}
              className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-brand"
            > - </button>
            <input 
              type="number" 
              min="1" 
              value={shares} 
              onChange={e => setShares(parseInt(e.target.value) || 1)}
              disabled={isPending || success || !isKycValid}
              className="w-12 bg-transparent text-center font-black text-sm focus:outline-none"
            />
            <button 
              type="button"
              onClick={() => setShares(shares + 1)}
              className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-brand"
            > + </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 px-1">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Ordre</span>
           <span className={`font-black text-sm ${!canAfford && isKycValid ? 'text-red-500' : 'text-brand-dark dark:text-white'}`}>
             {totalPrice.toLocaleString('fr-FR')} FCFA
           </span>
        </div>

        {errorMsg && (
          <div className="mb-2 text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg flex items-center gap-2 border border-red-100 animate-shake">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!isKycValid || !canAfford || isPending || success}
          className={`w-full py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all uppercase tracking-[0.15em] text-[10px] shadow-lg
            ${success ? 'bg-green-500 text-white shadow-green-200' 
            : !isKycValid ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            : !canAfford ? 'bg-gray-100 text-red-300 cursor-not-allowed shadow-none'
            : isPending ? 'bg-brand text-white opacity-80 cursor-wait'
            : 'bg-brand hover:bg-brand-dark text-white hover:shadow-brand/30' }
          `}
        >
          {success ? (
            <><CheckCircle size={16} /> Ordre exécuté !</>
          ) : isPending ? (
            <><Loader2 size={16} className="animate-spin" /> Transmission...</>
          ) : !isKycValid ? (
            <><AlertCircle size={16} /> KYC Obligatoire</>
          ) : !canAfford ? (
            <>Solde insuffisant</>
          ) : (
            <><ShoppingCart size={16} /> Acheter les titres</>
          )}
        </button>
      </form>
    </div>
  );
}
