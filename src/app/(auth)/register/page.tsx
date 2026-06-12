import { register } from './actions';
import { User, Mail, Lock, Phone, Calendar, Globe, MapPin } from 'lucide-react';

export default function Register({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-zinc-800">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 rounded-full mb-6">
             <User className="text-brand" size={40} />
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Inscription Investisseur</h2>
           <p className="text-slate-500 dark:text-zinc-400 mt-3 text-base font-medium">Rejoignez l'élite des investisseurs du marché régional</p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            {error}
          </div>
        )}

        <form action={register} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Prénom</label>
               <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="firstName" type="text" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="Ex: Jean" />
               </div>
             </div>
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Nom</label>
               <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="lastName" type="text" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="Ex: Kouassi" />
               </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Téléphone</label>
               <div className="relative group">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="phone" type="tel" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="+225 07..." />
               </div>
             </div>
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Date de naissance</label>
               <div className="relative group">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="dateOfBirth" type="date" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" />
               </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Nationalité</label>
               <div className="relative group">
                 <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="nationality" type="text" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="Ex: Ivoirienne" />
               </div>
             </div>
             <div className="w-full sm:w-1/2">
               <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Email Professionnel</label>
               <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                 <input name="email" type="email" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="nom@exemple.com" />
               </div>
             </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Adresse Complète</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
              <input name="address" type="text" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="Cocody, Abidjan, Côte d'Ivoire" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-widest">Mot de passe sécurisé</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
              <input name="password" type="password" required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all font-medium" placeholder="••••••••••••" />
            </div>
          </div>
          
          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-brand hover:bg-brand-dark text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:shadow-brand/20 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm">
              Créer mon compte investisseur
            </button>
          </div>
          
          <div className="text-center mt-6">
            <a href="/login" className="text-sm font-bold text-slate-400 dark:text-zinc-500 hover:text-brand transition-colors">Déjà membre ? <span className="text-brand hover:underline">Accéder à mon compte</span></a>
          </div>
        </form>
      </div>
    </div>
  );
}
