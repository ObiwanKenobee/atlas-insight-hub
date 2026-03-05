import { CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";
import DrillDownPanel from "./DrillDownPanel";

const workflows = [
  { stage: "Project Created", completion: 96, avgTime: "2 min", status: "healthy" as const, abandonRate: 4, bottleneck: "None", suggestions: "Optimal" },
  { stage: "Data Sources Connected", completion: 81, avgTime: "14 min", status: "healthy" as const, abandonRate: 15, bottleneck: "API key setup", suggestions: "Add OAuth flow" },
  { stage: "Metrics Calculated", completion: 68, avgTime: "42 min", status: "warning" as const, abandonRate: 13, bottleneck: "Processing time", suggestions: "Add progress indicator" },
  { stage: "Verification Executed", completion: 54, avgTime: "1.2 hr", status: "warning" as const, abandonRate: 14, bottleneck: "Manual review", suggestions: "Auto-verify threshold" },
  { stage: "Impact Report Generated", completion: 41, avgTime: "2.1 hr", status: "critical" as const, abandonRate: 13, bottleneck: "Template selection", suggestions: "Default template" },
];

const statusIcons = {
  healthy: <CheckCircle2 className="h-3.5 w-3.5 text-primary" />,
  warning: <Clock className="h-3.5 w-3.5 text-glow-warning" />,
  critical: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
};

const WorkflowTracker = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const step = selectedStep !== null ? workflows[selectedStep] : null;

  return (
    <DrillDownPanel
      title="Workflow Completion Tracker"
      drillContent={
        step ? (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">{step.stage} — Details</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Abandon Rate</p>
                <p className="text-lg font-bold font-mono text-glow-warning">{step.abandonRate}%</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Bottleneck</p>
                <p className="text-xs font-bold font-mono text-foreground">{step.bottleneck}</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Suggestion</p>
                <p className="text-xs font-bold font-mono text-primary">{step.suggestions}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Click a workflow step above to see diagnostics.</p>
        )
      }
    >
      <div className="space-y-3">
        {workflows.map((w, i) => (
          <div key={w.stage}>
            {i > 0 && <div className="flex items-center gap-3 mb-2 ml-2.5"><div className="w-px h-3 bg-border" /></div>}
            <div
              className={`flex items-center gap-3 cursor-pointer rounded-md p-1 -m-1 transition-colors ${selectedStep === i ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
              onClick={() => setSelectedStep(selectedStep === i ? null : i)}
            >
              {statusIcons[w.status]}
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary-foreground">{w.stage}</span>
                  <span className="font-mono text-muted-foreground">{w.completion}% · avg {w.avgTime}</span>
                </div>
                <div className="h-1 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${w.completion}%`,
                    backgroundColor: w.status === "healthy" ? "hsl(160, 60%, 45%)" : w.status === "warning" ? "hsl(35, 90%, 55%)" : "hsl(0, 70%, 50%)",
                  }} />
                </div>
              </div>
              <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${selectedStep === i ? "rotate-90" : ""}`} />
            </div>
          </div>
        ))}
      </div>
    </DrillDownPanel>
  );
};

export default WorkflowTracker;
