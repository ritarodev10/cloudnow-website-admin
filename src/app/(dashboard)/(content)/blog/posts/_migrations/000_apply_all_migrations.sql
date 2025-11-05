-- Combined migration file to apply all blog posts migrations
-- Run this file in your Supabase SQL Editor to set up the database
-- Order: Table -> RLS Policies -> Seed Data

-- ============================================
-- 1. Create posts table
-- ============================================
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
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  featured_image VARCHAR(500),
  featured BOOLEAN NOT NULL DEFAULT false,
  pinned BOOLEAN NOT NULL DEFAULT false,
  allow_comments BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(pinned);

-- GIN index for tags array search
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Set up Row Level Security Policies
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read posts" ON posts;
DROP POLICY IF EXISTS "Allow service role to manage posts" ON posts;

-- Allow authenticated users to read all posts
CREATE POLICY "Allow authenticated users to read posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage all posts
CREATE POLICY "Allow service role to manage posts"
  ON posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. Seed blog posts data
-- ============================================
DO $$
DECLARE
  default_author_id UUID := '550e8400-e29b-41d4-a716-446655440000'::uuid;
BEGIN
  -- Insert seed posts
  INSERT INTO posts (
    id, title, slug, excerpt, content, 
    author_id, author_name, author_email,
    status, published_at, category, tags, 
    featured_image, featured, pinned, allow_comments, views,
    created_at, updated_at
  )
  SELECT * FROM (VALUES
    -- Post 1: The Future of Cloud Computing in 2025
    (
      '880e8400-e29b-41d4-a716-446655440001'::uuid,
      'The Future of Cloud Computing in 2025',
      'future-of-cloud-computing-2025',
      'Explore the latest trends and innovations shaping the cloud computing landscape this year.',
      'The cloud computing landscape continues to evolve at an unprecedented pace. In 2025, we are seeing remarkable innovations in areas such as edge computing, serverless architectures, and AI-driven cloud services. This comprehensive guide explores the key trends that are shaping the future of cloud computing and how businesses can leverage these technologies to stay competitive.',
      default_author_id,
      'John Smith',
      'john.smith@cloudnow.com',
      'published',
      '2025-05-15 10:00:00'::timestamptz,
      'Cloud Solutions',
      ARRAY['Cloud', 'Innovation', 'Technology'],
      '/assets/images/placeholder/card-placeholder-01.jpg',
      true,
      false,
      true,
      1245,
      '2025-05-15 09:00:00'::timestamptz,
      '2025-05-15 09:00:00'::timestamptz
    ),
    
    -- Post 2: Essential Security Practices for Remote Teams
    (
      '880e8400-e29b-41d4-a716-446655440002'::uuid,
      'Essential Security Practices for Remote Teams',
      'security-practices-remote-teams',
      'Learn how to protect your business data with these proven security strategies for distributed teams.',
      'Remote work has become the norm, but it brings unique security challenges. This article covers essential security practices that every remote team should implement, including multi-factor authentication, VPN usage, secure communication channels, and regular security training. We also explore common vulnerabilities and how to mitigate them effectively.',
      default_author_id,
      'Sarah Johnson',
      'sarah.johnson@cloudnow.com',
      'published',
      '2025-04-28 14:00:00'::timestamptz,
      'Cybersecurity',
      ARRAY['Security', 'Remote Work', 'Best Practices'],
      '/assets/images/placeholder/card-placeholder-02.jpg',
      false,
      false,
      true,
      892,
      '2025-04-28 13:00:00'::timestamptz,
      '2025-04-28 13:00:00'::timestamptz
    ),
    
    -- Post 3: Digital Transformation: A Step-by-Step Guide
    (
      '880e8400-e29b-41d4-a716-446655440003'::uuid,
      'Digital Transformation: A Step-by-Step Guide',
      'digital-transformation-guide',
      'Navigate the complexities of digital transformation with our comprehensive roadmap.',
      'Digital transformation is no longer optional—it is essential for business survival and growth. This step-by-step guide walks you through the entire transformation process, from initial assessment and strategy development to implementation and continuous improvement. Learn how to overcome common challenges and ensure your digital transformation delivers real business value.',
      default_author_id,
      'Michael Chen',
      'michael.chen@cloudnow.com',
      'published',
      '2025-04-10 11:00:00'::timestamptz,
      'IT Consulting',
      ARRAY['Digital Transformation', 'Strategy', 'Business'],
      '/assets/images/placeholder/card-placeholder-03.jpg',
      false,
      false,
      true,
      1156,
      '2025-04-10 10:00:00'::timestamptz,
      '2025-04-10 10:00:00'::timestamptz
    ),
    
    -- Post 4: Optimizing Microsoft Azure for Enterprise Workloads
    (
      '880e8400-e29b-41d4-a716-446655440004'::uuid,
      'Optimizing Microsoft Azure for Enterprise Workloads',
      'optimizing-azure-enterprise',
      'Discover how to maximize performance and minimize costs when running enterprise applications on Azure.',
      'Microsoft Azure offers powerful capabilities for enterprise workloads, but optimization is key to achieving cost efficiency and performance. This article covers Azure optimization strategies including resource sizing, reserved instances, auto-scaling configurations, and monitoring best practices. We also discuss cost management tools and techniques to help you get the most value from your Azure investment.',
      default_author_id,
      'Emily Rodriguez',
      'emily.rodriguez@cloudnow.com',
      'published',
      '2025-03-22 09:00:00'::timestamptz,
      'Microsoft Azure',
      ARRAY['Azure', 'Enterprise', 'Optimization'],
      '/assets/images/placeholder/card-placeholder-04.jpg',
      false,
      false,
      true,
      678,
      '2025-03-22 08:00:00'::timestamptz,
      '2025-03-22 08:00:00'::timestamptz
    ),
    
    -- Post 5: The Business Case for Backup as a Service
    (
      '880e8400-e29b-41d4-a716-446655440005'::uuid,
      'The Business Case for Backup as a Service',
      'business-case-baas',
      'Why modern businesses are turning to BaaS solutions for reliable data protection and business continuity.',
      'Backup as a Service (BaaS) has become a critical component of modern IT infrastructure. This article explores the business case for BaaS, including cost savings, improved reliability, scalability, and compliance benefits. We examine different BaaS models and provide guidance on selecting the right solution for your organization. Learn how BaaS can enhance your disaster recovery capabilities and reduce operational overhead.',
      default_author_id,
      'David Wilson',
      'david.wilson@cloudnow.com',
      'published',
      '2025-03-05 15:00:00'::timestamptz,
      'Backup Solutions',
      ARRAY['BaaS', 'Data Protection', 'Business Continuity'],
      '/assets/images/placeholder/card-placeholder-05.jpg',
      true,
      false,
      true,
      943,
      '2025-03-05 14:00:00'::timestamptz,
      '2025-03-05 14:00:00'::timestamptz
    ),
    
    -- Post 6: Implementing Zero Trust Security in Your Organization
    (
      '880e8400-e29b-41d4-a716-446655440006'::uuid,
      'Implementing Zero Trust Security in Your Organization',
      'implementing-zero-trust',
      'A practical guide to adopting the zero trust security model for enhanced protection in today''s threat landscape.',
      'Zero Trust security is a comprehensive approach that assumes no implicit trust based on network location. This guide provides a practical roadmap for implementing Zero Trust in your organization, covering identity verification, device security, network segmentation, and continuous monitoring. We discuss the key principles, implementation phases, and common challenges organizations face when adopting Zero Trust.',
      default_author_id,
      'Alex Thompson',
      'alex.thompson@cloudnow.com',
      'published',
      '2025-02-18 12:00:00'::timestamptz,
      'Cybersecurity',
      ARRAY['Zero Trust', 'Security', 'Implementation'],
      '/assets/images/placeholder/card-placeholder-01.jpg',
      false,
      false,
      true,
      756,
      '2025-02-18 11:00:00'::timestamptz,
      '2025-02-18 11:00:00'::timestamptz
    )
  ) AS v(
    id, title, slug, excerpt, content,
    author_id, author_name, author_email,
    status, published_at, category, tags,
    featured_image, featured, pinned, allow_comments, views,
    created_at, updated_at
  )
  WHERE NOT EXISTS (SELECT 1 FROM posts WHERE posts.id = v.id::uuid);
END $$;

