-- RLS Policies for testimonials table
-- Allow authenticated users to read all testimonials
CREATE POLICY "Authenticated users can read testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert testimonials
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update testimonials
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete testimonials
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for testimonial_groups table
-- Allow authenticated users to read all testimonial groups
CREATE POLICY "Authenticated users can read testimonial_groups"
  ON testimonial_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert testimonial groups
CREATE POLICY "Authenticated users can insert testimonial_groups"
  ON testimonial_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update testimonial groups
CREATE POLICY "Authenticated users can update testimonial_groups"
  ON testimonial_groups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete testimonial groups
CREATE POLICY "Authenticated users can delete testimonial_groups"
  ON testimonial_groups
  FOR DELETE
  TO authenticated
  USING (true);

