import { useState } from "react";
import { MessageSquare, Lightbulb, HeadphonesIcon, Plug, ExternalLink } from "lucide-react";
import DrillDownPanel from "./DrillDownPanel";

const feedbackItems = [
  { type: "feedback" as const, icon: MessageSquare, title: "Verification workflow needs batch mode", source: "User Survey", time: "2h ago", sentiment: "neutral" as const, detail: "12 users have requested batch verification for large datasets. Currently, each asset must be verified individually which is time-consuming for enterprise clients." },
  { type: "request" as const, icon: Lightbulb, title: "API endpoint for automated reporting", source: "Enterprise Client", time: "5h ago", sentiment: "positive" as const, detail: "Acme Corp needs REST API access to generate impact reports programmatically for their quarterly ESG filings." },
  { type: "support" as const, icon: HeadphonesIcon, title: "Data import failing for GeoTIFF format", source: "Support Ticket #4821", time: "8h ago", sentiment: "negative" as const, detail: "GeoTIFF files above 2GB timeout during upload. Affects 8% of enterprise users with satellite imagery datasets." },
  { type: "integration" as const, icon: Plug, title: "Sentinel-2 connector timeout on large regions", source: "Integration Monitor", time: "12h ago", sentiment: "negative" as const, detail: "Region queries exceeding 50,000 km² cause timeouts. Needs pagination or chunked download implementation." },
  { type: "feedback" as const, icon: MessageSquare, title: "Policy simulation results are incredibly useful", source: "NPS Response", time: "1d ago", sentiment: "positive" as const, detail: "Score: 9/10. 'The simulation engine has become our primary tool for policy impact assessment. Team uses it weekly.'" },
];

const sentimentColors = {
  positive: "bg-primary/20 text-primary",
  neutral: "bg-glow-info/20 text-glow-info",
  negative: "bg-destructive/20 text-destructive",
};

const FeedbackLoop = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const item = selectedItem !== null ? feedbackItems[selectedItem] : null;

  return (
    <DrillDownPanel
      title="Product Feedback Loop"
      drillContent={
        item ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1 rounded ${sentimentColors[item.sentiment]}`}>
                <item.icon className="h-3 w-3" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.title}</span>
            </div>
            <p className="text-xs text-secondary-foreground leading-relaxed mb-3">{item.detail}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Click a feedback item to see full details.</p>
        )
      }
    >
      <div className="space-y-3">
        {feedbackItems.map((fi, i) => (
          <div
            key={i}
            onClick={() => setSelectedItem(selectedItem === i ? null : i)}
            className={`flex items-start gap-3 p-3 rounded-md transition-colors cursor-pointer ${
              selectedItem === i ? "bg-secondary/60 ring-1 ring-primary/20" : "bg-secondary/30 hover:bg-secondary/50"
            }`}
          >
            <div className={`p-1.5 rounded-md ${sentimentColors[fi.sentiment]}`}>
              <fi.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{fi.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{fi.source}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{fi.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DrillDownPanel>
  );
};

export default FeedbackLoop;
