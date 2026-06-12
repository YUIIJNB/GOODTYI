-- =====================================================================================
-- SCRIPT COMPLET DE BASE DE DONNÉES SUPABASE POUR LA PLATEFORME D'INVESTISSEMENT (BRVM)
-- =====================================================================================

-- 1. USERS TABLE (Profils utilisateurs liés à l'authentification Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  nationality TEXT,
  id_number TEXT,
  id_document_url TEXT,
  residence_proof_url TEXT,
  role TEXT DEFAULT 'client', -- 'client' ou 'admin'
  kyc_status TEXT DEFAULT 'en_attente', -- 'en_attente', 'validé', 'rejeté'
  balance NUMERIC DEFAULT 0.00
);

-- ==========================================
-- SÉCURITÉ RLS (Row Level Security)
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Fonction sécurisée pour vérifier si un utilisateur est admin (évite la boucle infinie de RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politiques de sécurité pour 'users'
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.users FOR UPDATE USING (public.is_admin());

-------------------------------------------------------------------------------------

-- 2. OFFERS TABLE (Toutes les opportunités d'investissement créées par l'administrateur)
CREATE TABLE IF NOT EXISTS public.investment_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- ex: 'Obligation', 'Action', 'OPV'
  roi_percentage NUMERIC DEFAULT 0, -- Taux d'intérêt ou prévision (ex: 6.00)
  price_per_share NUMERIC, -- Le prix si achat par action
  minimum_investment NUMERIC DEFAULT 0, -- Montant minimum exigé
  is_active BOOLEAN DEFAULT true,
  end_date TIMESTAMP WITH TIME ZONE -- Date limite d'investissement
);

ALTER TABLE public.investment_offers DISABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------------

-- 3. USER INVESTMENTS (Investissements actifs des utilisateurs)
CREATE TABLE IF NOT EXISTS public.user_investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES public.investment_offers(id) ON DELETE SET NULL,
  amount_invested NUMERIC NOT NULL,
  shares_bought NUMERIC, 
  status TEXT DEFAULT 'actif', -- 'actif', 'clôturé', 'en_attente'
  current_value NUMERIC -- La valeur courante, calculée au fil du temps
);

ALTER TABLE public.user_investments DISABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------------

-- 4. TRANSACTIONS HISTORIQUE (Historique des dépôts, retraits, achats sur la plateforme)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'depot', 'retrait', 'achat_investissement', 'distribution_dividende'
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'complété', -- 'en_attente', 'complété', 'échoué'
  description TEXT
);

ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------------

-- 5. TRIGGERS POUR L'INSCRIPTION AUTOMATIQUE
-- Crée automatiquement une ligne dans public.users lorsqu'un compte est créé via le processus Auth natif (register)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    first_name, 
    last_name, 
    phone, 
    date_of_birth, 
    address, 
    nationality
  )
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'date_of_birth')::DATE,
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'nationality'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer que le trigger existe : on le supprime s'il était déjà là, puis on le recrée
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-------------------------------------------------------------------------------------

-- 6. DONNER LES DROITS ADMIN MAINTENANT
-- Exécutez cette commande après avoir créé le compte avec admin@invest.com
UPDATE public.users SET role = 'admin' WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@invest.com'
);

-------------------------------------------------------------------------------------

-- 7. CONTACT REQUESTS (Formulaires de contact de la page d'accueil)
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau', -- 'nouveau', 'lu', 'répondu'
  notes TEXT
);

ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
