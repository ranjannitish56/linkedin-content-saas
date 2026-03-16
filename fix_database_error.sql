-- 1. CLEANUP: Delete any duplicate profiles so we can add the unique constraint safely
-- This keeps only the most recently updated profile for each user
DELETE FROM brand_profiles a
USING brand_profiles b
WHERE a.id < b.id 
AND a.user_id = b.user_id;

-- 2. ADD CONSTRAINT: Now we can add the UNIQUE constraint without errors
ALTER TABLE brand_profiles 
ADD CONSTRAINT brand_profiles_user_id_key UNIQUE (user_id);

-- 3. ENABLE RLS: Ensure you can insert and update
DROP POLICY IF EXISTS "Users can only access their own brand profiles" ON brand_profiles;

CREATE POLICY "Users can only access their own brand profiles" ON brand_profiles
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
