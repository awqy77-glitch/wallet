-- Create the Balances Table mapping User IDs to real Fiscal and Crypto balances
CREATE TABLE public.balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text UNIQUE NOT NULL, -- Will store Supabase Auth ID or Web3 Wallet Address
  fiat numeric DEFAULT 0 NOT NULL,
  crypto numeric DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Protect table modifications logic
ALTER TABLE public.balances ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (so our frontend can fetch it easily on the client)
CREATE POLICY "Enable Read Access for Anyone" ON public.balances
  FOR SELECT USING (true);

-- Allow Insert and Update access for our public Key (so the simulated deposit pushes updates)
CREATE POLICY "Enable Insert Access for Anyone" ON public.balances
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable Update Access for Anyone" ON public.balances
  FOR UPDATE USING (true);
