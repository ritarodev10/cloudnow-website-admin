-- Seed blog categories data
-- Insert common blog categories for CloudNow Solutions blog

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
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, is_active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.id = v.id::uuid);




