-- TARGETED FIX FOR "ON CONFLICT" ERROR
-- Only run these 4 lines:

-- 1. Clean up any accidental duplicates (required for the fix below)
DELETE FROM brand_profiles a USING brand_profiles b 
WHERE a.id < b.id AND a.user_id = b.user_id;

-- 2. Add the unique constraint ONLY if it doesn't exist already
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'brand_profiles_user_id_key') THEN
    ALTER TABLE brand_profiles ADD CONSTRAINT brand_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;
