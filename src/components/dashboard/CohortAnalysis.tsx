const cohorts = [
  { month: "Sep 2025", data: [100, 82, 71, 64, 58, 52] },
  { month: "Oct 2025", data: [100, 85, 74, 68, 61] },
  { month: "Nov 2025", data: [100, 88, 78, 72] },
  { month: "Dec 2025", data: [100, 86, 76] },
  { month: "Jan 2026", data: [100, 89] },
  { month: "Feb 2026", data: [100] },
];

const getColor = (value: number) => {
  const intensity = value / 100;
  return `hsl(160, 60%, 45%, ${intensity * 0.7 + 0.05})`;
};

const CohortAnalysis = () => {
  const maxCols = Math.max(...cohorts.map(c => c.data.length));

  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Usage Cohort Retention</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr>
              <th className="text-left text-muted-foreground pb-2 pr-4">Cohort</th>
              {Array.from({ length: maxCols }).map((_, i) => (
                <th key={i} className="text-center text-muted-foreground pb-2 px-1 min-w-[40px]">
                  M{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.month}>
                <td className="text-secondary-foreground py-1 pr-4 whitespace-nowrap">{cohort.month}</td>
                {cohort.data.map((val, i) => (
                  <td key={i} className="text-center py-1 px-1">
                    <div
                      className="rounded px-1 py-0.5 text-foreground"
                      style={{ backgroundColor: getColor(val) }}
                    >
                      {val}%
                    </div>
                  </td>
                ))}
                {Array.from({ length: maxCols - cohort.data.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="py-1 px-1" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CohortAnalysis;
