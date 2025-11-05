-- Combined migration file to apply all blog categories migrations
-- Run this file in your Supabase SQL Editor to set up the database
-- Order: Table -> RLS Policies -> Seed Data

-- ============================================
-- 1. Create blog_categories table
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_is_active ON blog_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_categories_created_at ON blog_categories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Set up Row Level Security Policies
-- ============================================
-- Note: Adjust these policies based on your authentication setup
-- For now, we'll allow authenticated users to read all categories
-- and only allow service role to modify categories

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow service role to manage categories" ON blog_categories;

-- Allow authenticated users to read all categories
CREATE POLICY "Allow authenticated users to read categories"
  ON blog_categories FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage all categories
CREATE POLICY "Allow service role to manage categories"
  ON blog_categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. Seed blog categories data
-- ============================================
INSERT INTO blog_categories (id, name, slug, description, is_active, created_at, updated_at)
SELECT * FROM (VALUES
  -- Main Categories
  ('770e8400-e29b-41d4-a716-446655440001'::uuid, 'Technology', 'technology',
   'Technology trends, innovations, and technical deep-dives',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440002'::uuid, 'Business', 'business',
   'Business strategy, digital transformation, and industry insights',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440003'::uuid, 'Cloud', 'cloud',
   'Cloud computing, cloud platforms, and cloud infrastructure',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440004'::uuid, 'Security', 'security',
   'Cybersecurity, cloud security, and information security best practices',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440005'::uuid, 'DevOps', 'devops',
   'DevOps practices, CI/CD, infrastructure as code, and automation',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Additional Categories
  ('770e8400-e29b-41d4-a716-446655440006'::uuid, 'Cloud Migration', 'cloud-migration',
   'Strategies and best practices for migrating to the cloud',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440007'::uuid, 'Web Development', 'web-development',
   'Modern web development, frameworks, and frontend technologies',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440008'::uuid, 'API Development', 'api-development',
   'RESTful APIs, GraphQL, microservices, and API design',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440009'::uuid, 'Database', 'database',
   'Database design, optimization, and management',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440010'::uuid, 'Best Practices', 'best-practices',
   'Industry best practices, guidelines, and standards',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440011'::uuid, 'Tutorials', 'tutorials',
   'Step-by-step tutorials and how-to guides',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440012'::uuid, 'Case Studies', 'case-studies',
   'Real-world case studies and success stories',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Categories from blog posts seed data
  ('770e8400-e29b-41d4-a716-446655440013'::uuid, 'Cloud Solutions', 'cloud-solutions',
   'Cloud computing solutions, services, and strategies',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440014'::uuid, 'Cybersecurity', 'cybersecurity',
   'Cybersecurity practices, threats, and protection strategies',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440015'::uuid, 'Microsoft Azure', 'microsoft-azure',
   'Microsoft Azure cloud platform services and solutions',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440016'::uuid, 'Backup Solutions', 'backup-solutions',
   'Data backup, disaster recovery, and business continuity solutions',
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, is_active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.id = v.id::uuid);

-- Note: Post count is calculated dynamically by querying the posts table
-- where posts.category matches blog_categories.name

