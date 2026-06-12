'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { syncPortfolioBalances } from '@/lib/syncPortfolioBalances'

export async function validateKyc(userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('users').update({ kyc_status: 'validé' }).eq('id', userId)
  if (error) console.error("Error validating KYC:", error)
  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function modifyBalance(formData: FormData) {
  const userId = formData.get('userId') as string
  const amountStr = formData.get('amount') as string
  const actionType = formData.get('actionType') as string // 'add' | 'subtract' | 'set'
  const amountToModify = parseFloat(amountStr)

  if (!userId || isNaN(amountToModify)) return { error: 'Données invalides.' }
  if (actionType !== 'set' && amountToModify <= 0) return { error: 'Le montant doit être supérieur à 0.' }
  if (actionType === 'set' && amountToModify < 0) return { error: 'Le solde ne peut pas être négatif.' }

  const supabase = createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return { error: 'Non authentifié.' }

  const { data: adminRows, error: adminError } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)

  if (adminError) return { error: `Vérification admin impossible: ${adminError.message}` }
  if (!adminRows || adminRows.length === 0) {
    return { error: "Profil utilisateur introuvable dans la table users. Vérifiez l'inscription/synchronisation." }
  }
  if (adminRows.length > 1) {
    return { error: "Doublon détecté pour ce compte dans la table users. Corrigez les données avant de continuer." }
  }
  if (adminRows[0].role !== 'admin') return { error: 'Accès réservé aux administrateurs.' }

  const { data: targetUser, error: targetError } = await supabase.from('users').select('balance').eq('id', userId).single()
  if (targetError || !targetUser) return { error: `Client introuvable: ${targetError?.message ?? 'Aucun enregistrement'}` }
  const currentBalance = parseFloat(targetUser?.balance || 0)
  
  let newBalance = currentBalance
  if (actionType === 'add') {
    newBalance = currentBalance + amountToModify
  } else if (actionType === 'subtract') {
    newBalance = currentBalance - amountToModify
  } else if (actionType === 'set') {
    newBalance = amountToModify
  } else {
    return { error: 'Type d’action invalide.' }
  }

  if (newBalance < 0) return { error: 'Le solde final ne peut pas être négatif.' }
  
  // Update balance
  const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', userId)
  if (error) return { error: `Erreur modification solde: ${error.message}` }

  // Aucun enregistrement dans transactions pour les ajustements admin.
  // Le client verra uniquement son solde mis à jour.

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/investments')
  revalidatePath('/dashboard/active-investments')

  return { success: true }
}

export async function createInvestmentOffer(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const roi = parseFloat(formData.get('roi') as string)
  const price = parseFloat(formData.get('price') as string)
  const minInvest = parseFloat(formData.get('min_invest') as string)

  if (!title || !description || isNaN(roi) || isNaN(price)) return { error: "Données invalides" }

  const supabase = createClient()
  const { error } = await supabase.from('investment_offers').insert({
    title,
    description,
    type,
    roi_percentage: roi,
    price_per_share: price,
    minimum_investment: minInvest || price,
    is_active: true
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/offers')
  revalidatePath('/dashboard/investments')
  return { success: true }
}

export async function deleteInvestmentOffer(offerId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('investment_offers').delete().eq('id', offerId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/offers')
  revalidatePath('/dashboard/investments')
  return { success: true }
}

/** Ajuste les soldes de tous les clients selon les cours actuels des actions détenues */
export async function syncAllBalancesAfterPriceUpdate() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: admin } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (admin?.role !== 'admin') return { error: 'Accès réservé aux administrateurs' }

  const result = await syncPortfolioBalances(supabase)

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  revalidatePath('/dashboard')

  if (result.errors.length > 0) {
    return {
      success: result.adjustedUsers > 0,
      adjustedUsers: result.adjustedUsers,
      totalCredited: result.totalCredited,
      error: result.errors.join(' | '),
    }
  }

  return {
    success: true,
    adjustedUsers: result.adjustedUsers,
    totalCredited: result.totalCredited,
  }
}
