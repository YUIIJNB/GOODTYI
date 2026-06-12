'use client';

import { useState } from 'react';
import { Loader2, Check, Plus, Minus, Wallet, X, CircleDollarSign, Pencil } from 'lucide-react';
import { modifyBalance } from '@/app/admin/actions';

export default function RechargeClientForm({
  userId,
  userName,
  currentBalance
}: {
  userId: string;
  userName: string;
  currentBalance: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState<'add' | 'subtract' | 'set'>('add');

  const handleSubmit = async (formData: FormData) => {
    const amountValue = parseFloat((formData.get('amount') as string) || '0');
    if (isNaN(amountValue) || (actionType !== 'set' && amountValue <= 0) || (actionType === 'set' && amountValue < 0)) {
      setErrorMsg('Veuillez saisir un montant valide.');
      return;
    }

    if (actionType === 'subtract' && amountValue > currentBalance) {
      setErrorMsg('Retrait impossible: montant superieur au solde actuel.');
      return;
    }

    setIsPending(true);
    setSuccess(false);
    setErrorMsg('');

    const result = await modifyBalance(formData);

    if (result?.error) {
      setIsPending(false);
      setErrorMsg(result.error);
      return;
    }

    setIsPending(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActionType('add');
            setErrorMsg('');
            setIsOpen(true);
          }}
          className="bg-brand hover:bg-brand-dark text-white font-bold text-xs py-1.5 px-3 rounded border border-brand shadow-sm transition-colors flex items-center gap-1"
        >
          <Wallet size={14} /> Recharge
        </button>
        <button
          type="button"
          onClick={() => {
            setActionType('subtract');
            setErrorMsg('');
            setIsOpen(true);
          }}
          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-1.5 px-3 rounded border border-red-200 shadow-sm transition-colors flex items-center gap-1"
        >
          <Minus size={14} /> Retrait
        </button>
        <button
          type="button"
          onClick={() => {
            setActionType('set');
            setErrorMsg('');
            setIsOpen(true);
          }}
          className="bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-1.5 px-3 rounded border border-gray-200 shadow-sm transition-colors flex items-center gap-1"
        >
          <Pencil size={14} /> Editer Solde
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setIsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-brand-dark flex items-center gap-2">
                  <CircleDollarSign size={18} className="text-brand-accent" />
                  Recharge portefeuille
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">{userName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Solde actuel: {currentBalance.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isPending && setIsOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Fermer la fenetre"
              >
                <X size={16} />
              </button>
            </div>

            <form action={handleSubmit} className="p-5 space-y-4">
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="actionType" value={actionType} />

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActionType('add');
                    setErrorMsg('');
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                    actionType === 'add'
                      ? 'bg-brand-accent text-brand-dark border-yellow-300'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Plus size={14} className="inline mr-1" />
                  Depot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionType('subtract');
                    setErrorMsg('');
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                    actionType === 'subtract'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Minus size={14} className="inline mr-1" />
                  Retrait
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionType('set');
                    setErrorMsg('');
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                    actionType === 'set'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Pencil size={14} className="inline mr-1" />
                  Solde Exact
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  {actionType === 'set' ? 'Nouveau solde (FCFA)' : 'Montant (FCFA)'}
                </label>
                <input
                  type="number"
                  name="amount"
                  min={actionType === 'set' ? '0' : '1'}
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={actionType === 'set' ? 'Ex: 125000' : 'Ex: 25000'}
                  required
                  disabled={isPending}
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 shadow-inner focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  ...(actionType === 'set' ? [0] : []),
                  5000,
                  10000,
                  25000,
                  50000
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="rounded-md border border-gray-200 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
                  >
                    {preset.toLocaleString('fr-FR')}
                  </button>
                ))}
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !isPending && setIsOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending || success}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1 ${
                    success
                      ? 'bg-green-100 text-green-700'
                      : actionType === 'add'
                      ? 'bg-brand-accent hover:bg-brand-accentHover text-brand-dark'
                      : actionType === 'set'
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-80`}
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : success ? (
                    <Check size={14} />
                  ) : actionType === 'add' ? (
                    <Plus size={14} />
                  ) : actionType === 'set' ? (
                    <Pencil size={14} />
                  ) : (
                    <Minus size={14} />
                  )}
                  {isPending
                    ? 'Traitement...'
                    : success
                    ? 'Valide'
                    : actionType === 'add'
                    ? 'Confirmer depot'
                    : actionType === 'set'
                    ? 'Confirmer nouveau solde'
                    : 'Confirmer retrait'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
