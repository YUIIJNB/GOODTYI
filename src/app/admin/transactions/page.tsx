export default function AdminTransactions() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Validation Financière</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
             <h2 className="text-xl font-bold mb-4 text-green-600">Dépôts (Top-up)</h2>
             <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
               <div className="p-4 border-b border-gray-200 dark:border-zinc-800 font-semibold text-sm text-gray-500">
                 En attente de validation
               </div>
               <div className="p-6 text-center text-gray-500 text-sm">
                 Aucun dépôt récent. "Voir avec le gestionnaire" est actif.
               </div>
             </div>
          </div>
          
          <div>
             <h2 className="text-xl font-bold mb-4 text-orange-600">Retraits</h2>
             <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
               <div className="p-4 border-b border-gray-200 dark:border-zinc-800 font-semibold text-sm text-gray-500">
                 Demandes de retrait
               </div>
               <div className="p-6 text-center text-gray-500 text-sm">
                 Aucune demande en attente.
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
