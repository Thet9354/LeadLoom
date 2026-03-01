-- Phase 3: Add Trial, Pro status, and Sync Logs

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Ensure users id references auth.users(id) - BUT WAIT, the existing user was created manually, so we can't just add a strict FK if it breaks. 
-- Let's just create a trigger to automatically create a user in public.users when a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, trial_start_date, is_pro)
  VALUES (new.id, new.email, timezone('utc'::text, now()), false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lead_email TEXT NOT NULL,
    sync_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for sync logs
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sync logs" ON public.sync_logs;
CREATE POLICY "Users can view own sync logs"
    ON public.sync_logs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sync logs" ON public.sync_logs;
CREATE POLICY "Users can insert own sync logs"
    ON public.sync_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
