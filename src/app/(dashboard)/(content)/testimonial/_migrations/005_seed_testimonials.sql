-- Seed testimonials data
-- Insert 7 testimonials matching the UI data

INSERT INTO testimonials (id, name, title, company, testimony, image, rating, categories, is_visible, created_at, updated_at) VALUES
-- Sarah Johnson (will be mapped from testimonial_1)
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'CTO', 'TechCorp Solutions', 
 'CloudNow''s cloud migration service was exceptional. They helped us seamlessly transition our entire infrastructure to AWS, reducing costs by 40% while improving performance. Their team''s expertise and support throughout the process was outstanding.',
 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
 5, ARRAY['Customer Success', 'Implementation'], true, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),

-- Michael Chen (testimonial_2)
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'IT Director', 'Global Enterprises',
 'The technical support team at CloudNow is incredibly responsive and knowledgeable. They resolved our critical issues within hours and provided excellent guidance on best practices. Highly recommended!',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 5, ARRAY['Technical Support', 'Service Quality'], true, '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),

-- Emily Rodriguez (testimonial_3)
('550e8400-e29b-41d4-a716-446655440003', 'Emily Rodriguez', 'VP of Operations', 'StartupXYZ',
 'CloudNow''s Microsoft Solutions team helped us implement Office 365 and Azure AD across our organization. The migration was smooth and their training sessions were very helpful for our team.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
 4, ARRAY['Implementation'], true, '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),

-- David Thompson (testimonial_4)
('550e8400-e29b-41d4-a716-446655440004', 'David Thompson', 'CEO', 'InnovateTech',
 'We''ve been using CloudNow''s hosting services for over two years. The uptime is excellent and their customer service is top-notch. They''ve become an essential partner for our business.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
 5, ARRAY['Partnership'], true, '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),

-- Lisa Wang (testimonial_5)
('550e8400-e29b-41d4-a716-446655440005', 'Lisa Wang', 'Security Manager', 'SecureCorp',
 'CloudNow''s cybersecurity services helped us strengthen our security posture significantly. Their comprehensive security assessment identified vulnerabilities we weren''t aware of, and their remediation plan was thorough and effective.',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
 5, ARRAY['Service Quality'], true, '2024-02-15'::timestamptz, '2024-02-15'::timestamptz),

-- Robert Kim (testimonial_6)
('550e8400-e29b-41d4-a716-446655440006', 'Robert Kim', 'IT Manager', 'ManufacturingCo',
 'The backup and recovery solution from CloudNow saved us from a major data loss incident. Their automated backup system worked flawlessly and their recovery process was quick and efficient.',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
 5, ARRAY['Customer Success'], true, '2024-02-20'::timestamptz, '2024-02-20'::timestamptz),

-- Jennifer Adams (testimonial_7) - Hidden
('550e8400-e29b-41d4-a716-446655440007', 'Jennifer Adams', 'Operations Director', 'RetailMax',
 'CloudNow''s IT consulting services provided us with valuable insights into our technology infrastructure. Their recommendations helped us optimize our systems and improve efficiency across all departments.',
 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
 4, ARRAY['General Feedback'], false, '2024-02-25'::timestamptz, '2024-02-25'::timestamptz);

