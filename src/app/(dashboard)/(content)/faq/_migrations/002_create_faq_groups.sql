-- Create faq_groups table
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

-- Create trigger to update updated_at automatically
CREATE TRIGGER update_faq_groups_updated_at
  BEFORE UPDATE ON faq_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


