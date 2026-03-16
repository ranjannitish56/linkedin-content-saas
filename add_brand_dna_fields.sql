-- Add new Brand DNA fields to brand_profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE brand_profiles
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS business_size TEXT,
  ADD COLUMN IF NOT EXISTS markets TEXT,
  ADD COLUMN IF NOT EXISTS target_audience TEXT,
  ADD COLUMN IF NOT EXISTS decision_makers TEXT,
  ADD COLUMN IF NOT EXISTS products_services TEXT,
  ADD COLUMN IF NOT EXISTS marketing_channels TEXT,
  ADD COLUMN IF NOT EXISTS campaign_example TEXT,
  ADD COLUMN IF NOT EXISTS campaign_outcome TEXT,
  ADD COLUMN IF NOT EXISTS industry_mistakes TEXT,
  ADD COLUMN IF NOT EXISTS what_works TEXT,
  ADD COLUMN IF NOT EXISTS unique_perspective TEXT,
  ADD COLUMN IF NOT EXISTS misunderstood TEXT,
  ADD COLUMN IF NOT EXISTS ai_guardrails TEXT,
  ADD COLUMN IF NOT EXISTS brand_philosophy TEXT,
  ADD COLUMN IF NOT EXISTS content_tone TEXT,
  ADD COLUMN IF NOT EXISTS content_inspiration TEXT,
  ADD COLUMN IF NOT EXISTS competitive_advantage TEXT;
