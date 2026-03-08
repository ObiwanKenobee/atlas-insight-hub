import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map metric names to tables/columns for lookup
const METRIC_QUERIES: Record<string, { table: string; column: string; agg: "avg" | "latest" }> = {
  "Engagement Score": { table: "engagement_scores", column: "overall_score", agg: "latest" },
  "Activation Rate": { table: "activation_rate", column: "rate", agg: "latest" },
  "Feature Adoption": { table: "feature_adoption", column: "adoption_pct", agg: "avg" },
  "Carbon Sequestration": { table: "ecosystem_integrations", column: "connected_pct", agg: "avg" },
  "Hectares Analyzed": { table: "ecosystem_integrations", column: "connected_pct", agg: "latest" },
  "Workflow Completion": { table: "workflow_steps", column: "completion_pct", agg: "avg" },
  "Feedback Score": { table: "feedback_items", column: "score", agg: "avg" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active alerts
    const { data: alerts, error: alertsErr } = await supabase
      .from("alerts")
      .select("*")
      .eq("is_active", true);

    if (alertsErr) throw alertsErr;
    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ checked: 0, triggered: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let triggered = 0;

    for (const alert of alerts) {
      const config = METRIC_QUERIES[alert.metric_name];
      if (!config) continue;

      let currentValue: number | null = null;

      if (config.agg === "latest") {
        const { data } = await supabase
          .from(config.table)
          .select(config.column)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .single();
        currentValue = data?.[config.column] ?? null;
      } else {
        const { data } = await supabase.from(config.table).select(config.column);
        if (data && data.length > 0) {
          const values = data.map((r: Record<string, number>) => r[config.column]).filter((v: number | null) => v !== null);
          currentValue = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : null;
        }
      }

      if (currentValue === null) continue;

      const shouldTrigger =
        (alert.condition === "above" && currentValue > alert.threshold_value) ||
        (alert.condition === "below" && currentValue < alert.threshold_value);

      if (shouldTrigger) {
        // Insert notification
        await supabase.from("alert_history").insert({
          alert_id: alert.id,
          user_id: alert.user_id,
          metric_name: alert.metric_name,
          metric_value: currentValue,
          threshold_value: alert.threshold_value,
          message: `${alert.metric_name} is ${currentValue.toFixed(1)} (${alert.condition} threshold ${alert.threshold_value})`,
        });

        // Update last triggered
        await supabase.from("alerts").update({ last_triggered_at: new Date().toISOString() }).eq("id", alert.id);

        triggered++;
      }
    }

    return new Response(JSON.stringify({ checked: alerts.length, triggered }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-alerts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
