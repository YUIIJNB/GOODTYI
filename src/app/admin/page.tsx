import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Users, ShieldAlert, Wallet, TrendingUp, UserCheck } from 'lucide-react'
import SyncBalancesButton from './SyncBalancesButton'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: users, error } = await supabase.from('users').select('*')
  
  const totalUsers = users?.length || 0
  const pendingKyc = users?.filter(u => u.kyc_status !== 'validé')?.length || 0
  const activeKyc = users?.filter(u => u.kyc_status === 'validé')?.length || 0
  
  const totalFunds = users?.reduce((acc, user) => acc + parseFloat(user.balance || 0), 0) || 0

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hidden md:block">
        <div className="text-xl font-black text-brand-dark mb-8">Espace <span className="text-brand-accent">Admin</span></div>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="px-4 py-3 bg-gray-100 dark:bg-zinc-800 font-bold text-brand-dark rounded-lg flex items-center gap-2">
             <TrendingUp size={18} /> Vue Globale
          </Link>
          <Link href="/admin/users" className="px-4 py-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-brand-dark rounded-lg font-medium transition-colors flex items-center gap-2">
             <Users size={18} /> Clients & Investisseurs
          </Link>
          <div className="px-4 py-3 text-gray-400 font-medium flex items-center gap-2 opacity-50 cursor-not-allowed">
             <ShieldAlert size={18} /> Offres (Bientôt)
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="text-3xl font-black mb-8 text-gray-800 dark:text-white">Aperçu Boursier</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5"><Users size={80} /></div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Total Inscrits</h3>
            <p className="text-3xl font-black text-brand-dark">{totalUsers}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5"><ShieldAlert size={80} /></div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">KYC en Attente</h3>
            <p className="text-3xl font-black text-amber-600">{pendingKyc}</p>
            {pendingKyc > 0 && <Link href="/admin/users" className="text-[10px] text-amber-600 font-bold hover:underline">Voir les demandes →</Link>}
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
             <div className="absolute right-0 top-0 p-4 opacity-5"><UserCheck size={80} /></div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">KYC Validés</h3>
            <p className="text-3xl font-black text-green-600">{activeKyc}</p>
          </div>

          <div className="bg-gradient-to-br from-brand-dark to-brand text-white p-6 rounded-xl shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-10"><Wallet size={80} /></div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/70 mb-1">Fonds Global Géré</h3>
            <p className="text-3xl font-black tracking-tight">{totalFunds.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 dark:border-zinc-800 font-bold text-gray-800 bg-gray-50">
            Navigation Rapide
          </div>
          <div className="p-8 text-center bg-white flex flex-col items-center justify-center gap-6">
             <Users className="text-gray-300" size={48} />
             <p className="text-gray-500 font-medium">Pour effectuer une recharge de compte ou valider des documents KYC, veuillez accéder à la gestion des clients.</p>
             <div className="flex flex-col sm:flex-row gap-3 items-center">
               <Link href="/admin/users" className="bg-brand-accent hover:bg-brand-accentHover text-brand-dark px-6 py-2 rounded font-bold transition-colors shadow-sm uppercase text-xs tracking-wider">
                 Gérer les Clients
               </Link>
               <Link href="/admin/users" className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded font-bold transition-colors shadow-sm uppercase text-xs tracking-wider border border-gray-200">
                 Modifier Portefeuille
               </Link>
               <SyncBalancesButton />
             </div>
             <p className="text-xs text-gray-400 max-w-lg">
               Après une mise à jour des cours boursiers, utilisez le bouton ci-dessus pour recréditer les clients qui détenaient des actions à l&apos;ancien prix.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
