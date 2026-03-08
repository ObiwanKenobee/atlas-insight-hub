import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useActivationSteps() {
  return useQuery({
    queryKey: ["activation_steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activation_steps")
        .select("*")
        .order("step_number");
      if (error) throw error;
      return data;
    },
  });
}

export function useActivationRate() {
  return useQuery({
    queryKey: ["activation_rate"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activation_rate")
        .select("*")
        .order("recorded_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useEngagementScores() {
  return useQuery({
    queryKey: ["engagement_scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagement_scores")
        .select("*")
        .order("metric_name");
      if (error) throw error;
      return data;
    },
  });
}

export function useFeatureAdoption() {
  return useQuery({
    queryKey: ["feature_adoption"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_adoption")
        .select("*")
        .order("adoption_pct", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkflowSteps() {
  return useQuery({
    queryKey: ["workflow_steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_steps")
        .select("*")
        .order("completion_pct", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCohortRetention() {
  return useQuery({
    queryKey: ["cohort_retention"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohort_retention")
        .select("*")
        .order("cohort_label");
      if (error) throw error;
      return data;
    },
  });
}

export function useEcosystemIntegrations() {
  return useQuery({
    queryKey: ["ecosystem_integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ecosystem_integrations")
        .select("*")
        .order("connected_pct", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useFeedbackItems() {
  return useQuery({
    queryKey: ["feedback_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
