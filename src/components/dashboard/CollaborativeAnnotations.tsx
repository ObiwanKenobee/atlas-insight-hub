import { useState } from "react";
import { MessageSquarePlus, Trash2, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const METRIC_KEYS = [
  { value: "activation", label: "Activation" },
  { value: "engagement", label: "Engagement" },
  { value: "features", label: "Feature Adoption" },
  { value: "workflow", label: "Workflow" },
  { value: "ecosystem", label: "Ecosystem Impact" },
  { value: "cohorts", label: "Cohort Retention" },
  { value: "feedback", label: "Feedback" },
  { value: "general", label: "General" },
];

const CollaborativeAnnotations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [metricKey, setMetricKey] = useState("general");
  const [content, setContent] = useState("");
  const [filterKey, setFilterKey] = useState("all");

  const { data: annotations } = useQuery({
    queryKey: ["annotations", filterKey],
    queryFn: async () => {
      let q = supabase
        .from("annotations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (filterKey !== "all") q = q.eq("metric_key", filterKey);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addAnnotation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("annotations").insert({
        user_id: user!.id,
        metric_key: metricKey,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
      setContent("");
    },
  });

  const deleteAnnotation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("annotations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["annotations"] }),
  });

  const tagColor = (key: string) => {
    const colors: Record<string, string> = {
      activation: "text-primary bg-primary/10",
      engagement: "text-chart-2 bg-chart-2/10",
      features: "text-chart-3 bg-chart-3/10",
      workflow: "text-chart-4 bg-chart-4/10",
      ecosystem: "text-chart-5 bg-chart-5/10",
      cohorts: "text-chart-1 bg-chart-1/10",
      feedback: "text-destructive bg-destructive/10",
      general: "text-muted-foreground bg-secondary",
    };
    return colors[key] || colors.general;
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4 text-chart-2" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Team Annotations</span>
          </CardTitle>
          <Select value={filterKey} onValueChange={setFilterKey}>
            <SelectTrigger className="w-28 h-7 text-[10px] font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {METRIC_KEYS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add annotation */}
        <div className="flex gap-2">
          <Select value={metricKey} onValueChange={setMetricKey}>
            <SelectTrigger className="w-28 h-8 text-[10px] font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRIC_KEYS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 flex gap-1">
            <Input
              placeholder="Add a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && content.trim() && addAnnotation.mutate()}
              className="h-8 text-xs font-mono"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={!content.trim()}
              onClick={() => addAnnotation.mutate()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Annotations list */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {annotations && annotations.length > 0 ? (
            annotations.map((a) => (
              <div key={a.id} className="flex items-start gap-2 px-2 py-1.5 rounded bg-secondary/30 group">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${tagColor(a.metric_key)}`}>
                  {a.metric_key}
                </span>
                <p className="flex-1 text-[11px] text-muted-foreground leading-relaxed">{a.content}</p>
                {a.user_id === user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteAnnotation.mutate(a.id)}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-[10px] text-muted-foreground font-mono text-center py-4">No annotations yet. Start the conversation!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborativeAnnotations;
