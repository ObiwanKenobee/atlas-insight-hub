import { useState } from "react";
import { Bell, Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const METRIC_OPTIONS = [
  "Engagement Score", "Activation Rate", "Feature Adoption", "Carbon Sequestration",
  "Hectares Analyzed", "Workflow Completion", "Feedback Score",
];

const AlertsNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMetric, setNewMetric] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [newCondition, setNewCondition] = useState("above");

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: notifications } = useQuery({
    queryKey: ["alert_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createAlert = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("alerts").insert({
        user_id: user!.id,
        metric_name: newMetric,
        threshold_value: parseFloat(newThreshold),
        condition: newCondition,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setDialogOpen(false);
      setNewMetric("");
      setNewThreshold("");
      toast({ title: "Alert created" });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alert_history").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alert_history"] }),
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <Bell className="h-4 w-4 text-chart-4" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Alerts & Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded-full bg-destructive text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-mono gap-1">
                <Plus className="h-3 w-3" /> New Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-mono text-sm">Create Alert Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Select value={newMetric} onValueChange={setNewMetric}>
                  <SelectTrigger><SelectValue placeholder="Select metric" /></SelectTrigger>
                  <SelectContent>
                    {METRIC_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Select value={newCondition} onValueChange={setNewCondition}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Threshold value"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => createAlert.mutate()}
                  disabled={!newMetric || !newThreshold}
                  className="w-full text-xs font-mono"
                >
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active alerts */}
        {alerts && alerts.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Active Rules</p>
            <div className="space-y-1.5">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-secondary/50 text-xs">
                  <span className="font-mono text-foreground">
                    {a.metric_name} <span className="text-muted-foreground">{a.condition}</span>{" "}
                    <span className="text-primary">{a.threshold_value}</span>
                  </span>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => deleteAlert.mutate(a.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent notifications */}
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Recent Notifications</p>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 px-2 py-1.5 rounded text-[11px] ${
                    n.read ? "bg-secondary/30" : "bg-chart-4/10 border border-chart-4/20"
                  }`}
                >
                  <AlertTriangle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${n.read ? "text-muted-foreground" : "text-chart-4"}`} />
                  <span className="flex-1 text-muted-foreground">{n.message}</span>
                  {!n.read && (
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => markRead.mutate(n.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground font-mono text-center py-3">No notifications yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsNotifications;
