-- Seed faq groups data
-- Insert 5 FAQ groups matching the UI data

INSERT INTO faq_groups (id, group_name, description, usage_paths, is_active, created_at, updated_at)
SELECT * FROM (VALUES
  ('880e8400-e29b-41d4-a716-446655440001'::uuid, 'Main FAQ',
   'Primary FAQ group containing the most commonly asked questions',
   ARRAY['/faq', '/support'],
   true,
   '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('880e8400-e29b-41d4-a716-446655440002'::uuid, 'Cloud Services FAQ',
   'Frequently asked questions about our cloud services and solutions',
   ARRAY['/services/cloud-migration', '/services/cloud-consulting'],
   true,
   '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  
  ('880e8400-e29b-41d4-a716-446655440003'::uuid, 'Security & Support FAQ',
   'Questions about security measures and technical support',
   ARRAY['/services/cloud-security', '/support'],
   true,
   '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),
  
  ('880e8400-e29b-41d4-a716-446655440004'::uuid, 'Implementation FAQ',
   'Questions about project implementation and training',
   ARRAY['/services/implementation'],
   true,
   '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),
  
  ('880e8400-e29b-41d4-a716-446655440005'::uuid, 'Billing FAQ',
   'Questions about pricing, billing, and payment',
   ARRAY[]::TEXT[],
   true,
   '2024-02-15'::timestamptz, '2024-02-15'::timestamptz)
) AS v(id, group_name, description, usage_paths, is_active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM faq_groups WHERE faq_groups.id = v.id::uuid);


