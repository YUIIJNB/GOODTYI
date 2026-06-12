'use client';

import { useState } from 'react';
import { deleteInvestmentOffer } from '@/app/admin/actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteOfferButton({ offerId }: { offerId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
    
    setIsPending(true);
    await deleteInvestmentOffer(offerId);
    setIsPending(false);
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      title="Supprimer l'offre"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
