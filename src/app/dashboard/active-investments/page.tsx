import { createClient } from '@/utils/supabase/server';
import { History, Activity, DollarSign } from 'lucide-react';
import MarketSidebar from '@/components/MarketSidebar';
import { sellInvestment } from './actions';

export default async function ActiveInvestmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-lg font-semibold text-gray-800">Connectez-vous pour accéder à votre portefeuille.</p>
      </div>
    );
  }

  const [{ data: investments }, { data: transactions }] = await Promise.all([
    supabase
      .from('user_investments')
      .select('id, offer_id, amount_invested, current_value, shares_bought, status, investment_offers ( title, price_per_share )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('transactions')
      .select('id, type, amount, status, description, created_at')
      .eq('user_id', user.id)
      .neq('type', 'admin_adjustment')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const activeInvestments = (investments || []).filter((inv: any) => inv.status !== 'clôturé');
  const closedInvestments = (investments || []).filter((inv: any) => inv.status === 'clôturé');

  const portfolioValue = activeInvestments.reduce((sum: number, inv: any) => {
    const value = parseFloat(inv.current_value ?? inv.amount_invested ?? 0);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  const totalInvested = activeInvestments.reduce((sum: number, inv: any) => {
    const invested = parseFloat(inv.amount_invested ?? 0);
    return sum + (isNaN(invested) ? 0 : invested);
  }, 0);
  const gainLoss = portfolioValue - totalInvested;
  const gainPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  const getStatusBadge = (status: string) => {
    if (status === 'actif') return 'text-emerald-700 bg-emerald-50';
    if (status === 'clôturé') return 'text-slate-700 bg-slate-100';
    return 'text-amber-700 bg-amber-50';
  };

  const getTransactionDisplay = (tx: any) => {
    if (tx.type === 'achat_investissement' || tx.type === 'retrait') {
      return { sign: '-', color: 'text-red-600', iconBg: 'bg-red-100 text-red-600' };
    }
    return { sign: '+', color: 'text-green-600', iconBg: 'bg-green-100 text-green-600' };
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
              <History className="text-gray-400" /> Portefeuille & Ventes
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Gérez vos positions, suivez vos gains et vendez directement depuis votre portefeuille.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <DollarSign size={16} /> {activeInvestments.length} position(s) actives
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="text-xs uppercase tracking-[0.24em] font-bold text-gray-400 mb-3">Valeur totale</div>
            <div className="text-3xl font-black text-brand-dark mb-2">{portfolioValue.toLocaleString('fr-FR')} <span className="text-sm font-bold text-gray-400">FCFA</span></div>
            <div className="text-xs text-gray-500">Valeur actuelle de vos positions ouvertes.</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="text-xs uppercase tracking-[0.24em] font-bold text-gray-400 mb-3">Montant investi</div>
            <div className="text-3xl font-black text-brand-dark mb-2">{totalInvested.toLocaleString('fr-FR')} <span className="text-sm font-bold text-gray-400">FCFA</span></div>
            <div className="text-xs text-gray-500">Somme investie dans les positions ouvertes.</div>
          </div>
          <div className={`rounded-xl p-6 border shadow-sm ${gainLoss >= 0 ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
            <div className="text-xs uppercase tracking-[0.24em] font-bold text-gray-400 mb-3">Performance</div>
            <div className={`text-3xl font-black ${gainLoss >= 0 ? 'text-emerald-800' : 'text-rose-800'} mb-2`}>{gainLoss.toLocaleString('fr-FR')} FCFA</div>
            <div className={`text-sm font-bold ${gainLoss >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{gainPercent.toFixed(2)}%</div>
            <div className="text-xs text-gray-500 mt-2">Gain / perte depuis la création des positions.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-800">Positions Actives</h2>
              <p className="text-sm text-gray-500 mt-1">Vendez vos positions ouvertes en un clic.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Titre</th>
                    <th className="px-5 py-4">Investi</th>
                    <th className="px-5 py-4">Valeur</th>
                    <th className="px-5 py-4">Gain</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvestments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-400">Aucune position active. Passez sur l'onglet opportunités pour acheter des actions.</td>
                    </tr>
                  ) : (
                    activeInvestments.map((investment: any) => {
                      const currentValue = parseFloat(investment.current_value ?? investment.amount_invested ?? 0);
                      const invested = parseFloat(investment.amount_invested ?? 0);
                      const profit = currentValue - invested;
                      const title = investment.investment_offers?.title || `Position ${investment.id?.slice(0, 6)}`;

                      return (
                        <tr key={investment.id} className="border-b last:border-b-0 border-gray-100">
                          <td className="px-5 py-4 align-top">
                            <div className="font-bold text-gray-900">{title}</div>
                            {investment.shares_bought ? <div className="text-xs text-gray-500">{investment.shares_bought} titre(s)</div> : null}
                          </td>
                          <td className="px-5 py-4 align-top text-gray-800">{invested.toLocaleString('fr-FR')} FCFA</td>
                          <td className="px-5 py-4 align-top text-gray-800">{currentValue.toLocaleString('fr-FR')} FCFA</td>
                          <td className={`px-5 py-4 align-top font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {profit >= 0 ? '+' : ''}{profit.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusBadge(investment.status)}`}>
                              {investment.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 align-top">
                            <form action={sellInvestment} className="inline-flex">
                              <input type="hidden" name="investmentId" value={investment.id} />
                              <input type="hidden" name="offerTitle" value={title} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                              >
                                Vendre
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-800">Dernières Transactions</h2>
              <p className="text-sm text-gray-500 mt-1">Soldes, achats et ventes récents.</p>
            </div>

            <div className="flex flex-col gap-0">
              {(!transactions || transactions.length === 0) ? (
                <div className="p-10 text-center text-gray-400">Aucune transaction trouvée.</div>
              ) : (
                transactions.map((tx: any) => {
                  const display = getTransactionDisplay(tx);
                  return (
                    <div key={tx.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-gray-900">{tx.description || tx.type}</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(tx.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-black ${display.color}`}>{display.sign}{parseFloat(tx.amount).toLocaleString('fr-FR')} FCFA</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded inline-block mt-1 bg-slate-100 text-slate-600">{tx.status}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {closedInvestments.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-brand-dark mb-3">Positions clôturées</h2>
            <p className="text-sm text-gray-500 mb-4">
              {closedInvestments.length} position(s) clôturée(s). Les ventes effectuées restent disponibles dans l'historique des transactions.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {closedInvestments.map((investment: any) => {
                const title = investment.investment_offers?.title || `Position ${investment.id?.slice(0, 6)}`;
                return (
                  <div key={investment.id} className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
                    <div className="font-bold text-gray-900">{title}</div>
                    <div className="mt-2 text-sm text-gray-600">Investi: {parseFloat(investment.amount_invested).toLocaleString('fr-FR')} FCFA</div>
                    <div className="mt-1 text-sm text-gray-600">Clôturée</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
