'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Email+et+mot+de+passe+requis')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Determine user role and route them
  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // Check admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    if (user.email === 'admin@invest.com') {
      // Auto-heal right for the demo: ensure this account gets the admin role physically in the database
      await supabase.from('users').update({ role: 'admin' }).eq('id', user.id)
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin' || user.email === 'admin@invest.com') {
      redirect('/admin')
    }
  }
  
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
