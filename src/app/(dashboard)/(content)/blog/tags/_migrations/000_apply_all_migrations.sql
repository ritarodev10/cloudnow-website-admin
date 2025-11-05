-- Combined migration file to apply all blog tags migrations
-- Run this file in your Supabase SQL Editor to set up the database
-- Order: Table -> RLS Policies -> Seed Data

-- ============================================
-- 1. Create blog_tags table
-- ============================================
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_blog_tags_name ON blog_tags(name);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_usage_count ON blog_tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags_created_at ON blog_tags(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_blog_tags_updated_at ON blog_tags;
CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Set up Row Level Security Policies
-- ============================================
-- Note: Adjust these policies based on your authentication setup
-- For now, we'll allow authenticated users to read all tags
-- and only allow service role to modify tags

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow service role to manage tags" ON blog_tags;

-- Allow authenticated users to read all tags
CREATE POLICY "Allow authenticated users to read tags"
  ON blog_tags FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage all tags
CREATE POLICY "Allow service role to manage tags"
  ON blog_tags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. Seed blog tags data
-- ============================================
INSERT INTO blog_tags (id, name, slug, description, usage_count, created_at, updated_at)
SELECT * FROM (VALUES
  -- Technology Stack Tags
  ('660e8400-e29b-41d4-a716-446655440001'::uuid, 'React', 'react',
   'React.js framework and ecosystem',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440002'::uuid, 'Next.js', 'nextjs',
   'Next.js framework for React applications',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440003'::uuid, 'TypeScript', 'typescript',
   'TypeScript programming language',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Cloud Platform Tags
  ('660e8400-e29b-41d4-a716-446655440004'::uuid, 'AWS', 'aws',
   'Amazon Web Services cloud platform',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440005'::uuid, 'Azure', 'azure',
   'Microsoft Azure cloud platform',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440006'::uuid, 'Google Cloud', 'google-cloud',
   'Google Cloud Platform services',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- DevOps & Infrastructure Tags
  ('660e8400-e29b-41d4-a716-446655440007'::uuid, 'Docker', 'docker',
   'Docker containerization platform',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440008'::uuid, 'Kubernetes', 'kubernetes',
   'Kubernetes container orchestration',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440009'::uuid, 'DevOps', 'devops',
   'DevOps practices and methodologies',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440010'::uuid, 'CI/CD', 'ci-cd',
   'Continuous Integration and Continuous Deployment',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Security Tags
  ('660e8400-e29b-41d4-a716-446655440011'::uuid, 'Security', 'security',
   'Cybersecurity and information security',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440012'::uuid, 'Cloud Security', 'cloud-security',
   'Security practices for cloud infrastructure',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Business & Strategy Tags
  ('660e8400-e29b-41d4-a716-446655440013'::uuid, 'Cloud Migration', 'cloud-migration',
   'Migrating applications and infrastructure to the cloud',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440014'::uuid, 'Digital Transformation', 'digital-transformation',
   'Business transformation through digital technologies',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440015'::uuid, 'IT Consulting', 'it-consulting',
   'IT consulting and advisory services',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Technology Categories
  ('660e8400-e29b-41d4-a716-446655440016'::uuid, 'Web Development', 'web-development',
   'Web application development',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440017'::uuid, 'API Development', 'api-development',
   'RESTful APIs and microservices',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440018'::uuid, 'Database', 'database',
   'Database design and management',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440019'::uuid, 'Microservices', 'microservices',
   'Microservices architecture',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Best Practices & Guides
  ('660e8400-e29b-41d4-a716-446655440020'::uuid, 'Best Practices', 'best-practices',
   'Industry best practices and guidelines',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440021'::uuid, 'Tutorial', 'tutorial',
   'Step-by-step tutorials and guides',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440022'::uuid, 'Case Study', 'case-study',
   'Real-world case studies and examples',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Tags from blog posts seed data
  ('660e8400-e29b-41d4-a716-446655440023'::uuid, 'Cloud', 'cloud',
   'Cloud computing and cloud technologies',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440024'::uuid, 'Innovation', 'innovation',
   'Innovation and technological advancement',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440025'::uuid, 'Technology', 'technology',
   'Technology trends and developments',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440026'::uuid, 'Remote Work', 'remote-work',
   'Remote work practices and technologies',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440027'::uuid, 'Strategy', 'strategy',
   'Business and technology strategy',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440028'::uuid, 'Business', 'business',
   'Business insights and practices',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440029'::uuid, 'Enterprise', 'enterprise',
   'Enterprise solutions and practices',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440030'::uuid, 'Optimization', 'optimization',
   'Performance and cost optimization',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440031'::uuid, 'BaaS', 'baas',
   'Backup as a Service solutions',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440032'::uuid, 'Data Protection', 'data-protection',
   'Data protection and security strategies',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440033'::uuid, 'Business Continuity', 'business-continuity',
   'Business continuity and disaster recovery',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440034'::uuid, 'Zero Trust', 'zero-trust',
   'Zero Trust security model and implementation',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440035'::uuid, 'Implementation', 'implementation',
   'Implementation guides and best practices',
   0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, usage_count, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_tags WHERE blog_tags.id = v.id::uuid);

-- Note: To track tag usage in blog posts, you'll need to:
-- 1. Create a blog_posts table with a tags JSONB or TEXT[] column
-- 2. Create a trigger or function to update usage_count when posts are created/updated/deleted
-- 3. Or maintain usage_count manually through application logic

