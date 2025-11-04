-- Create testimonial_groups table
CREATE TABLE IF NOT EXISTS testimonial_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  testimonial_ids UUID[] NOT NULL DEFAULT '{}',
  order_array TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_paths TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_is_active ON testimonial_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_created_at ON testimonial_groups(created_at DESC);

-- Create GIN indexes for array searches
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_testimonial_ids ON testimonial_groups USING GIN(testimonial_ids);
CREATE INDEX IF NOT EXISTS idx_testimonial_groups_usage_paths ON testimonial_groups USING GIN(usage_paths);

-- Enable Row Level Security
ALTER TABLE testimonial_groups ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at automatically
CREATE TRIGGER update_testimonial_groups_updated_at
  BEFORE UPDATE ON testimonial_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

