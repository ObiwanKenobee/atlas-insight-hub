import { useState, useCallback } from "react";
import { Brain, RefreshCw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-insights`;

const AIInsightsFeed = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setInsights("");
    setHasLoaded(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setInsights(accumulated);
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      console.error(e);
      setInsights("Failed to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <Brain className="h-4 w-4 text-chart-5" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Insights</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            disabled={loading}
            className="h-7 px-2 text-[10px] font-mono gap-1"
          >
            {loading ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {loading ? "Analyzing..." : "Generate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!hasLoaded ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-xs text-muted-foreground font-mono">
              Click Generate to get AI-powered insights from your dashboard data
            </p>
          </div>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed text-foreground [&_strong]:text-primary [&_h2]:text-sm [&_h2]:font-mono [&_h2]:text-primary [&_h3]:text-xs [&_h3]:font-mono [&_h3]:text-primary [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:space-y-1">
            {insights ? (
              <ReactMarkdown>{insights}</ReactMarkdown>
            ) : loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span className="text-[10px] font-mono">Analyzing dashboard telemetry...</span>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsFeed;
