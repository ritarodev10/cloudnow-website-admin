-- Combined migration file to apply all testimonials migrations
-- Run this file in your Supabase SQL Editor to set up the database
-- Order: Tables -> RLS Policies -> Seed Data

-- ============================================
-- 1. Create testimonials table
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  testimony TEXT NOT NULL,
  image TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categories TEXT[] NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_testimonials_is_visible ON testimonials(is_visible);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Create GIN index for array searches on categories
CREATE INDEX IF NOT EXISTS idx_testimonials_categories ON testimonials USING GIN(categories);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Create testimonial_groups table
-- ============================================
CREATE TABLE IF NOT EXISTS testimonial_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  testimonial_ids UUID[] NOT NULL DEFAULT '{}',
  order_array TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_paths TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_is_active ON testimonial_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_created_at ON testimonial_groups(created_at DESC);

-- Create GIN indexes for array searches
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_testimonial_ids ON testimonial_groups USING GIN(testimonial_ids);
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_usage_paths ON testimonial_groups USING GIN(usage_paths);

-- Enable Row Level Security
ALTER TABLE testimonial_groups ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_testimonial_groups_updated_at ON testimonial_groups;
CREATE TRIGGER update_testimonial_groups_updated_at
  BEFORE UPDATE ON testimonial_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Setup RLS Policies
-- ============================================
-- RLS Policies for testimonials table
-- Allow authenticated users to read all testimonials
DROP POLICY IF EXISTS "Authenticated users can read testimonials" ON testimonials;
CREATE POLICY "Authenticated users can read testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert testimonials
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update testimonials
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete testimonials
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for testimonial_groups table
-- Allow authenticated users to read all testimonial groups
DROP POLICY IF EXISTS "Authenticated users can read testimonial_groups" ON testimonial_groups;
CREATE POLICY "Authenticated users can read testimonial_groups"
  ON testimonial_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert testimonial groups
DROP POLICY IF EXISTS "Authenticated users can insert testimonial_groups" ON testimonial_groups;
CREATE POLICY "Authenticated users can insert testimonial_groups"
  ON testimonial_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update testimonial groups
DROP POLICY IF EXISTS "Authenticated users can update testimonial_groups" ON testimonial_groups;
CREATE POLICY "Authenticated users can update testimonial_groups"
  ON testimonial_groups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete testimonial groups
DROP POLICY IF EXISTS "Authenticated users can delete testimonial_groups" ON testimonial_groups;
CREATE POLICY "Authenticated users can delete testimonial_groups"
  ON testimonial_groups
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 4. Seed testimonials data (optional)
-- ============================================
-- Only insert if tables are empty to avoid duplicates
INSERT INTO testimonials (id, name, title, company, testimony, image, rating, categories, is_visible, created_at, updated_at) 
SELECT * FROM (VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Sarah Johnson', 'CTO', 'TechCorp Solutions', 
   'CloudNow''s cloud migration service was exceptional. They helped us seamlessly transition our entire infrastructure to AWS, reducing costs by 40% while improving performance. Their team''s expertise and support throughout the process was outstanding.',
   'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
   5, ARRAY['Customer Success', 'Implementation'], true, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Michael Chen', 'IT Director', 'Global Enterprises',
   'The technical support team at CloudNow is incredibly responsive and knowledgeable. They resolved our critical issues within hours and provided excellent guidance on best practices. Highly recommended!',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
   5, ARRAY['Technical Support', 'Service Quality'], true, '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Emily Rodriguez', 'VP of Operations', 'StartupXYZ',
   'CloudNow''s Microsoft Solutions team helped us implement Office 365 and Azure AD across our organization. The migration was smooth and their training sessions were very helpful for our team.',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
   4, ARRAY['Implementation'], true, '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'David Thompson', 'CEO', 'InnovateTech',
   'We''ve been using CloudNow''s hosting services for over two years. The uptime is excellent and their customer service is top-notch. They''ve become an essential partner for our business.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
   5, ARRAY['Partnership'], true, '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Lisa Wang', 'Security Manager', 'SecureCorp',
   'CloudNow''s cybersecurity services helped us strengthen our security posture significantly. Their comprehensive security assessment identified vulnerabilities we weren''t aware of, and their remediation plan was thorough and effective.',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
   5, ARRAY['Service Quality'], true, '2024-02-15'::timestamptz, '2024-02-15'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Robert Kim', 'IT Manager', 'ManufacturingCo',
   'The backup and recovery solution from CloudNow saved us from a major data loss incident. Their automated backup system worked flawlessly and their recovery process was quick and efficient.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
   5, ARRAY['Customer Success'], true, '2024-02-20'::timestamptz, '2024-02-20'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, 'Jennifer Adams', 'Operations Director', 'RetailMax',
   'CloudNow''s IT consulting services provided us with valuable insights into our technology infrastructure. Their recommendations helped us optimize our systems and improve efficiency across all departments.',
   'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
   4, ARRAY['General Feedback'], false, '2024-02-25'::timestamptz, '2024-02-25'::timestamptz)
) AS v(id, name, title, company, testimony, image, rating, categories, is_visible, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE testimonials.id = v.id::uuid);

