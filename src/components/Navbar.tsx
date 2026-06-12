'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X, Bell } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ userEmail }: { userEmail: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white text-brand-dark sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-brand-dark text-white px-2.5 py-2 rounded-xl font-black text-lg group-hover:bg-brand transition-colors shadow-sm">IB</div>
            <span className="font-black text-xl tracking-tight hidden sm:block text-brand-dark">Investir <span className="text-brand-accent">Bourse</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {userEmail ? (
              <>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 uppercase tracking-widest">
                  <User size={16} className="text-brand-accent" /> {userEmail.split('@')[0]}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 px-5 py-2.5 rounded-xl border border-gray-200 transition-all shadow-sm"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-black text-gray-500 hover:text-brand-dark transition-colors uppercase tracking-widest">Se connecter</Link>
                <Link href="/register" className="bg-brand-dark text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-brand transition-all shadow-md uppercase tracking-widest">Créer un compte</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
             {!userEmail && (
               <Link href="/register" className="bg-brand-accent text-brand-dark text-[10px] font-black px-4 py-2.5 rounded-lg hover:bg-brand-accentHover transition-all uppercase tracking-widest shadow-sm">
                 S'inscrire
               </Link>
             )}
             {userEmail && <button className="text-gray-400 hover:text-brand-dark transition-colors"><Bell size={22} /></button>}
             <button 
               onClick={() => setIsOpen(!isOpen)}
               className="p-2 rounded-xl bg-gray-50 text-brand-dark border border-gray-100 hover:bg-gray-100"
             >
               {isOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

       {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 animate-in slide-in-from-top-4 duration-200 shadow-xl absolute w-full">
           <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setIsOpen(false)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl font-black text-brand-dark uppercase tracking-widest text-sm">Accueil</Link>
              {userEmail ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl font-black text-brand-dark uppercase tracking-widest text-sm">Tableau de Bord</Link>
                  <Link href="/dashboard/investments" onClick={() => setIsOpen(false)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl font-black text-brand-dark uppercase tracking-widest text-sm">Marché Boursier</Link>
                  <Link href="/dashboard/active-investments" onClick={() => setIsOpen(false)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl font-black text-brand-dark uppercase tracking-widest text-sm">Mes Transactions</Link>
                  <hr className="border-gray-100 my-4" />
                  <div className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <User size={16} /> {userEmail}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-4 text-red-500 font-black bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-2 mt-2 uppercase tracking-widest text-sm"
                  >
                    <LogOut size={18} /> Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-gray-100 my-4" />
                  <Link href="/login" onClick={() => setIsOpen(false)} className="p-4 text-center rounded-xl font-black text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm">
                    Se connecter
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="p-4 text-center rounded-xl font-black bg-brand-dark text-white hover:bg-brand transition-colors shadow-md uppercase tracking-widest text-sm">
                    Créer un compte
                  </Link>
                </>
              )}
           </div>
        </div>
      )}
    </nav>
  );
}
