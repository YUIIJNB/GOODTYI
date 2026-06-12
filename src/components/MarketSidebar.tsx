export default function MarketSidebar() {
  return (
    <aside className="w-64 hidden lg:flex flex-col gap-6 flex-shrink-0">
        <div className="border border-gray-200 shadow-sm">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm flex justify-between">
             <span>TOP 5</span>
             <span className="text-xs font-normal">Cours</span>
             <span className="text-xs font-normal">Variation</span>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SICC</span><span>4 610</span><span className="text-green-600 font-bold">7,38% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">BOAN</span><span>3 700</span><span className="text-green-600 font-bold">6,67% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SPHC</span><span>6 895</span><span className="text-green-600 font-bold">4,66% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SNTS</span><span>28 700</span><span className="text-green-600 font-bold">3,62% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">ECOC</span><span>16 000</span><span className="text-green-600 font-bold">3,44% ▲</span></div>
           </div>
        </div>

        <div className="border border-gray-200 shadow-sm">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm flex justify-between">
             <span>FLOP 5</span>
             <span className="text-xs font-normal">Cours</span>
             <span className="text-xs font-normal">Variation</span>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SAFC</span><span>3 710</span><span className="text-red-600 font-bold">-7,42% ▼</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">ETIT</span><span>30</span><span className="text-red-600 font-bold">-7,14% ▼</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SEMC</span><span>1 495</span><span className="text-red-600 font-bold">-7,14% ▼</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">STAC</span><span>2 840</span><span className="text-red-600 font-bold">-6,61% ▼</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SHEC</span><span>1 940</span><span className="text-red-600 font-bold">-5,03% ▼</span></div>
           </div>
        </div>

        <div className="border border-gray-200 shadow-sm">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm uppercase">Activités du marché</div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="text-gray-600 text-xs">Valeurs transactions</span><span className="font-bold text-xs">2 919 883 FCFA</span></div>
             <div className="flex justify-between p-2 border-b"><span className="text-gray-600 text-xs">Capitalisation Actions</span><span className="font-bold text-xs">15 384 908 FCFA</span></div>
           </div>
        </div>
    </aside>
  );
}
