import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DrillDownPanelProps {
  title: string;
  children: ReactNode;
  drillContent: ReactNode;
}

const DrillDownPanel = ({ title, children, drillContent }: DrillDownPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-secondary"
          >
            {expanded ? "Collapse" : "Drill Down"}
            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        {children}
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: expanded ? "600px" : "0px", opacity: expanded ? 1 : 0 }}
      >
        <div className="border-t border-border p-6 bg-secondary/20">
          {drillContent}
        </div>
      </div>
    </div>
  );
};

export default DrillDownPanel;
