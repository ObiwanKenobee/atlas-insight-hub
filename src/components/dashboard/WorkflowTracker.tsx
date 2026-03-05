import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const workflows = [
  {
    stage: "Project Created",
    completion: 96,
    avgTime: "2 min",
    status: "healthy" as const,
  },
  {
    stage: "Data Sources Connected",
    completion: 81,
    avgTime: "14 min",
    status: "healthy" as const,
  },
  {
    stage: "Metrics Calculated",
    completion: 68,
    avgTime: "42 min",
    status: "warning" as const,
  },
  {
    stage: "Verification Executed",
    completion: 54,
    avgTime: "1.2 hr",
    status: "warning" as const,
  },
  {
    stage: "Impact Report Generated",
    completion: 41,
    avgTime: "2.1 hr",
    status: "critical" as const,
  },
];

const statusIcons = {
  healthy: <CheckCircle2 className="h-3.5 w-3.5 text-primary" />,
  warning: <Clock className="h-3.5 w-3.5 text-glow-warning" />,
  critical: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
};

const WorkflowTracker = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Workflow Completion Tracker</p>
      
      <div className="space-y-3">
        {workflows.map((w, i) => (
          <div key={w.stage}>
            {i > 0 && (
              <div className="flex items-center gap-3 mb-2 ml-2.5">
                <div className="w-px h-3 bg-border" />
              </div>
            )}
            <div className="flex items-center gap-3">
              {statusIcons[w.status]}
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary-foreground">{w.stage}</span>
                  <span className="font-mono text-muted-foreground">{w.completion}% · avg {w.avgTime}</span>
                </div>
                <div className="h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${w.completion}%`,
                      backgroundColor:
                        w.status === "healthy" ? "hsl(160, 60%, 45%)" :
                        w.status === "warning" ? "hsl(35, 90%, 55%)" :
                        "hsl(0, 70%, 50%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTracker;
