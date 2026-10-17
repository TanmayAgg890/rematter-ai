-- ReMatter AI Database Schema (v2, Hackathon Edition)
-- PostgreSQL with Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  description TEXT,
  quantity TEXT,
  condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scans"
  ON public.scans FOR ALL
  USING (auth.uid() = user_id);

-- 3. Material Assessments Table
CREATE TABLE IF NOT EXISTS public.material_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  detected_material TEXT NOT NULL,
  category TEXT NOT NULL,
  candidate_materials JSONB,
  visible_evidence TEXT[],
  labels_or_codes TEXT[],
  uncertainties TEXT[],
  missing_info TEXT[],
  follow_up_questions TEXT[],
  condition TEXT,
  is_hazardous BOOLEAN DEFAULT FALSE,
  requires_specialist BOOLEAN DEFAULT FALSE,
  routing_level INT DEFAULT 1,
  user_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.material_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assessments"
  ON public.material_assessments FOR ALL
  USING (auth.uid() = user_id);

-- 4. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience TEXT NOT NULL,
  tools TEXT NOT NULL,
  budget TEXT NOT NULL,
  time_commitment TEXT NOT NULL,
  goal TEXT NOT NULL,
  location TEXT,
  extra_constraints TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- 5. Recommendation Sets Table
CREATE TABLE IF NOT EXISTS public.recommendation_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_version TEXT,
  ranking_version TEXT DEFAULT 'v2.1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recommendation_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their recommendation sets"
  ON public.recommendation_sets FOR ALL
  USING (auth.uid() = user_id);

-- 6. Ideas Table
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_set_id UUID REFERENCES public.recommendation_sets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level INT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_minutes INT,
  estimated_cost_inr JSONB,
  required_tools TEXT[],
  required_materials TEXT[],
  suitability_conditions TEXT[],
  safety_notes TEXT[],
  feasibility_score INT,
  feasibility_breakdown JSONB,
  feasibility_explanation TEXT,
  why_this_fits TEXT,
  sources JSONB,
  plan_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read public ideas or own set ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (TRUE);

-- 7. Saved Ideas Table
CREATE TABLE IF NOT EXISTS public.saved_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, idea_id)
);

ALTER TABLE public.saved_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved ideas"
  ON public.saved_ideas FOR ALL
  USING (auth.uid() = user_id);

-- 8. Project Progress Table
CREATE TABLE IF NOT EXISTS public.project_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  current_step INT DEFAULT 1,
  total_steps INT DEFAULT 5,
  completed_step_ids INT[],
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  result_photo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, idea_id)
);

ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their project progress"
  ON public.project_progress FOR ALL
  USING (auth.uid() = user_id);

-- 9. Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL,
  target_id TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (TRUE);

-- 10. Recycling Facilities Table (Public Readable, Curated)
CREATE TABLE IF NOT EXISTS public.recycling_facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accepted_materials TEXT[],
  contact TEXT,
  source_url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at DATE,
  facility_type TEXT NOT NULL,
  operating_hours TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recycling_facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read-only access to recycling facilities"
  ON public.recycling_facilities FOR SELECT
  USING (TRUE);
