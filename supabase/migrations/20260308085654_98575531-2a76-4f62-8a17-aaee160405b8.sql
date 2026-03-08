
-- Activation funnel steps
CREATE TABLE public.activation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number INT NOT NULL,
  label TEXT NOT NULL,
  total_users INT NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activation rate over time
CREATE TABLE public.activation_rate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_label TEXT NOT NULL,
  rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Engagement scores
CREATE TABLE public.engagement_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  overall_score INT NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feature adoption
CREATE TABLE public.feature_adoption (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT NOT NULL,
  adoption_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')) DEFAULT 'stable',
  category TEXT NOT NULL DEFAULT 'core',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow steps
CREATE TABLE public.workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_name TEXT NOT NULL,
  completion_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_time TEXT,
  status TEXT CHECK (status IN ('completed', 'in_progress', 'pending')) DEFAULT 'pending',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data activity events
CREATE TABLE public.data_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  hour INT NOT NULL CHECK (hour >= 0 AND hour <= 23),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cohort retention
CREATE TABLE public.cohort_retention (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_label TEXT NOT NULL,
  week_1 NUMERIC(5,2),
  week_2 NUMERIC(5,2),
  week_4 NUMERIC(5,2),
  week_8 NUMERIC(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ecosystem integrations
CREATE TABLE public.ecosystem_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_name TEXT NOT NULL,
  connected_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'inactive', 'beta')) DEFAULT 'active',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback items
CREATE TABLE public.feedback_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')) DEFAULT 'neutral',
  message TEXT NOT NULL,
  score NUMERIC(3,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.activation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_adoption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_retention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_items ENABLE ROW LEVEL SECURITY;

-- Public read policies (dashboard data is not user-specific)
CREATE POLICY "Public read activation_steps" ON public.activation_steps FOR SELECT USING (true);
CREATE POLICY "Public read activation_rate" ON public.activation_rate FOR SELECT USING (true);
CREATE POLICY "Public read engagement_scores" ON public.engagement_scores FOR SELECT USING (true);
CREATE POLICY "Public read feature_adoption" ON public.feature_adoption FOR SELECT USING (true);
CREATE POLICY "Public read workflow_steps" ON public.workflow_steps FOR SELECT USING (true);
CREATE POLICY "Public read data_activity" ON public.data_activity FOR SELECT USING (true);
CREATE POLICY "Public read cohort_retention" ON public.cohort_retention FOR SELECT USING (true);
CREATE POLICY "Public read ecosystem_integrations" ON public.ecosystem_integrations FOR SELECT USING (true);
CREATE POLICY "Public read feedback_items" ON public.feedback_items FOR SELECT USING (true);
