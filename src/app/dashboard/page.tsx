'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MarketSidebar from '@/components/MarketSidebar';
import { Wallet, PieChart, Activity, ArrowUpRight, History, ShieldCheck, ChevronRight, AlertCircle, CheckCircle, PlusCircle, MinusCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitWithdrawalRequest, syncMyPortfolioBalances } from './actions';

export default function Dashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [userData, setUserData] = useState({ balance: 0, kyc_status: 'en_attente' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [showManagerPopup, setShowManagerPopup] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'mobile_money' | 'bank_transfer'>('mobile_money');
  const [isWithdrawPending, setIsWithdrawPending] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    const supabase = createClient();

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await syncMyPortfolioBalances();

        const { data: uData } = await supabase.from('users').select('balance, kyc_status').eq('id', user.id).single();
        if (uData) setUserData({ balance: parseFloat(uData.balance || 0), kyc_status: uData.kyc_status });

        const { data: investments } = await supabase
          .from('user_investments')
          .select('amount_invested, current_value, status')
          .eq('user_id', user.id);

        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .neq('type', 'admin_adjustment')
          .order('created_at', { ascending: false })
          .limit(5);
        if (txs) {
          setTransactions(txs);
        }

        const activePortfolioValue = (investments || [])
          .filter((inv) => inv.status !== 'clôturé')
          .reduce((acc, inv) => acc + parseFloat(inv.current_value ?? inv.amount_invested ?? 0), 0);
        const activeInvestedAmount = (investments || [])
          .filter((inv) => inv.status !== 'clôturé')
          .reduce((acc, inv) => acc + parseFloat(inv.amount_invested ?? 0), 0);

        // Fallback sur les transactions si aucun enregistrement d'investissement n'existe encore.
        const txPortfolioValue = (txs || [])
          .filter((t) => t.type === 'achat_investissement')
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        setPortfolioValue(activePortfolioValue > 0 ? activePortfolioValue : txPortfolioValue);
        setTotalInvested(activeInvestedAmount > 0 ? activeInvestedAmount : txPortfolioValue);

        const channel = supabase
          .channel(`user-balance-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'users',
              filter: `id=eq.${user.id}`,
            },
            (payload: any) => {
              const updatedBalance = parseFloat(payload.new?.balance || 0);
              const updatedKyc = payload.new?.kyc_status || 'en_attente';
              setUserData({ balance: updatedBalance, kyc_status: updatedKyc });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }

    let cleanup: (() => void) | undefined;
    loadData().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const getTransactionDisplay = (tx: any) => {
    if (tx.type === 'achat_investissement' || tx.type === 'retrait') {
      return { sign: '-', color: 'text-red-600' };
    }
    return { sign: '+', color: 'text-green-600' };
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8">
      
      {/* Sidebar Area */}
      <aside className="w-full md:w-64 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="bg-brand-dark text-white font-bold px-5 py-4 flex justify-between items-center text-sm">
             <span className="uppercase tracking-wider">Interface Client</span>
           </div>
           <div className="flex flex-col text-sm">
              <Link href="/dashboard" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 bg-brand-dark/5 text-brand-dark font-bold hover:bg-gray-50 transition-colors">
                <PieChart size={18} /> Vue d'ensemble
              </Link>
              <Link href="/dashboard/investments" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
                <Activity size={18} /> Opportunités
              </Link>
              <Link href="/dashboard/active-investments" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
                <History size={18} /> Mes Transactions
              </Link>
              {userData.kyc_status !== 'validé' && (
                <Link href="/dashboard/kyc" className="px-5 py-3 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
                  <ShieldCheck size={18} /> Conformité KYC
                </Link>
              )}
           </div>
        </div>
        
        <MarketSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Header Block */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1">Tableau de bord</h1>
             <p className="text-gray-500 text-sm font-medium capitalize flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               {currentDate || 'Chargement de la date...'} 
             </p>
           </div>
           {userData.kyc_status === 'validé' ? (
             <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
               <CheckCircle className="text-green-600" size={20} />
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-green-800 uppercase tracking-widest">Statut Compte</span>
                 <span className="text-sm font-medium text-green-900">Vérifié & Actif</span>
               </div>
             </div>
           ) : (
             <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
               <AlertCircle className="text-amber-600" size={20} />
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Statut Compte</span>
                 <span className="text-sm font-medium text-amber-900">En attente de validation KYC</span>
               </div>
             </div>
           )}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Card 1 */}
           <div className="bg-gradient-to-br from-brand-dark to-brand rounded-xl p-6 text-white shadow-md relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Wallet size={80} /></div>
             <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Solde Disponible</h3>
             <div className="text-3xl font-black mb-1">{userData.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-white/50">FCFA</span></div>
             <div className="text-green-400 text-xs font-medium flex items-center mt-3 bg-white/10 w-max px-2 py-1 rounded">
               <ArrowUpRight size={14} className="mr-1" /> Actif
             </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-brand"><PieChart size={80} /></div>
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Valeur du Portefeuille</h3>
             <div className="text-3xl font-black text-brand-dark mb-1">{portfolioValue.toLocaleString('fr-FR')} <span className="text-sm font-bold text-gray-400">FCFA</span></div>
             <div className="text-gray-500 text-xs font-medium flex items-center mt-3 bg-gray-50 w-max px-2 py-1 rounded">
               <Activity size={14} className="mr-1 text-gray-400" /> {portfolioValue > 0 ? 'Investissements actifs' : 'Aucun investissement'}
             </div>
             <div className="text-[11px] text-gray-500 font-semibold mt-2">
               Total investi: {totalInvested.toLocaleString('fr-FR')} FCFA
             </div>
           </div>

           {/* Card 3 - Quick Actions */}
           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center gap-3">
              <h3 className="text-gray-800 text-sm font-bold mb-1">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowManagerPopup(true)}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                  <PlusCircle size={14} /> Depot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawError('');
                    setWithdrawSuccess(false);
                    setShowWithdrawPopup(true);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                  <MinusCircle size={14} /> Retrait
                </button>
              </div>
              <button 
                onClick={() => document.location.href = '/dashboard/investments'}
                className="w-full bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Placer un Ordre
              </button>
              <Link href="/dashboard/investments" className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                Voir les offres <ChevronRight size={16} />
              </Link>
           </div>
        </div>

        {/* Main Content Area: Distribution & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
             <h2 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
               <PieChart size={20} className="text-brand-accent" />
               Répartition des Actifs
             </h2>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="20" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Total</span>
                     <span className="text-sm font-black text-brand-dark">100%</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 text-sm flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-gray-200"></span> <span className="font-medium text-gray-600">Liquidités</span></div>
                      <span className="font-bold">{userData.balance > 0 || portfolioValue === 0 ? Math.round((userData.balance / (userData.balance + portfolioValue || 1)) * 100) : 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-brand"></span> <span className="font-medium text-gray-600">Investissements</span></div>
                      <span className="font-bold">{portfolioValue > 0 ? Math.round((portfolioValue / (userData.balance + portfolioValue)) * 100) : 0}%</span>
                    </div>
                 </div>
             </div>
           </div>

           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                 <History size={20} className="text-brand-accent" />
                 Activité Récente
               </h2>
              <Link href="/dashboard/active-investments" className="text-xs font-bold text-brand hover:underline">Voir tout</Link>
             </div>
             
             <div className="flex-1 flex flex-col pt-2">
                {transactions.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 mb-3">
                      <Activity size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">Aucune transaction</h3>
                    <p className="text-xs text-gray-500">Votre historique d'investissement apparaîtra ici.</p>
                  </div>
                ) : (
                  transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="py-3 border-b border-gray-50 flex justify-between items-center last:border-0 hover:bg-gray-50 -mx-6 px-6 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-800">{tx.description || tx.type}</span>
                        <span className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className={`text-sm font-bold ${getTransactionDisplay(tx).color}`}>
                        {getTransactionDisplay(tx).sign}{parseFloat(tx.amount).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))
                )}
             </div>
           </div>
        </div>

      </main>

      {showManagerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setShowManagerPopup(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 text-center">
            <h3 className="text-lg font-black text-brand-dark mb-2">Depot</h3>
            <p className="text-sm text-gray-600 font-medium mb-5">Contactez votre gestionnaire.</p>
            <button
              type="button"
              onClick={() => setShowManagerPopup(false)}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showWithdrawPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => !isWithdrawPending && setShowWithdrawPopup(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl p-6">
            <h3 className="text-xl font-black text-brand-dark">Demande de retrait</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Solde disponible: {userData.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FCFA
            </p>

            <form
              action={async (formData) => {
                setIsWithdrawPending(true);
                setWithdrawError('');
                setWithdrawSuccess(false);
                const res = await submitWithdrawalRequest(formData);
                if (res?.error) {
                  setWithdrawError(res.error);
                } else {
                  setWithdrawSuccess(true);
                  setTimeout(() => {
                    setShowWithdrawPopup(false);
                    router.refresh();
                  }, 1200);
                }
                setIsWithdrawPending(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="1"
                  required
                  disabled={isWithdrawPending}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Ex: 50000"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-2">Mode de paiement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('mobile_money')}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold ${
                      withdrawMethod === 'mobile_money'
                        ? 'bg-brand-accent/30 text-brand-dark border-brand-accent'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank_transfer')}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold ${
                      withdrawMethod === 'bank_transfer'
                        ? 'bg-brand-accent/30 text-brand-dark border-brand-accent'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Virement bancaire
                  </button>
                </div>
                <input type="hidden" name="method" value={withdrawMethod} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nom du beneficiaire</label>
                <input
                  type="text"
                  name="holderName"
                  required
                  disabled={isWithdrawPending}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Nom complet"
                />
              </div>

              {withdrawMethod === 'mobile_money' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Operateur</label>
                    <select
                      name="mobileOperator"
                      required
                      disabled={isWithdrawPending}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand bg-white"
                    >
                      <option value="">Selectionner</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Moov Money">Moov Money</option>
                      <option value="Wave">Wave</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Numero mobile</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      required
                      disabled={isWithdrawPending}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder="07XXXXXXXX"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Banque</label>
                    <input
                      type="text"
                      name="bankName"
                      required
                      disabled={isWithdrawPending}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder="Ex: SGCI"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Numero de compte</label>
                    <input
                      type="text"
                      name="accountNumber"
                      required
                      disabled={isWithdrawPending}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder="Ex: CI00..."
                    />
                  </div>
                </div>
              )}

              {withdrawError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {withdrawError}
                </p>
              )}
              {withdrawSuccess && (
                <p className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                  Demande envoyee avec succes. Un gestionnaire la traitera.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawPopup(false)}
                  disabled={isWithdrawPending}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawPending}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider"
                >
                  {isWithdrawPending ? 'Envoi...' : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
