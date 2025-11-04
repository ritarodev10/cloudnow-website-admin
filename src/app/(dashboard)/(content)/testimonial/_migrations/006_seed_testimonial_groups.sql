-- Seed testimonial groups data
-- Insert category-named groups (categories match testimonial categories exactly)

INSERT INTO testimonial_groups (id, name, description, testimonial_ids, order_array, is_active, usage_paths, created_at, updated_at) VALUES
-- Customer Success category group
('770e8400-e29b-41d4-a716-446655440001'::uuid, 'Customer Success',
 'Customer success and satisfaction testimonials',
 ARRAY['550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006'],
 true,
 ARRAY['/services/cloud-migration', '/services/cloud-consulting'],
 '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),

-- Product Review category group
('770e8400-e29b-41d4-a716-446655440002'::uuid, 'Product Review',
 'Product and service review testimonials',
 ARRAY[]::UUID[],
 ARRAY[]::TEXT[],
 true,
 ARRAY[]::TEXT[],
 '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),

-- Service Quality category group
('770e8400-e29b-41d4-a716-446655440003'::uuid, 'Service Quality',
 'Service quality and excellence testimonials',
 ARRAY['550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'],
 true,
 ARRAY['/services/cloud-support', '/services/cloud-monitoring'],
 '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),

-- Technical Support category group
('770e8400-e29b-41d4-a716-446655440004'::uuid, 'Technical Support',
 'Technical support and assistance testimonials',
 ARRAY['550e8400-e29b-41d4-a716-446655440002'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440002'],
 true,
 ARRAY['/services/devops-automation', '/services/cloud-security'],
 '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),

-- Implementation category group
('770e8400-e29b-41d4-a716-446655440005'::uuid, 'Implementation',
 'Implementation and deployment testimonials',
 ARRAY['550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'],
 true,
 ARRAY['/services/cloud-migration'],
 '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),

-- Partnership category group
('770e8400-e29b-41d4-a716-446655440006'::uuid, 'Partnership',
 'Partnership and collaboration testimonials',
 ARRAY['550e8400-e29b-41d4-a716-446655440004'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440004'],
 true,
 ARRAY[]::TEXT[],
 '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),

-- General Feedback category group
('770e8400-e29b-41d4-a716-446655440007'::uuid, 'General Feedback',
 'General testimonials and feedback',
 ARRAY['550e8400-e29b-41d4-a716-446655440007'::uuid],
 ARRAY['550e8400-e29b-41d4-a716-446655440007'],
 true,
 ARRAY[]::TEXT[],
 '2024-02-25'::timestamptz, '2024-02-25'::timestamptz);

