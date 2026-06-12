'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function KYCPage() {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [residenceFile, setResidenceFile] = useState<File | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const residenceInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('kyc_status, id_number').eq('id', user.id).single();
        if (data) {
          setKycStatus(data.kyc_status);
          if (data.id_number) setIdNumber(data.id_number);
        }
      }
    }
    checkStatus();
  }, []);

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleResidenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResidenceFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile || !residenceFile || !idNumber) return;
    
    setUploading(true);
    
    // Simuler le délai d'upload
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mettre à jour Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('users').update({ 
        kyc_status: 'en_attente',
        id_number: idNumber
      }).eq('id', user.id);
    }
    
    setUploading(false);
    setSuccess(true);
    
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-8 text-brand-dark dark:text-white">Vérification de l'Identité (KYC)</h1>
        
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-3xl shadow-2xl">
          <p className="text-slate-500 dark:text-zinc-400 mb-8 font-medium text-lg leading-relaxed">
            Pour sécuriser vos futurs investissements, nous devons valider votre identité. Veuillez fournir des informations exactes et des documents lisibles.
          </p>

          {kycStatus === 'validé' ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-green-50/50 dark:bg-green-900/10 rounded-2xl border-2 border-dashed border-green-200 dark:border-green-800/30">
               <div className="h-24 w-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8">
                 <CheckCircle className="text-green-600 dark:text-green-400" size={48} />
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-zinc-100 mb-3 uppercase tracking-tight">Identité Validée</h3>
               <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto">Votre compte est pleinement vérifié. Vous pouvez maintenant accéder à toutes les opportunités d'investissement.</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border-2 border-dashed border-brand/20">
               <div className="h-24 w-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-8">
                 <CheckCircle className="text-brand dark:text-blue-400" size={48} />
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-zinc-100 mb-3 uppercase tracking-tight">Dossier Transmis !</h3>
               <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto font-medium">Nos experts examinent vos documents. Le délai habituel est de 24h ouvrées.</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-3 uppercase tracking-[0.15em]">Type de Document</label>
                  <select className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all text-sm appearance-none">
                    <option value="cni">Carte d'Identité Nationale (CNI)</option>
                    <option value="passport">Passeport International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-3 uppercase tracking-[0.15em]">Numéro de la Pièce</label>
                  <input 
                    type="text" 
                    required 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Ex: C0123456789"
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold focus:outline-none focus:border-brand focus:bg-white dark:focus:bg-zinc-700 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-3 uppercase tracking-[0.15em]">Recto-Verso de la Pièce d'Identité</label>
                  <div 
                    onClick={() => idInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${idFile ? 'border-brand bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                  >
                    {idFile ? (
                      <>
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center"><FileText size={24} className="text-brand" /></div>
                        <div className="font-bold text-sm text-slate-800 dark:text-zinc-100">{idFile.name}</div>
                        <div className="text-[10px] uppercase font-black text-brand tracking-widest">Fichier sélectionné</div>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={40} className="text-slate-400 dark:text-zinc-500" />
                        <p className="text-sm font-black text-slate-600 dark:text-zinc-400">Cliquez pour importer la pièce</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400">PNG, JPG ou PDF (Max 5MB)</p>
                      </>
                    )}
                    <input ref={idInputRef} onChange={handleIdFileChange} type="file" className="hidden" accept="image/*,.pdf" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 mb-3 uppercase tracking-[0.15em]">Justificatif de Domicile</label>
                  <div 
                    onClick={() => residenceInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${residenceFile ? 'border-brand bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                  >
                    {residenceFile ? (
                      <>
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center"><FileText size={24} className="text-brand" /></div>
                        <div className="font-bold text-sm text-slate-800 dark:text-zinc-100">{residenceFile.name}</div>
                        <div className="text-[10px] uppercase font-black text-brand tracking-widest">Justificatif sélectionné</div>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={40} className="text-slate-400 dark:text-zinc-500" />
                        <p className="text-sm font-black text-slate-600 dark:text-zinc-400">Cliquez pour le justificat de domicile</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Facture (CIE, SODECI, etc.)</p>
                      </>
                    )}
                    <input ref={residenceInputRef} onChange={handleResidenceFileChange} type="file" className="hidden" accept="image/*,.pdf" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={!idFile || !residenceFile || !idNumber || uploading} 
                  className={`w-full py-5 text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-2xl ${(!idFile || !residenceFile || !idNumber || uploading) ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed opacity-50' : 'bg-brand hover:bg-brand-dark transform hover:-translate-y-1 active:translate-y-0 shadow-brand/20'}`}
                >
                  {uploading ? 'Cryptage & Envoi en cours...' : 'Finaliser mon dossier de conformité'}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Statut Réseau</h3>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider bg-orange-50 text-orange-600 px-3 py-1 rounded">
              <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></span>
              Connexion Sécurisée
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