-- ============================================
-- 5. Seed testimonial groups data (optional)
-- ============================================
-- Seed data uses category names that match testimonial categories
INSERT INTO testimonial_groups (id, name, description, testimonial_ids, order_array, is_active, usage_paths, created_at, updated_at)
SELECT * FROM (VALUES
  ('770e8400-e29b-41d4-a716-446655440001'::uuid, 'Customer Success',
   'Customer success and satisfaction testimonials',
   ARRAY['550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006'],
   true,
   ARRAY['/services/cloud-migration', '/services/cloud-consulting'],
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440002'::uuid, 'Product Review',
   'Product and service review testimonials',
   ARRAY[]::UUID[],
   ARRAY[]::TEXT[],
   true,
   ARRAY[]::TEXT[],
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440003'::uuid, 'Service Quality',
   'Service quality and excellence testimonials',
   ARRAY['550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'],
   true,
   ARRAY['/services/cloud-support', '/services/cloud-monitoring'],
   '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440004'::uuid, 'Technical Support',
   'Technical support and assistance testimonials',
   ARRAY['550e8400-e29b-41d4-a716-446655440002'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440002'],
   true,
   ARRAY['/services/devops-automation', '/services/cloud-security'],
   '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440005'::uuid, 'Implementation',
   'Implementation and deployment testimonials',
   ARRAY['550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'],
   true,
   ARRAY['/services/cloud-migration'],
   '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440006'::uuid, 'Partnership',
   'Partnership and collaboration testimonials',
   ARRAY['550e8400-e29b-41d4-a716-446655440004'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440004'],
   true,
   ARRAY[]::TEXT[],
   '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),
  ('770e8400-e29b-41d4-a716-446655440007'::uuid, 'General Feedback',
   'General testimonials and feedback',
   ARRAY['550e8400-e29b-41d4-a716-446655440007'::uuid],
   ARRAY['550e8400-e29b-41d4-a716-446655440007'],
   true,
   ARRAY[]::TEXT[],
   '2024-02-25'::timestamptz, '2024-02-25'::timestamptz)
) AS v(id, name, description, testimonial_ids, order_array, is_active, usage_paths, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM testimonial_groups WHERE testimonial_groups.id = v.id::uuid);

-- ============================================
-- 6. Add category validation trigger
-- ============================================
-- Create function to validate that testimonial categories reference valid groups
CREATE OR REPLACE FUNCTION validate_testimonial_categories()
RETURNS TRIGGER AS $$
DECLARE
  category_name TEXT;
  group_exists BOOLEAN;
BEGIN
  -- Check each category in the array
  FOREACH category_name IN ARRAY NEW.categories
  LOOP
    -- Check if a group with this name exists and is active
    SELECT EXISTS(
      SELECT 1 FROM testimonial_groups 
      WHERE name = category_name AND is_active = true
    )
    INTO group_exists;
    
    IF NOT group_exists THEN
      RAISE EXCEPTION 'Category "%" does not exist in testimonial_groups table', category_name;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS validate_testimonials_categories ON testimonials;

-- Create trigger to validate categories on insert/update
CREATE TRIGGER validate_testimonials_categories
  BEFORE INSERT OR UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION validate_testimonial_categories();

-- ============================================
-- Migration Complete!
-- ============================================
-- The tables should now be available in PostgREST
-- If you still see PGRST205 errors, try:
-- 1. Wait a few seconds for PostgREST to refresh its schema cache
-- 2. Check that RLS policies are correctly set
-- 3. Verify you're authenticated when making requests

