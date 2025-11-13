-- Seed FAQs data
-- Insert 12 FAQs distributed across 5 groups (4+3+2+2+1)

INSERT INTO faqs (id, group_id, question, answer, "order", created_at, updated_at)
SELECT * FROM (VALUES
  -- Main FAQ (4 FAQs)
  ('990e8400-e29b-41d4-a716-446655440001'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid,
   'What services does CloudNow Solutions offer?',
   'CloudNow Solutions offers a comprehensive range of cloud services including cloud migration, cloud consulting, cloud security, DevOps automation, cloud monitoring, Microsoft Solutions, IT consulting, hosting services, backup and recovery, and cybersecurity services.',
   0, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440002'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid,
   'How can I contact CloudNow Solutions?',
   'You can contact us through our contact page, email us directly, or call our support line. Our team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters, we also offer 24/7 emergency support.',
   1, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440003'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid,
   'What makes CloudNow Solutions different from other cloud service providers?',
   'CloudNow Solutions stands out through our personalized approach, deep technical expertise, and commitment to customer success. We provide end-to-end solutions, from initial consultation to ongoing support, ensuring seamless integration with your existing infrastructure.',
   2, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440004'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid,
   'Do you provide training for our team?',
   'Yes, we offer comprehensive training programs tailored to your team''s needs. Our training covers cloud platforms, security best practices, DevOps tools, and more. We provide both on-site and remote training options to accommodate your schedule.',
   3, '2024-01-15'::timestamptz, '2024-01-15'::timestamptz),
  
  -- Cloud Services FAQ (3 FAQs)
  ('990e8400-e29b-41d4-a716-446655440005'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid,
   'What cloud platforms do you support?',
   'We support all major cloud platforms including Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), and hybrid cloud environments. Our team has extensive experience with each platform and can help you choose the best solution for your needs.',
   0, '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid,
   'How long does a typical cloud migration take?',
   'The duration of a cloud migration depends on the complexity of your infrastructure, the size of your organization, and the specific services being migrated. Typically, a full migration can take anywhere from 2-6 months. We provide a detailed timeline during our initial consultation.',
   1, '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440007'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid,
   'Can you help optimize our existing cloud infrastructure?',
   'Absolutely! Our cloud consulting services include infrastructure optimization, cost reduction strategies, performance tuning, and architecture reviews. We analyze your current setup and provide actionable recommendations to improve efficiency and reduce costs.',
   2, '2024-01-20'::timestamptz, '2024-01-20'::timestamptz),
  
  -- Security & Support FAQ (2 FAQs)
  ('990e8400-e29b-41d4-a716-446655440008'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid,
   'What security measures do you implement?',
   'We implement comprehensive security measures including multi-factor authentication, encryption at rest and in transit, regular security audits, vulnerability assessments, compliance with industry standards (SOC 2, ISO 27001), and 24/7 security monitoring. We also provide security training for your team.',
   0, '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440009'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid,
   'What is your support response time?',
   'Our support response times vary by severity: Critical issues are addressed within 1 hour, High priority within 4 hours, Medium priority within 24 hours, and Low priority within 48 hours. We also offer 24/7 emergency support for critical infrastructure issues.',
   1, '2024-02-01'::timestamptz, '2024-02-01'::timestamptz),
  
  -- Implementation FAQ (2 FAQs)
  ('990e8400-e29b-41d4-a716-446655440010'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid,
   'What is included in your implementation process?',
   'Our implementation process includes initial assessment and planning, architecture design, phased deployment, testing and validation, documentation, team training, and ongoing support. We work closely with your team throughout the entire process to ensure a smooth transition.',
   0, '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),
  
  ('990e8400-e29b-41d4-a716-446655440011'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid,
   'Do you provide documentation for implemented solutions?',
   'Yes, we provide comprehensive documentation including architecture diagrams, configuration guides, operation manuals, troubleshooting guides, and best practices. All documentation is tailored to your specific implementation and kept up-to-date as your infrastructure evolves.',
   1, '2024-02-10'::timestamptz, '2024-02-10'::timestamptz),
  
  -- Billing FAQ (1 FAQ)
  ('990e8400-e29b-41d4-a716-446655440012'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid,
   'What are your payment terms and methods?',
   'We accept payment via credit card, bank transfer, and ACH. Payment terms vary by service type: Consulting services typically require a 50% deposit with the balance due upon completion. Monthly services are billed in advance. We also offer annual contracts with discounted rates. Please contact our billing department for detailed pricing information.',
   0, '2024-02-15'::timestamptz, '2024-02-15'::timestamptz)
) AS v(id, group_id, question, answer, "order", created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE faqs.id = v.id::uuid);





