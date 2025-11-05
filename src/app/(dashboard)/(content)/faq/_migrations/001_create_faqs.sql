-- Create faqs table
-- IMPORTANT: This table requires faq_groups table to exist first.
-- Apply 002_create_faq_groups.sql before this migration, or use 000_apply_all_migrations.sql
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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

