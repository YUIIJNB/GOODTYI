'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Info, ArrowRight, ArrowUpRight, BarChart3, Newspaper, Calendar } from 'lucide-react';

export default function Home() {
  const [dates, setDates] = useState({ today: '', past1: '', past2: '' });
  const [marketStats, setMarketStats] = useState({
    capActions: 15385,
    capObli: 10420,
    valTrans: 2919,
    indice: 228.45
  });

  const [topActive, setTopActive] = useState([
    { ticker: 'SNTS', name: 'SONATEL SN', cours: 28700, var: 1.20 },
    { ticker: 'ORAC', name: 'ORANGE CI', cours: 15650, var: 0.85 },
    { ticker: 'SGBC', name: 'SOCIÉTÉ GÉNÉRALE CI', cours: 36200, var: 0.50 },
    { ticker: 'ECOC', name: 'ECOBANK CI', cours: 16000, var: 1.10 },
    { ticker: 'CBIBF', name: 'CORIS BANK INT.', cours: 20700, var: 2.30 }
  ]);

  const [flopActive, setFlopActive] = useState([
    { ticker: 'ONTBF', name: 'ONATEL BF', cours: 2855, var: -2.30 },
    { ticker: 'NTLC', name: 'NESTLÉ TOGO', cours: 13425, var: -1.50 },
    { ticker: 'FTSC', name: 'FILTISAC CI', cours: 2300, var: -3.42 },
    { ticker: 'SCRC', name: 'SUCRIVOIRE CI', cours: 2645, var: -4.10 },
    { ticker: 'ETIT', name: 'ECOBANK TG', cours: 30, var: -7.14 }
  ]);

  useEffect(() => {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const d1 = new Date(d);
    d1.setDate(d1.getDate() - 2);
    
    const d2 = new Date(d);
    d2.setDate(d2.getDate() - 5);

    setDates({
      today: formatter.format(d),
      past1: formatter.format(d1),
      past2: formatter.format(d2)
    });

    // Simulate Live Demo Data
    const liveInterval = setInterval(() => {
      setMarketStats(prev => ({
        capActions: prev.capActions + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5),
        capObli: prev.capObli + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5),
        valTrans: prev.valTrans + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20),
        indice: +(prev.indice + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2)
      }));

      setTopActive(prev => prev.map(stock => {
        const change = (Math.random() > 0.4 ? 1 : -1) * Math.floor(Math.random() * (stock.cours > 1000 ? 25 : 2));
        return {
          ...stock,
          cours: Math.max(1, stock.cours + change),
          var: +(stock.var + (change > 0 ? 0.05 : -0.05)).toFixed(2)
        }
      }));

      setFlopActive(prev => prev.map(stock => {
        const change = (Math.random() > 0.6 ? 1 : -1) * Math.floor(Math.random() * (stock.cours > 1000 ? 25 : 2));
        return {
          ...stock,
          cours: Math.max(1, stock.cours + change),
          var: +(stock.var + (change > 0 ? 0.05 : -0.05)).toFixed(2)
        }
      }));
    }, 3000);

    return () => clearInterval(liveInterval);
  }, []);

  return (
    <main className="flex flex-col gap-8 pb-12">
      {/* Search & Intro Banner */}
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="min-h-[320px] py-12 bg-brand relative w-full overflow-hidden flex items-center px-8">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-start w-full md:w-2/3 text-white">
              <span className="bg-brand-accent text-brand-dark font-black text-[10px] tracking-widest px-3 py-1 uppercase rounded-sm mb-4">Investir Bourse</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 leading-none tracking-tight">Investissez dans<br/><span className="text-brand-accent">l'avenir</span> des marchés</h1>
              <p className="text-white/80 font-medium mb-8 max-w-lg">
                Rejoignez le marché boursier régional et participez à la croissance des entreprises les plus performantes de la région ouest-africaine.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                <Link href="/register" className="bg-brand-accent hover:bg-brand-accentHover text-brand-dark text-center font-black uppercase text-sm px-8 py-4 rounded-xl transition-all shadow-xl hover:scale-105 w-full sm:w-auto">
                  Ouvrir un compte
                </Link>
                <Link href="/login" className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-black uppercase text-center text-sm px-8 py-4 rounded-xl transition-all hover:scale-105 w-full sm:w-auto backdrop-blur-sm">
                  Se Connecter
                </Link>
              </div>
            </div>
            
            {/* Mock Chart Graphic */}
            <div className="absolute right-0 bottom-0 hidden md:flex items-end h-[85%] opacity-90 pointer-events-none">
                <div className="w-12 h-[20%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t border-white/20"></div>
                <div className="w-12 h-[35%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t border-white/20"></div>
                <div className="w-12 h-[25%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t border-white/20"></div>
                <div className="w-12 h-[55%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t-2 border-brand-accent/50"></div>
                <div className="w-12 h-[45%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t-2 border-brand-accent/50 relative">
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-brand-dark font-black text-[10px] tracking-widest bg-brand-accent px-3 py-1 rounded shadow-lg uppercase">
                     IB Composite
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-t-4 border-t-brand-accent border-x-4 border-x-transparent border-b-0 w-0 h-0"></div>
                   </div>
                </div>
                <div className="w-12 h-[65%] bg-gradient-to-t from-white/0 to-white/10 ml-2 rounded-t flex flex-col justify-start border-t-2 border-brand-accent/80"></div>
                <div className="w-16 h-[80%] bg-gradient-to-t from-brand-accent/0 to-brand-accent/30 ml-2 rounded-t border-t-4 border-brand-accent shadow-[0_0_30px_rgba(249,115,22,0.3)] mr-8 relative">
                   <div className="absolute -top-3 right-0 w-3 h-3 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white"></div>
                </div>
            </div>
          </div>
      </div>

      {/* Main Stats Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 -m-8 text-gray-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110">
           <BarChart3 size={200} />
         </div>
         {/* Ticker banner */}
         <div className="bg-brand-accent/10 border-l-4 border-brand-accent text-brand-dark text-sm py-3 px-4 font-bold mb-6 flex items-center shadow-inner rounded-r">
           <Info className="h-5 w-5 mr-3 text-brand-accent" />
           <span className="flex-1">Paiement des coupons d'intérêts et / ou remboursement de capital le {dates.today || '...'}.</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {/* Stat Box 1 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
               <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Capitalisation Actions</div>
               <div className="text-2xl font-black text-brand-dark">{marketStats.capActions.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">Mds FCFA</span></div>
               <div className="text-green-600 text-xs font-bold mt-2 flex items-center transition-opacity">
                 <ArrowUpRight size={14} className="mr-1" /> +1.5% 
               </div>
            </div>
            {/* Stat Box 2 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
               <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Capitalisation Obligations</div>
               <div className="text-2xl font-black text-brand-dark">{marketStats.capObli.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">Mds FCFA</span></div>
               <div className="text-green-600 text-xs font-bold mt-2 flex items-center">
                 <ArrowUpRight size={14} className="mr-1" /> +0.8% 
               </div>
            </div>
            {/* Stat Box 3 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
               <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Valeur Transactions</div>
               <div className="text-2xl font-black text-brand-dark">{marketStats.valTrans.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">Mls FCFA</span></div>
               <div className="text-gray-500 text-xs font-bold mt-2">Dernière séance</div>
            </div>
            {/* Stat Box 4 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-shadow hover:shadow-md border-b-4 border-b-red-500">
               <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Indice IB Composite</div>
               <div className="text-2xl font-black text-brand-dark">{marketStats.indice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-gray-400">Pts</span></div>
               <div className="text-red-500 text-xs font-bold mt-2 flex items-center">
                 <TrendingDown size={14} className="mr-1" /> -0.34% 
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Top 5 Section */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
             <div className="bg-gradient-to-r from-brand-dark to-brand text-white font-bold p-4 text-sm flex justify-between items-center shadow-inner">
              <span className="uppercase tracking-wider font-black flex items-center gap-2"><TrendingUp size={18} className="text-green-400"/> TOP 5 Actifs</span>
              <div className="flex gap-4 text-xs font-medium opacity-80">
                <span>Cours</span>
                <span>Var</span>
              </div>
             </div>
             <div className="text-sm flex-1 relative overflow-hidden">
              {topActive.map((stock, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col"><span className="font-bold text-brand-dark">{stock.ticker}</span><span className="text-[10px] text-gray-500 uppercase tracking-wide">{stock.name}</span></div>
                  <div className="flex gap-6 items-center">
                     <span className="font-medium transition-all">{stock.cours.toLocaleString('fr-FR')}</span>
                     <span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded min-w-[65px] text-right text-xs transition-all">
                       {stock.var > 0 ? '+' : ''}{stock.var}%
                     </span>
                  </div>
                </div>
              ))}
             </div>
             <div className="p-3 bg-gray-50 text-center text-xs font-bold text-brand hover:text-brand-accent cursor-pointer transition-colors uppercase mt-auto flex items-center justify-center gap-1">
               Voir tout <ArrowRight size={14} />
             </div>
         </div>

         {/* Flop 5 Section */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
             <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold p-4 text-sm flex justify-between items-center shadow-inner">
              <span className="uppercase tracking-wider font-black flex items-center gap-2"><TrendingDown size={18} className="text-red-400"/> FLOP 5 Actifs</span>
              <div className="flex gap-4 text-xs font-medium opacity-80">
                <span>Cours</span>
                <span>Var</span>
              </div>
             </div>
              <div className="text-sm flex-1 relative overflow-hidden">
              {flopActive.map((stock, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-dark">{stock.ticker}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">{stock.name}</span>
                  </div>
                  <div className="flex gap-6 items-center">
                     <span className="font-medium transition-all">{stock.cours.toLocaleString('fr-FR')}</span>
                     <span className="text-red-700 font-bold bg-red-50 px-2 py-1 rounded min-w-[65px] text-right text-xs transition-all">
                       {stock.var > 0 ? '+' : ''}{stock.var}%
                     </span>
                  </div>
                </div>
              ))}
             </div>
             <div className="p-3 bg-gray-50 text-center text-xs font-bold text-brand hover:text-brand-accent cursor-pointer transition-colors uppercase mt-auto flex items-center justify-center gap-1">
               Voir tout <ArrowRight size={14} />
             </div>
         </div>

         {/* Actualités / Dernières OPVs */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-brand-dark text-white font-bold p-4 text-sm uppercase tracking-wider font-black flex items-center gap-2">
              <Newspaper size={18} className="text-brand-accent" />
              Dernières Opportunités
            </div>
            
            <div className="flex-1 flex flex-col">
               {/* News Item 1 */}
               <div className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                     <span className="bg-brand-accent/20 text-brand-dark font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider">Obligation</span>
                     <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase"><Calendar size={10}/> {dates.today || '...'}</span>
                  </div>
                  <h3 className="font-bold text-sm text-brand-dark group-hover:text-brand transition-colors leading-tight">TPCI 6.00% 2026-2030 (Nouvelle Tranche)</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Le Trésor Public de Côte d'Ivoire lance un emprunt obligataire TPCI à 6.00% sur 4 ans.</p>
               </div>

               {/* News Item 2 */}
               <div className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                     <span className="bg-green-100 text-green-800 font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider">OPV</span>
                     <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase"><Calendar size={10}/> {dates.past1 || '...'}</span>
                  </div>
                  <h3 className="font-bold text-sm text-brand-dark group-hover:text-brand transition-colors leading-tight">Orange CI - Offre Publique de Vente</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">L'introduction en bourse d'Orange CI est officiellement lancée avec un prix par action fixé à 9 500 FCFA.</p>
               </div>

               {/* News Item 3 */}
               <div className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                     <span className="bg-purple-100 text-purple-700 font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider">Alerte Bourse</span>
                     <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase"><Calendar size={10}/> {dates.past2 || '...'}</span>
                  </div>
                  <h3 className="font-bold text-sm text-brand-dark group-hover:text-brand transition-colors leading-tight">Mégaprojet: Introduction de Dangote Refinery</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">L'introduction imminente de la raffinerie de Dangote (valorisée à 50 milliards $) va transformer la dimension du marché régional.</p>
               </div>
            </div>

            <div className="p-3 bg-brand-accent text-brand-dark text-center text-xs font-black uppercase cursor-pointer hover:bg-brand-accentHover transition-colors flex items-center justify-center mt-auto gap-1">
               Voir toutes les actualités 
               <ArrowRight size={14} />
            </div>
         </div>
      </div>
    </main>
  );
}
