'use client';

import { useState } from 'react';
import { createInvestmentOffer } from '@/app/admin/actions';
import { Loader2, Check } from 'lucide-react';

export default function OfferForm() {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMsg({ text: '', type: '' });
    
    const res = await createInvestmentOffer(formData);
    
    setIsPending(false);
    if (res?.error) {
      setMsg({ text: res.error, type: 'error' });
    } else {
      setMsg({ text: 'Offre publiée !', type: 'success' });
      // Clear form (hack for server actions)
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom du titre</label>
        <input 
          name="title" 
          type="text" 
          placeholder="Ex: SONATEL SN" 
          required 
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-medium" 
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
        <textarea 
          name="description" 
          placeholder="Détails sur l'entreprise ou l'obligation..." 
          required 
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-medium" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Type</label>
          <select 
            name="type" 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-bold"
          >
            <option value="Action">Action</option>
            <option value="Obligation">Obligation</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Rendement %</label>
          <input 
            name="roi" 
            type="number" 
            step="0.01" 
            placeholder="Ex: 7.5" 
            required 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-bold" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Prix unitaire</label>
          <input 
            name="price" 
            type="number" 
            placeholder="Prix en FCFA" 
            required 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-bold" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Invest. Min</label>
          <input 
            name="min_invest" 
            type="number" 
            placeholder="Laissez vide si = prix" 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-brand text-sm font-bold" 
          />
        </div>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-lg text-xs font-bold ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 w-full py-3 bg-brand-dark hover:bg-black text-white font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : msg.type === 'success' ? <Check size={18} /> : 'Publier sur le Marché'}
      </button>
    </form>
  );
}
