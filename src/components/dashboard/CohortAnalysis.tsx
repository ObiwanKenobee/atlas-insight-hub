import { useState } from "react";

const cohorts = [
  { month: "Sep 2025", data: [100, 82, 71, 64, 58, 52], users: 340 },
  { month: "Oct 2025", data: [100, 85, 74, 68, 61], users: 412 },
  { month: "Nov 2025", data: [100, 88, 78, 72], users: 389 },
  { month: "Dec 2025", data: [100, 86, 76], users: 456 },
  { month: "Jan 2026", data: [100, 89], users: 521 },
  { month: "Feb 2026", data: [100], users: 487 },
];

const getColor = (value: number) => {
  const intensity = value / 100;
  return `hsl(160, 60%, 45%, ${intensity * 0.7 + 0.05})`;
};

import DrillDownPanel from "./DrillDownPanel";

const CohortAnalysis = () => {
  const maxCols = Math.max(...cohorts.map(c => c.data.length));
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const cohort = selectedCohort !== null ? cohorts[selectedCohort] : null;

  return (
    <DrillDownPanel
      title="Usage Cohort Retention"
      drillContent={
        cohort ? (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">{cohort.month} Cohort — {cohort.users} users</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Initial Users</p>
                <p className="text-lg font-bold font-mono text-foreground">{cohort.users}</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Latest Retention</p>
                <p className="text-lg font-bold font-mono text-primary">{cohort.data[cohort.data.length - 1]}%</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <p className="text-[10px] text-muted-foreground">Avg Drop/Month</p>
                <p className="text-lg font-bold font-mono text-glow-warning">
                  {cohort.data.length > 1 ? Math.round((100 - cohort.data[cohort.data.length - 1]) / (cohort.data.length - 1)) : 0}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Click a cohort row to see retention details.</p>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr>
              <th className="text-left text-muted-foreground pb-2 pr-4">Cohort</th>
              {Array.from({ length: maxCols }).map((_, i) => (
                <th key={i} className="text-center text-muted-foreground pb-2 px-1 min-w-[40px]">M{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c, idx) => (
              <tr
                key={c.month}
                className={`cursor-pointer transition-colors ${selectedCohort === idx ? "bg-secondary/40" : "hover:bg-secondary/20"}`}
                onClick={() => setSelectedCohort(selectedCohort === idx ? null : idx)}
              >
                <td className="text-secondary-foreground py-1 pr-4 whitespace-nowrap">{c.month}</td>
                {c.data.map((val, i) => (
                  <td key={i} className="text-center py-1 px-1">
                    <div className="rounded px-1 py-0.5 text-foreground transition-all" style={{ backgroundColor: getColor(val) }}>{val}%</div>
                  </td>
                ))}
                {Array.from({ length: maxCols - c.data.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="py-1 px-1" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DrillDownPanel>
  );
};

export default CohortAnalysis;
