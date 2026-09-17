-- ============================================================================
-- ALL-IN-ONE SUPABASE SETUP SCRIPT (DATABASE TABLES + STORAGE BUCKET + POLICIES)
-- Allows any person from any country/device to submit applications & upload files
-- ============================================================================

-- 1. Create Storage Bucket for candidate file/image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-files', 'application-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Bucket Policies (Global Public Upload & Download Access)
DROP POLICY IF EXISTS "Public Access - Upload to application-files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Read from application-files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Update in application-files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Delete in application-files" ON storage.objects;

CREATE POLICY "Public Access - Upload to application-files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'application-files');

CREATE POLICY "Public Access - Read from application-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'application-files');

CREATE POLICY "Public Access - Update in application-files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'application-files')
WITH CHECK (bucket_id = 'application-files');

CREATE POLICY "Public Access - Delete in application-files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'application-files');


-- 3. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',

  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT,
  marital_status TEXT,
  self_introduction TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL,
  social_handle TEXT DEFAULT 'no',
  linkedin TEXT,
  portfolio TEXT,

  -- Employment History
  currently_employed TEXT,
  how_obtained TEXT,
  previous_titles TEXT,
  previous_employers TEXT,
  responsibilities TEXT,
  years_experience TEXT,
  why_right_candidate TEXT,

  -- Experience & Skills
  position_types TEXT,
  relevant_experience TEXT,
  key_skills TEXT,
  proud_achievement TEXT,
  has_hp_printer TEXT,
  check_printing_exp TEXT,
  resume_file_name TEXT,
  portfolio_file_name TEXT,

  -- Work Preferences
  employment_type TEXT,
  flexible_hours TEXT,
  work_arrangement TEXT,
  role_type TEXT,
  tenure_intent TEXT,
  company_size_preference TEXT,
  payment_preference TEXT,
  mobile_carrier TEXT,
  mobile_plan_type TEXT,

  -- Additional / Financial / Verification
  has_credit_card TEXT,
  credit_card_bank TEXT,
  has_credit_card_debt TEXT,
  credit_score TEXT,
  bank_used TEXT,
  has_401k TEXT,
  plan_401k_provider TEXT,
  filed_taxes TEXT,
  military_service TEXT,
  work_authorized TEXT,
  training_willingness TEXT,
  has_id_me TEXT,
  ssn TEXT,
  id_front_file_name TEXT,
  id_back_file_name TEXT,
  ssn_card_file_name TEXT,
  address_confirmed BOOLEAN DEFAULT FALSE,
  policy_accepted BOOLEAN DEFAULT FALSE,
  additional_info TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Status History Table
CREATE TABLE IF NOT EXISTS public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- 5. Create Admin Notes Table
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Fast Query Indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_reference ON public.applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON public.status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_app_id ON public.admin_notes(application_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- 8. Permissive Policies for Global Public Candidate Submissions & Admin Management
DROP POLICY IF EXISTS "Allow public read access to applications" ON public.applications;
DROP POLICY IF EXISTS "Allow public insert access to applications" ON public.applications;
DROP POLICY IF EXISTS "Allow public update access to applications" ON public.applications;
DROP POLICY IF EXISTS "Allow public read access to status_history" ON public.status_history;
DROP POLICY IF EXISTS "Allow public insert access to status_history" ON public.status_history;
DROP POLICY IF EXISTS "Allow public read access to admin_notes" ON public.admin_notes;
DROP POLICY IF EXISTS "Allow public insert access to admin_notes" ON public.admin_notes;

CREATE POLICY "Allow public read access to applications"
  ON public.applications FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access to applications"
  ON public.applications FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update access to applications"
  ON public.applications FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public read access to status_history"
  ON public.status_history FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access to status_history"
  ON public.status_history FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public read access to admin_notes"
  ON public.admin_notes FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access to admin_notes"
  ON public.admin_notes FOR INSERT TO public WITH CHECK (true);
