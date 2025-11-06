-- Combined migration file to apply all FAQ migrations
-- Run this file in your Supabase SQL Editor to set up the database
-- Order: Groups Table -> FAQs Table -> RLS Policies -> Seed Data

-- ============================================
-- 1. Create faq_groups table (must be created before faqs)
-- ============================================
CREATE TABLE IF NOT EXISTS faq_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  usage_paths TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_faq_groups_is_active ON faq_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_groups_created_at ON faq_groups(created_at DESC);

-- Create GIN indexes for array searches
CREATE INDEX IF NOT EXISTS idx_faq_groups_usage_paths ON faq_groups USING GIN(usage_paths);

-- Enable Row Level Security
ALTER TABLE faq_groups ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_faq_groups_updated_at ON faq_groups;
CREATE TRIGGER update_faq_groups_updated_at
  BEFORE UPDATE ON faq_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Create faqs table
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_faq_group FOREIGN KEY (group_id) REFERENCES faq_groups(id) ON DELETE CASCADE
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_faqs_group_id ON faqs(group_id);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(group_id, "order");
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Setup RLS Policies
-- ============================================
-- RLS Policies for faq_groups table
-- Allow authenticated users to read all faq groups
DROP POLICY IF EXISTS "Authenticated users can read faq_groups" ON faq_groups;
CREATE POLICY "Authenticated users can read faq_groups"
  ON faq_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert faq groups
DROP POLICY IF EXISTS "Authenticated users can insert faq_groups" ON faq_groups;
CREATE POLICY "Authenticated users can insert faq_groups"
  ON faq_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update faq groups
DROP POLICY IF EXISTS "Authenticated users can update faq_groups" ON faq_groups;
CREATE POLICY "Authenticated users can update faq_groups"
  ON faq_groups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete faq groups
DROP POLICY IF EXISTS "Authenticated users can delete faq_groups" ON faq_groups;
CREATE POLICY "Authenticated users can delete faq_groups"
  ON faq_groups
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for faqs table
-- Allow authenticated users to read all faqs
DROP POLICY IF EXISTS "Authenticated users can read faqs" ON faqs;
CREATE POLICY "Authenticated users can read faqs"
  ON faqs
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert faqs
DROP POLICY IF EXISTS "Authenticated users can insert faqs" ON faqs;
CREATE POLICY "Authenticated users can insert faqs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update faqs
DROP POLICY IF EXISTS "Authenticated users can update faqs" ON faqs;
CREATE POLICY "Authenticated users can update faqs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete faqs
DROP POLICY IF EXISTS "Authenticated users can delete faqs" ON faqs;
CREATE POLICY "Authenticated users can delete faqs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 4. Seed faq groups data (optional)
-- ============================================
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

-- ============================================
-- 5. Seed FAQs data (optional)
-- ============================================
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

-- ============================================
-- Migration Complete!
-- ============================================
-- The tables should now be available in PostgREST
-- If you still see PGRST205 errors, try:
-- 1. Wait a few seconds for PostgREST to refresh its schema cache
-- 2. Check that RLS policies are correctly set
-- 3. Verify you're authenticated when making requests




