import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const tables = [
  { key: "activation_steps", label: "Activation Steps" },
  { key: "activation_rate", label: "Activation Rate" },
  { key: "engagement_scores", label: "Engagement Scores" },
  { key: "feature_adoption", label: "Feature Adoption" },
  { key: "workflow_steps", label: "Workflow Steps" },
  { key: "cohort_retention", label: "Cohort Retention" },
  { key: "ecosystem_integrations", label: "Ecosystem Integrations" },
  { key: "feedback_items", label: "Feedback Items" },
] as const;

type TableKey = typeof tables[number]["key"];

function toCsv(data: Record<string, unknown>[]): string {
  if (!data.length) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DataExportPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportCsv = async (tableKey: TableKey, label: string) => {
    setExporting(tableKey);
    const { data, error } = await supabase.from(tableKey).select("*");
    if (error || !data) {
      setExporting(null);
      return;
    }
    downloadFile(toCsv(data as Record<string, unknown>[]), `${tableKey}.csv`, "text/csv");
    setExporting(null);
  };

  const exportAllCsv = async () => {
    setExporting("all");
    for (const t of tables) {
      const { data } = await supabase.from(t.key).select("*");
      if (data?.length) {
        downloadFile(toCsv(data as Record<string, unknown>[]), `${t.key}.csv`, "text/csv");
      }
    }
    setExporting(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-mono">EXPORT DATA</h2>
        </div>

        <div className="space-y-2 mb-4">
          {tables.map((t) => (
            <button
              key={t.key}
              onClick={() => exportCsv(t.key, t.label)}
              disabled={exporting !== null}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Table className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">{t.label}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {exporting === t.key ? "Exporting..." : "CSV"}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={exportAllCsv}
          disabled={exporting !== null}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {exporting === "all" ? (
            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <FileText className="h-4 w-4" /> Export All (CSV)
            </>
          )}
        </button>

        <p className="text-[10px] text-muted-foreground mt-3 text-center font-mono">Click outside to close</p>
      </div>
    </div>
  );
};

export default DataExportPanel;
