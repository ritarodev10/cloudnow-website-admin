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





