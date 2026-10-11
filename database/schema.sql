-- ============================================================
-- GK Services Appliance Repairs — Database Schema
-- Database Layer: PostgreSQL / Supabase
-- ============================================================

-- 1. Create table: service_requests
CREATE TABLE IF NOT EXISTS public.service_requests (
  id                    BIGSERIAL PRIMARY KEY,
  mobile_number         TEXT NOT NULL,
  appliance_type        TEXT NOT NULL CHECK (appliance_type IN ('Washing Machine', 'Refrigerator')),
  brand                 TEXT NOT NULL,
  appliance_age         TEXT NOT NULL,
  customer_name         TEXT DEFAULT '',
  customer_area         TEXT DEFAULT '',
  problem_description   TEXT DEFAULT '',
  preferred_contact_time TEXT DEFAULT '',
  status                TEXT DEFAULT 'New'
                          CHECK (status IN ('New', 'Contacted', 'Service Scheduled', 'Completed', 'Cancelled')),
  admin_notes           TEXT DEFAULT '',
  is_spam               BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure customer_area column exists if table was created previously without it
ALTER TABLE IF EXISTS public.service_requests 
  ADD COLUMN IF NOT EXISTS customer_area TEXT DEFAULT '';

-- 2. Trigger function to automatically update updated_at on record edit
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.service_requests;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Row-Level Security (RLS)
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Anonymous public users (customer frontend) can insert requests
DROP POLICY IF EXISTS "public_can_insert" ON public.service_requests;
CREATE POLICY "public_can_insert"
  ON public.service_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Backend service role key automatically bypasses RLS for full admin operations
-- (SELECT, UPDATE, DELETE). No direct SELECT policy for anon role guarantees
-- customer privacy and prevents data scraping.

-- 4. High-performance indexes for search, filtering, and sorting
CREATE INDEX IF NOT EXISTS idx_mobile_number ON public.service_requests (mobile_number);
CREATE INDEX IF NOT EXISTS idx_created_at    ON public.service_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_status        ON public.service_requests (status);
CREATE INDEX IF NOT EXISTS idx_appliance     ON public.service_requests (appliance_type);
CREATE INDEX IF NOT EXISTS idx_customer_area ON public.service_requests (customer_area);
