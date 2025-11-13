-- ============================================
-- COMPREHENSIVE BLOG MIGRATION
-- Tables: blog_categories, blog_tags, posts, post_tags
-- ============================================
-- Run this file in your Supabase SQL Editor to set up all blog-related tables
-- Order: Tables -> Foreign Keys -> Indexes -> RLS Policies -> Seed Data
--
-- This migration creates:
-- 1. blog_categories table
-- 2. blog_tags table
-- 3. posts table (with FK to blog_categories)
-- 4. post_tags junction table (many-to-many relationship)
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create posts table with foreign key to blog_categories
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  featured_image VARCHAR(500),
  featured BOOLEAN NOT NULL DEFAULT false,
  pinned BOOLEAN NOT NULL DEFAULT false,
  allow_comments BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create post_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

-- blog_categories indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_is_active ON blog_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_categories_created_at ON blog_categories(created_at DESC);

-- blog_tags indexes
CREATE INDEX IF NOT EXISTS idx_blog_tags_name ON blog_tags(name);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_usage_count ON blog_tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags_created_at ON blog_tags(created_at DESC);

-- posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(pinned);

-- post_tags indexes
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- ============================================
-- 3. CREATE TRIGGER FUNCTIONS
-- ============================================

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically for blog_categories
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at automatically for blog_tags
DROP TRIGGER IF EXISTS update_blog_tags_updated_at ON blog_tags;
CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at automatically for posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update tag usage_count when post_tags changes
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blog_tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blog_tags
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tag_usage_on_post_tags_change ON post_tags;
CREATE TRIGGER update_tag_usage_on_post_tags_change
  AFTER INSERT OR DELETE ON post_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. SET UP ROW LEVEL SECURITY POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow service role to manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow authenticated users to read tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow service role to manage tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to read posts" ON posts;
DROP POLICY IF EXISTS "Allow service role to manage posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to read post_tags" ON post_tags;
DROP POLICY IF EXISTS "Allow service role to manage post_tags" ON post_tags;

-- blog_categories policies
CREATE POLICY "Allow authenticated users to read categories"
  ON blog_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage categories"
  ON blog_categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- blog_tags policies
CREATE POLICY "Allow authenticated users to read tags"
  ON blog_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage tags"
  ON blog_tags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- posts policies
CREATE POLICY "Allow authenticated users to read posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage posts"
  ON posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- post_tags policies
CREATE POLICY "Allow authenticated users to read post_tags"
  ON post_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage post_tags"
  ON post_tags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. SEED DATA
-- ============================================

