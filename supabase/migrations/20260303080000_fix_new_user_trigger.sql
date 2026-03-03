-- Fix handle_new_user trigger to use profiles instead of users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Only create profile after email is confirmed
  IF new.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, trial_start_date, is_pro)
    VALUES (new.id, new.email, timezone('utc'::text, now()), false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fire on both INSERT and UPDATE (update catches email confirmation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
