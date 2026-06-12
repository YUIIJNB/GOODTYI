import { login } from './actions';

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams?.error;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-8 px-4">
      {/* Sidebar with Top 5 / Flop 5 */}
      <aside className="w-64 hidden md:flex flex-col gap-6">
        <div className="border border-gray-200">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm flex justify-between">
             <span>TOP 5</span>
             <span className="text-xs font-normal">Cours</span>
             <span className="text-xs font-normal">Variation</span>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SICC</span><span>4 220</span><span className="text-green-600 font-bold">7,38% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">BOAN</span><span>3 200</span><span className="text-green-600 font-bold">6,67% ▲</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SPHC</span><span>7 300</span><span className="text-green-600 font-bold">4,66% ▲</span></div>
           </div>
        </div>

        <div className="border border-gray-200">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm flex justify-between">
             <span>FLOP 5</span>
             <span className="text-xs font-normal">Cours</span>
             <span className="text-xs font-normal">Variation</span>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="font-bold">SAFC</span><span>5 425</span><span className="text-red-600 font-bold">-7,42% ▼</span></div>
             <div className="flex justify-between p-2 border-b"><span className="font-bold">ETIT</span><span>26</span><span className="text-red-600 font-bold">-7,14% ▼</span></div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white p-6 md:p-8 border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <h1 className="text-2xl text-brand-dark font-black border-b border-gray-200 pb-2 mb-6 uppercase tracking-tight">Espace Client</h1>
        
        {/* Tabs mock */}
        <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-8 text-sm gap-1 sm:gap-0">
          <a href="/register" className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 text-center font-bold">Créer un compte</a>
          <div className="px-4 py-3 bg-brand-accent text-brand-dark font-black uppercase tracking-wider text-center shadow-sm">Se connecter</div>
          <a href="#" className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 text-center font-bold">Mot de passe oublié ?</a>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form action={login} className="flex flex-col gap-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nom d'utilisateur <span className="text-red-500">*</span></label>
            <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 bg-gray-50 focus:outline-none focus:border-brand-accent" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe <span className="text-red-500">*</span></label>
            <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 bg-gray-50 focus:outline-none focus:border-brand-accent" />
          </div>
          <div>
            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-black uppercase tracking-widest text-sm shadow-md transition-colors rounded-lg">
              Se connecter
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
