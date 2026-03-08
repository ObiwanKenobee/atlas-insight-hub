import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch latest data from all tables
    const [activation, engagement, features, workflows, cohorts, ecosystem, feedback] = await Promise.all([
      supabase.from("activation_steps").select("*").order("step_number"),
      supabase.from("engagement_scores").select("*"),
      supabase.from("feature_adoption").select("*").order("adoption_pct", { ascending: false }),
      supabase.from("workflow_steps").select("*"),
      supabase.from("cohort_retention").select("*"),
      supabase.from("ecosystem_integrations").select("*"),
      supabase.from("feedback_items").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    const dashboardSnapshot = {
      activation_steps: activation.data,
      engagement_scores: engagement.data,
      feature_adoption: features.data,
      workflow_steps: workflows.data,
      cohort_retention: cohorts.data,
      ecosystem_integrations: ecosystem.data,
      recent_feedback: feedback.data,
    };

    const systemPrompt = `You are Atlas Insight, an AI analytics advisor for an environmental impact & ecosystem monitoring platform. 
Analyze the dashboard data and provide 3-5 concise, actionable insights. Each insight should:
- Have a short bold title
- Be 1-2 sentences of analysis
- Include a specific recommendation
- Use relevant emoji

Focus on: anomalies, trends, opportunities, risks, and cross-metric correlations.
Format as markdown. Be data-driven and specific. Reference actual numbers from the data.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the current dashboard data:\n${JSON.stringify(dashboardSnapshot, null, 2)}\n\nProvide actionable insights based on this data.` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
