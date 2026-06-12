'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const nationality = formData.get('nationality') as string
  const address = formData.get('address') as string

  if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth || !nationality || !address) {
    redirect('/register?error=Tous+les+champs+sont+requis')
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        date_of_birth: dateOfBirth,
        nationality: nationality,
        address: address,
      }
    }
  })

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  // Back-up update (useful if trigger is not yet updated or for role assignment)
  if (data?.user) {
    await supabase.from('users').update({ 
      role: email === 'admin@invest.com' ? 'admin' : 'client'
    }).eq('id', data.user.id)
  }

  redirect('/dashboard/kyc')
}
