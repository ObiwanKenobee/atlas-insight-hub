import { MessageSquare, Lightbulb, HeadphonesIcon, Plug } from "lucide-react";

const feedbackItems = [
  {
    type: "feedback" as const,
    icon: MessageSquare,
    title: "Verification workflow needs batch mode",
    source: "User Survey",
    time: "2h ago",
    sentiment: "neutral" as const,
  },
  {
    type: "request" as const,
    icon: Lightbulb,
    title: "API endpoint for automated reporting",
    source: "Enterprise Client",
    time: "5h ago",
    sentiment: "positive" as const,
  },
  {
    type: "support" as const,
    icon: HeadphonesIcon,
    title: "Data import failing for GeoTIFF format",
    source: "Support Ticket #4821",
    time: "8h ago",
    sentiment: "negative" as const,
  },
  {
    type: "integration" as const,
    icon: Plug,
    title: "Sentinel-2 connector timeout on large regions",
    source: "Integration Monitor",
    time: "12h ago",
    sentiment: "negative" as const,
  },
  {
    type: "feedback" as const,
    icon: MessageSquare,
    title: "Policy simulation results are incredibly useful",
    source: "NPS Response",
    time: "1d ago",
    sentiment: "positive" as const,
  },
];

const sentimentColors = {
  positive: "bg-primary/20 text-primary",
  neutral: "bg-glow-info/20 text-glow-info",
  negative: "bg-destructive/20 text-destructive",
};

const FeedbackLoop = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Product Feedback Loop</p>

      <div className="space-y-3">
        {feedbackItems.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className={`p-1.5 rounded-md ${sentimentColors[item.sentiment]}`}>
              <item.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{item.source}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackLoop;
