-- 1. Add Unique Constraint to user_id (Required for Upsert/onConflict)
ALTER TABLE brand_profiles ADD CONSTRAINT brand_profiles_user_id_key UNIQUE (user_id);

-- 2. Update RLS Policy to be more robust
DROP POLICY IF EXISTS "Users can only access their own brand profiles" ON brand_profiles;

CREATE POLICY "Users can only access their own brand profiles" ON brand_profiles
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Ensure updated_at triggers handled correctly if needed (optional)
-- (Already handled by DEFAULT in existing schema)
