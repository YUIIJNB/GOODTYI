'use client';

import { useState, useTransition } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { syncAllBalancesAfterPriceUpdate } from './actions';

export default function SyncBalancesButton() {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    setMessage('');
    startTransition(async () => {
      const result = await syncAllBalancesAfterPriceUpdate();
      if (result.error && !result.success) {
        setMessage(result.error);
        return;
      }
      const credited = result.totalCredited ?? 0;
      const users = result.adjustedUsers ?? 0;
      if (users === 0) {
        setMessage('Aucun ajustement nécessaire (soldes déjà à jour).');
      } else {
        setMessage(
          `${users} client(s) ajusté(s). Total crédité/débité : ${credited >= 0 ? '+' : ''}${Math.round(credited).toLocaleString('fr-FR')} FCFA`
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleSync}
        disabled={isPending}
        className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded font-bold transition-colors shadow-sm uppercase text-xs tracking-wider flex items-center gap-2 disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
        Ajuster les soldes (nouveaux cours)
      </button>
      {message && <p className="text-sm text-gray-600 max-w-md text-center">{message}</p>}
    </div>
  );
}
