-- Seed blog tags data
-- Insert common blog tags for CloudNow Solutions blog

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
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz)
) AS v(id, name, slug, description, usage_count, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_tags WHERE blog_tags.id = v.id::uuid);