-- Seed blog_categories
INSERT INTO blog_categories (id, name, slug, description, is_active, created_at, updated_at)
SELECT * FROM (VALUES
  ('770e8400-e29b-41d4-a716-446655440001'::uuid, 'Technology', 'technology',
   'Technology trends, innovations, and technical deep-dives', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440002'::uuid, 'Business', 'business',
   'Business strategy, digital transformation, and industry insights', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440003'::uuid, 'Cloud', 'cloud',
   'Cloud computing, cloud platforms, and cloud infrastructure', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440004'::uuid, 'Security', 'security',
   'Cybersecurity, cloud security, and information security best practices', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440005'::uuid, 'DevOps', 'devops',
   'DevOps practices, CI/CD, infrastructure as code, and automation', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440006'::uuid, 'Cloud Migration', 'cloud-migration',
   'Strategies and best practices for migrating to the cloud', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440007'::uuid, 'Web Development', 'web-development',
   'Modern web development, frameworks, and frontend technologies', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440008'::uuid, 'API Development', 'api-development',
   'RESTful APIs, GraphQL, microservices, and API design', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440009'::uuid, 'Database', 'database',
   'Database design, optimization, and management', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440010'::uuid, 'Best Practices', 'best-practices',
   'Industry best practices, guidelines, and standards', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440011'::uuid, 'Tutorials', 'tutorials',
   'Step-by-step tutorials and how-to guides', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440012'::uuid, 'Case Studies', 'case-studies',
   'Real-world case studies and success stories', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440013'::uuid, 'Cloud Solutions', 'cloud-solutions',
   'Cloud computing solutions, services, and strategies', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440014'::uuid, 'Cybersecurity', 'cybersecurity',
   'Cybersecurity practices, threats, and protection strategies', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440015'::uuid, 'Microsoft Azure', 'microsoft-azure',
   'Microsoft Azure cloud platform services and solutions', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440016'::uuid, 'Backup Solutions', 'backup-solutions',
   'Data backup, disaster recovery, and business continuity solutions', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('770e8400-e29b-41d4-a716-446655440017'::uuid, 'IT Consulting', 'it-consulting',
   'IT consulting and advisory services', true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, is_active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.id = v.id::uuid);

-- Seed blog_tags
INSERT INTO blog_tags (id, name, slug, description, usage_count, created_at, updated_at)
SELECT * FROM (VALUES
  ('660e8400-e29b-41d4-a716-446655440001'::uuid, 'React', 'react',
   'React.js framework and ecosystem', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440002'::uuid, 'Next.js', 'nextjs',
   'Next.js framework for React applications', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440003'::uuid, 'TypeScript', 'typescript',
   'TypeScript programming language', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440004'::uuid, 'AWS', 'aws',
   'Amazon Web Services cloud platform', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440005'::uuid, 'Azure', 'azure',
   'Microsoft Azure cloud platform', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440006'::uuid, 'Google Cloud', 'google-cloud',
   'Google Cloud Platform services', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440007'::uuid, 'Docker', 'docker',
   'Docker containerization platform', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440008'::uuid, 'Kubernetes', 'kubernetes',
   'Kubernetes container orchestration', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440009'::uuid, 'DevOps', 'devops',
   'DevOps practices and methodologies', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440010'::uuid, 'CI/CD', 'ci-cd',
   'Continuous Integration and Continuous Deployment', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440011'::uuid, 'Security', 'security',
   'Cybersecurity and information security', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440012'::uuid, 'Cloud Security', 'cloud-security',
   'Security practices for cloud infrastructure', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440013'::uuid, 'Cloud Migration', 'cloud-migration',
   'Migrating applications and infrastructure to the cloud', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440014'::uuid, 'Digital Transformation', 'digital-transformation',
   'Business transformation through digital technologies', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440015'::uuid, 'IT Consulting', 'it-consulting',
   'IT consulting and advisory services', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440016'::uuid, 'Web Development', 'web-development',
   'Web application development', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440017'::uuid, 'API Development', 'api-development',
   'RESTful APIs and microservices', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440018'::uuid, 'Database', 'database',
   'Database design and management', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440019'::uuid, 'Microservices', 'microservices',
   'Microservices architecture', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440020'::uuid, 'Best Practices', 'best-practices',
   'Industry best practices and guidelines', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440021'::uuid, 'Tutorial', 'tutorial',
   'Step-by-step tutorials and guides', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440022'::uuid, 'Case Study', 'case-study',
   'Real-world case studies and examples', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440023'::uuid, 'Cloud', 'cloud',
   'Cloud computing and cloud technologies', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440024'::uuid, 'Innovation', 'innovation',
   'Innovation and technological advancement', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440025'::uuid, 'Technology', 'technology',
   'Technology trends and developments', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440026'::uuid, 'Remote Work', 'remote-work',
   'Remote work practices and technologies', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440027'::uuid, 'Strategy', 'strategy',
   'Business and technology strategy', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440028'::uuid, 'Business', 'business',
   'Business insights and practices', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440029'::uuid, 'Enterprise', 'enterprise',
   'Enterprise solutions and practices', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440030'::uuid, 'Optimization', 'optimization',
   'Performance and cost optimization', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440031'::uuid, 'BaaS', 'baas',
   'Backup as a Service solutions', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440032'::uuid, 'Data Protection', 'data-protection',
   'Data protection and security strategies', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440033'::uuid, 'Business Continuity', 'business-continuity',
   'Business continuity and disaster recovery', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440034'::uuid, 'Zero Trust', 'zero-trust',
   'Zero Trust security model and implementation', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('660e8400-e29b-41d4-a716-446655440035'::uuid, 'Implementation', 'implementation',
   'Implementation guides and best practices', 0,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, usage_count, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_tags WHERE blog_tags.id = v.id::uuid);

-- Seed posts with category_id foreign keys
DO $$
DECLARE
  default_author_id UUID := '550e8400-e29b-41d4-a716-446655440000'::uuid;
  cloud_solutions_id UUID := '770e8400-e29b-41d4-a716-446655440013'::uuid;
  cybersecurity_id UUID := '770e8400-e29b-41d4-a716-446655440014'::uuid;
  it_consulting_id UUID := '770e8400-e29b-41d4-a716-446655440017'::uuid;
  azure_id UUID := '770e8400-e29b-41d4-a716-446655440015'::uuid;
  backup_solutions_id UUID := '770e8400-e29b-41d4-a716-446655440016'::uuid;
BEGIN
  INSERT INTO posts (
    id, title, slug, excerpt, content, 
    author_id, author_name, author_email,
    status, published_at, category_id,
    featured_image, featured, pinned, allow_comments, views,
    created_at, updated_at
  )
  SELECT * FROM (VALUES
    ('880e8400-e29b-41d4-a716-446655440001'::uuid, 'The Future of Cloud Computing in 2025',
     'future-of-cloud-computing-2025',
     'Explore the latest trends and innovations shaping the cloud computing landscape this year.',
     'The cloud computing landscape continues to evolve at an unprecedented pace. In 2025, we are seeing remarkable innovations in areas such as edge computing, serverless architectures, and AI-driven cloud services. This comprehensive guide explores the key trends that are shaping the future of cloud computing and how businesses can leverage these technologies to stay competitive.',
     default_author_id, 'John Smith', 'john.smith@cloudnow.com',
     'published', '2025-05-15 10:00:00'::timestamptz, cloud_solutions_id,
     '/assets/images/placeholder/card-placeholder-01.jpg', true, false, true, 1245,
     '2025-05-15 09:00:00'::timestamptz, '2025-05-15 09:00:00'::timestamptz),
    
    ('880e8400-e29b-41d4-a716-446655440002'::uuid, 'Essential Security Practices for Remote Teams',
     'security-practices-remote-teams',
     'Learn how to protect your business data with these proven security strategies for distributed teams.',
     'Remote work has become the norm, but it brings unique security challenges. This article covers essential security practices that every remote team should implement, including multi-factor authentication, VPN usage, secure communication channels, and regular security training. We also explore common vulnerabilities and how to mitigate them effectively.',
     default_author_id, 'Sarah Johnson', 'sarah.johnson@cloudnow.com',
     'published', '2025-04-28 14:00:00'::timestamptz, cybersecurity_id,
     '/assets/images/placeholder/card-placeholder-02.jpg', false, false, true, 892,
     '2025-04-28 13:00:00'::timestamptz, '2025-04-28 13:00:00'::timestamptz),
    
    ('880e8400-e29b-41d4-a716-446655440003'::uuid, 'Digital Transformation: A Step-by-Step Guide',
     'digital-transformation-guide',
     'Navigate the complexities of digital transformation with our comprehensive roadmap.',
     'Digital transformation is no longer optional—it is essential for business survival and growth. This step-by-step guide walks you through the entire transformation process, from initial assessment and strategy development to implementation and continuous improvement. Learn how to overcome common challenges and ensure your digital transformation delivers real business value.',
     default_author_id, 'Michael Chen', 'michael.chen@cloudnow.com',
     'published', '2025-04-10 11:00:00'::timestamptz, it_consulting_id,
     '/assets/images/placeholder/card-placeholder-03.jpg', false, false, true, 1156,
     '2025-04-10 10:00:00'::timestamptz, '2025-04-10 10:00:00'::timestamptz),
    
    ('880e8400-e29b-41d4-a716-446655440004'::uuid, 'Optimizing Microsoft Azure for Enterprise Workloads',
     'optimizing-azure-enterprise',
     'Discover how to maximize performance and minimize costs when running enterprise applications on Azure.',
     'Microsoft Azure offers powerful capabilities for enterprise workloads, but optimization is key to achieving cost efficiency and performance. This article covers Azure optimization strategies including resource sizing, reserved instances, auto-scaling configurations, and monitoring best practices. We also discuss cost management tools and techniques to help you get the most value from your Azure investment.',
     default_author_id, 'Emily Rodriguez', 'emily.rodriguez@cloudnow.com',
     'published', '2025-03-22 09:00:00'::timestamptz, azure_id,
     '/assets/images/placeholder/card-placeholder-04.jpg', false, false, true, 678,
     '2025-03-22 08:00:00'::timestamptz, '2025-03-22 08:00:00'::timestamptz),
    
    ('880e8400-e29b-41d4-a716-446655440005'::uuid, 'The Business Case for Backup as a Service',
     'business-case-baas',
     'Why modern businesses are turning to BaaS solutions for reliable data protection and business continuity.',
     'Backup as a Service (BaaS) has become a critical component of modern IT infrastructure. This article explores the business case for BaaS, including cost savings, improved reliability, scalability, and compliance benefits. We examine different BaaS models and provide guidance on selecting the right solution for your organization. Learn how BaaS can enhance your disaster recovery capabilities and reduce operational overhead.',
     default_author_id, 'David Wilson', 'david.wilson@cloudnow.com',
     'published', '2025-03-05 15:00:00'::timestamptz, backup_solutions_id,
     '/assets/images/placeholder/card-placeholder-05.jpg', true, false, true, 943,
     '2025-03-05 14:00:00'::timestamptz, '2025-03-05 14:00:00'::timestamptz),
    
    ('880e8400-e29b-41d4-a716-446655440006'::uuid, 'Implementing Zero Trust Security in Your Organization',
     'implementing-zero-trust',
     'A practical guide to adopting the zero trust security model for enhanced protection in today''s threat landscape.',
     'Zero Trust security is a comprehensive approach that assumes no implicit trust based on network location. This guide provides a practical roadmap for implementing Zero Trust in your organization, covering identity verification, device security, network segmentation, and continuous monitoring. We discuss the key principles, implementation phases, and common challenges organizations face when adopting Zero Trust.',
     default_author_id, 'Alex Thompson', 'alex.thompson@cloudnow.com',
     'published', '2025-02-18 12:00:00'::timestamptz, cybersecurity_id,
     '/assets/images/placeholder/card-placeholder-01.jpg', false, false, true, 756,
     '2025-02-18 11:00:00'::timestamptz, '2025-02-18 11:00:00'::timestamptz)
  ) AS v(
    id, title, slug, excerpt, content,
    author_id, author_name, author_email,
    status, published_at, category_id,
    featured_image, featured, pinned, allow_comments, views,
    created_at, updated_at
  )
  WHERE NOT EXISTS (SELECT 1 FROM posts WHERE posts.id = v.id::uuid);
END $$;

-- Seed post_tags junction table
INSERT INTO post_tags (post_id, tag_id)
SELECT * FROM (VALUES
  -- Post 1: The Future of Cloud Computing in 2025
  ('880e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440023'::uuid), -- Cloud
  ('880e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440024'::uuid), -- Innovation
  ('880e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440025'::uuid), -- Technology
  
  -- Post 2: Essential Security Practices for Remote Teams
  ('880e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440011'::uuid), -- Security
  ('880e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440026'::uuid), -- Remote Work
  ('880e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440020'::uuid), -- Best Practices
  
  -- Post 3: Digital Transformation: A Step-by-Step Guide
  ('880e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440014'::uuid), -- Digital Transformation
  ('880e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440027'::uuid), -- Strategy
  ('880e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440028'::uuid), -- Business
  
  -- Post 4: Optimizing Microsoft Azure for Enterprise Workloads
  ('880e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440005'::uuid), -- Azure
  ('880e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440029'::uuid), -- Enterprise
  ('880e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440030'::uuid), -- Optimization
  
  -- Post 5: The Business Case for Backup as a Service
  ('880e8400-e29b-41d4-a716-446655440005'::uuid, '660e8400-e29b-41d4-a716-446655440031'::uuid), -- BaaS
  ('880e8400-e29b-41d4-a716-446655440005'::uuid, '660e8400-e29b-41d4-a716-446655440032'::uuid), -- Data Protection
  ('880e8400-e29b-41d4-a716-446655440005'::uuid, '660e8400-e29b-41d4-a716-446655440033'::uuid), -- Business Continuity
  
  -- Post 6: Implementing Zero Trust Security in Your Organization
  ('880e8400-e29b-41d4-a716-446655440006'::uuid, '660e8400-e29b-41d4-a716-446655440034'::uuid), -- Zero Trust
  ('880e8400-e29b-41d4-a716-446655440006'::uuid, '660e8400-e29b-41d4-a716-446655440011'::uuid), -- Security
  ('880e8400-e29b-41d4-a716-446655440006'::uuid, '660e8400-e29b-41d4-a716-446655440035'::uuid)  -- Implementation
) AS v(post_id, tag_id)
WHERE NOT EXISTS (
  SELECT 1 FROM post_tags 
  WHERE post_tags.post_id = v.post_id::uuid 
  AND post_tags.tag_id = v.tag_id::uuid
);




