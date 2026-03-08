import { useState } from "react";
import { Download, FileText, Table, FileDown } from "lucide-react";
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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Generate a simple PDF from tabular data (no external lib needed)
function generatePdf(data: Record<string, unknown>[], title: string): Blob {
  if (!data.length) return new Blob(["No data"], { type: "application/pdf" });

  const headers = Object.keys(data[0]);
  const colWidth = 120;
  const rowHeight = 18;
  const margin = 40;
  const pageWidth = margin * 2 + headers.length * colWidth;
  const headerRow = 1;
  const totalRows = data.length + headerRow + 2; // title + header + data
  const pageHeight = Math.max(400, margin * 2 + totalRows * rowHeight + 40);

  // Build PDF manually (PDF 1.4 minimal)
  const lines: string[] = [];
  let yPos = pageHeight - margin;

  // Stream drawing commands
  let stream = "";

  // Title
  stream += `BT /F1 14 Tf ${margin} ${yPos} Td (${escapePdf(title)}) Tj ET\n`;
  yPos -= 28;

  // Header row
  stream += `BT /F1 8 Tf\n`;
  headers.forEach((h, i) => {
    stream += `${margin + i * colWidth} ${yPos} Td (${escapePdf(h)}) Tj\n`;
    if (i === 0) stream += ""; else stream += "";
  });
  // Reset position for header
  stream = `BT /F1 14 Tf ${margin} ${pageHeight - margin} Td (${escapePdf(title)}) Tj ET\n`;
  yPos = pageHeight - margin - 28;

  // Header
  stream += `BT /F1 9 Tf\n`;
  for (let i = 0; i < headers.length; i++) {
    stream += `${margin + i * colWidth} ${yPos} Td (${escapePdf(headers[i])}) Tj\n`;
  }
  stream += `ET\n`;

  // Line under header
  yPos -= 4;
  stream += `${margin} ${yPos} m ${margin + headers.length * colWidth} ${yPos} l S\n`;
  yPos -= rowHeight;

  // Data rows
  for (const row of data) {
    stream += `BT /F1 7 Tf\n`;
    for (let i = 0; i < headers.length; i++) {
      const val = String(row[headers[i]] ?? "").slice(0, 30);
      stream += `${margin + i * colWidth} ${yPos} Td (${escapePdf(val)}) Tj\n`;
    }
    stream += `ET\n`;
    yPos -= rowHeight;
    if (yPos < margin) break; // simple page break prevention
  }

  // Build PDF structure
  const objects: string[] = [];
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`);
  objects.push(`4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj`);
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += objects[i] + "\n";
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function escapePdf(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const DataExportPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportTable = async (tableKey: TableKey, label: string, format: "csv" | "pdf") => {
    setExporting(`${tableKey}-${format}`);
    const { data, error } = await supabase.from(tableKey).select("*");
    if (error || !data) {
      setExporting(null);
      return;
    }
    if (format === "csv") {
      downloadFile(toCsv(data as Record<string, unknown>[]), `${tableKey}.csv`, "text/csv");
    } else {
      const blob = generatePdf(data as Record<string, unknown>[], label);
      downloadBlob(blob, `${tableKey}.pdf`);
    }
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
            <div
              key={t.key}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Table className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">{t.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => exportTable(t.key, t.label, "csv")}
                  disabled={exporting !== null}
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {exporting === `${t.key}-csv` ? "..." : "CSV"}
                </button>
                <button
                  onClick={() => exportTable(t.key, t.label, "pdf")}
                  disabled={exporting !== null}
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {exporting === `${t.key}-pdf` ? "..." : "PDF"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportAllCsv}
            disabled={exporting !== null}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {exporting === "all" ? (
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <FileText className="h-4 w-4" /> All CSV
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 text-center font-mono">Click outside to close</p>
      </div>
    </div>
  );
};

export default DataExportPanel;
