-- 1. Create a table for Brand Profiles
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT,
  founder_name TEXT,
  origin_story TEXT,
  dirty_secret TEXT,
  contrarian_belief TEXT,
  enemy TEXT,
  biggest_win TEXT,
  secret_sauce TEXT,
  data_dump TEXT,
  core_tone TEXT,
  words_to_kill TEXT,
  primary_audience TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy so users can only see/edit their own profiles
CREATE POLICY "Users can only access their own brand profiles" ON brand_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 4. Create a table for Generated Content
CREATE TABLE generated_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  strategy_used TEXT,
  is_liked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own posts" ON generated_posts
  FOR ALL USING (auth.uid() = user_id);
