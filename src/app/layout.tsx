import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Investir Bourse - Plateforme d\'investissement',
  description: 'Gérez vos investissements boursiers avec Investir Bourse.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin' || user.email === 'admin@invest.com') {
      isAdmin = true
    }
  }

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar userEmail={user?.email} />
        
        {/* Secondary Admin Navigation Bar if Admin */}
        {isAdmin && user && (
          <div className="bg-brand-dark text-white px-4 py-2 flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
             <a href="/admin" className="hover:underline">Dashboard Admin</a>
             <a href="/admin/users" className="hover:underline">Gestion Clients</a>
             <a href="/admin/offers" className="hover:underline">Catalogue Offres</a>
          </div>
        )}

        <div className="flex-1 w-full container mx-auto">
          {children}
        </div>

        <footer className="bg-white pt-16 pb-8 border-t border-gray-200 mt-20">
           <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="bg-brand-dark text-white px-2.5 py-2 rounded-xl font-black text-lg shadow-sm">IB</div>
                    <span className="font-black text-xl tracking-tight text-brand-dark">Investir <span className="text-brand-accent">Bourse</span></span>
                 </div>
                 <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed font-medium">
                    Plateforme dédiée à la démocratisation de l'investissement boursier. Accédez aux meilleures opportunités avec une sécurité maximale.
                 </p>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all cursor-pointer text-gray-500">
                       <span className="font-bold">in</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all cursor-pointer text-gray-500">
                       <span className="font-bold">tw</span>
                    </div>
                 </div>
              </div>
              
              <div>
                 <h4 className="font-black text-brand-dark mb-6 uppercase tracking-widest text-xs">Navigation</h4>
                 <ul className="flex flex-col gap-4 text-sm text-gray-500 font-bold">
                    <li><a href="/dashboard" className="hover:text-brand transition-colors">Tableau de Bord</a></li>
                    <li><a href="/dashboard/investments" className="hover:text-brand transition-colors">Marché Financier</a></li>
                    <li><a href="/dashboard/active-investments" className="hover:text-brand transition-colors">Mes Transactions</a></li>
                    <li><a href="/dashboard/kyc" className="hover:text-brand transition-colors">Conformité</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-black text-brand-dark mb-6 uppercase tracking-widest text-xs">Légal</h4>
                 <ul className="flex flex-col gap-4 text-sm text-gray-500 font-bold">
                    <li><a href="#" className="hover:text-brand transition-colors">Conditions d'Utilisation</a></li>
                    <li><a href="#" className="hover:text-brand transition-colors">Politique de Confidentialité</a></li>
                    <li><a href="#" className="hover:text-brand transition-colors">Mentions Légales</a></li>
                    <li><a href="#" className="hover:text-brand transition-colors">Support Client</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>© 2026 Investir Bourse. Tous droits réservés.</span>
              <div className="flex gap-4 items-center">
                 <span>Plateforme agréée</span>
                 <span className="text-brand-dark bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Certifié SecuroMax</span>
              </div>
           </div>
        </footer>
      </body>
    </html>
  )
}
