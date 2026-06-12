import { createClient } from '@/utils/supabase/server';
import { History, Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import MarketSidebar from '@/components/MarketSidebar';

export default async function TransactionsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Récupérer l'historique des transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .neq('type', 'admin_adjustment')
    .order('created_at', { ascending: false });

  const getTransactionDisplay = (tx: any) => {
    if (tx.type === 'achat_investissement' || tx.type === 'retrait') {
      return {
        sign: '-',
        amountColor: 'text-red-600',
        iconBg: 'bg-red-100 text-red-600'
      };
    }

    return {
      sign: '+',
      amountColor: 'text-green-600',
      iconBg: 'bg-green-100 text-green-600'
    };
  };

  const getStatusStyle = (status: string) => {
    if (status === 'en_attente') return 'text-amber-700 bg-amber-50';
    if (status === 'échoué') return 'text-red-700 bg-red-50';
    return 'text-green-700 bg-green-50';
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <aside className="w-full md:w-64 flex flex-col gap-6">
        <MarketSidebar />
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1 flex items-center gap-2">
               <History className="text-gray-400" /> Mon Historique
             </h1>
             <p className="text-gray-500 text-sm font-medium">
               Retrouvez tous vos achats d'actions et mouvements de compte.
             </p>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Dernières Opérations</h3>
          </div>
          
          <div className="flex flex-col">
            {(!transactions || transactions.length === 0) ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                <Activity size={48} className="mb-4 opacity-20" />
                <p>Aucune transaction effectuée.</p>
                <p className="text-sm mt-1">Vos achats d'actions apparaîtront ici.</p>
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${getTransactionDisplay(tx).iconBg}`}>
                      {(tx.type === 'achat_investissement' || tx.type === 'retrait') ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{tx.description || tx.type}</div>
                      <div className="text-xs text-gray-400 font-medium">
                        {new Date(tx.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black ${getTransactionDisplay(tx).amountColor}`}>
                      {getTransactionDisplay(tx).sign}{parseFloat(tx.amount).toLocaleString('fr-FR')} <span className="text-xs font-bold">FCFA</span>
                    </div>
                    <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded inline-block mt-1 ${getStatusStyle(tx.status)}`}>
                      {tx.status}
                    </div>
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
