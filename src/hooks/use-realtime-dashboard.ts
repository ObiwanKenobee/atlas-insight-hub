import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const REALTIME_TABLES = [
  "activation_steps",
  "activation_rate",
  "engagement_scores",
  "feature_adoption",
  "workflow_steps",
  "cohort_retention",
  "ecosystem_integrations",
  "feedback_items",
] as const;

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activation_steps" },
        () => queryClient.invalidateQueries({ queryKey: ["activation_steps"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activation_rate" },
        () => queryClient.invalidateQueries({ queryKey: ["activation_rate"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "engagement_scores" },
        () => queryClient.invalidateQueries({ queryKey: ["engagement_scores"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feature_adoption" },
        () => queryClient.invalidateQueries({ queryKey: ["feature_adoption"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workflow_steps" },
        () => queryClient.invalidateQueries({ queryKey: ["workflow_steps"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cohort_retention" },
        () => queryClient.invalidateQueries({ queryKey: ["cohort_retention"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ecosystem_integrations" },
        () => queryClient.invalidateQueries({ queryKey: ["ecosystem_integrations"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback_items" },
        () => queryClient.invalidateQueries({ queryKey: ["feedback_items"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alert_history" },
        () => queryClient.invalidateQueries({ queryKey: ["alert_history"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        () => queryClient.invalidateQueries({ queryKey: ["alerts"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "annotations" },
        () => queryClient.invalidateQueries({ queryKey: ["annotations"] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
