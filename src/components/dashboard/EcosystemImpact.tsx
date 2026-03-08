import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TreePine, Wind, Leaf, FileText } from "lucide-react";
import DrillDownPanel from "./DrillDownPanel";
import { useAnimatedNumber, useLiveData } from "@/hooks/use-animated-number";
import { useEcosystemIntegrations } from "@/hooks/use-dashboard-data";

const impactData = [
  { month: "Sep", hectares: 12400, carbon: 3200, projects: 18, reports: 42 },
  { month: "Oct", hectares: 15800, carbon: 4100, projects: 24, reports: 56 },
  { month: "Nov", hectares: 18200, carbon: 4800, projects: 31, reports: 68 },
  { month: "Dec", hectares: 21600, carbon: 5600, projects: 38, reports: 81 },
  { month: "Jan", hectares: 26400, carbon: 6900, projects: 47, reports: 94 },
  { month: "Feb", hectares: 31200, carbon: 8100, projects: 54, reports: 112 },
];

const fallbackRegionData = [
  { region: "Amazon Basin", hectares: 8400, carbon: 2100 },
  { region: "Congo Rainforest", hectares: 6200, carbon: 1800 },
  { region: "Southeast Asia", hectares: 5100, carbon: 1400 },
  { region: "European Rewilding", hectares: 4800, carbon: 1200 },
  { region: "North America", hectares: 6700, carbon: 1600 },
];

const EcosystemImpact = () => {
  const { data: dbIntegrations } = useEcosystemIntegrations();
  const liveHectares = useLiveData(31200, (prev) => prev + Math.round(Math.random() * 100), 6000);
  const animHectares = useAnimatedNumber(liveHectares, 1000);

  const regionData = dbIntegrations?.length
    ? dbIntegrations.map((i) => ({
        region: i.integration_name,
        hectares: Math.round(Number(i.connected_pct) * 100),
        carbon: Math.round(Number(i.connected_pct) * 25),
      }))
    : fallbackRegionData;

  const maxHectares = Math.max(...regionData.map(r => r.hectares));

  const impactMetrics = [
    { label: "Hectares Analyzed", value: `${(animHectares / 1000).toFixed(1)}K`, icon: TreePine, color: "hsl(160, 60%, 45%)" },
    { label: "Carbon Seq. (tCO₂)", value: "8,100", icon: Wind, color: "hsl(200, 70%, 50%)" },
    { label: "Projects Verified", value: "54", icon: Leaf, color: "hsl(170, 50%, 40%)" },
    { label: "Impact Reports", value: "112", icon: FileText, color: "hsl(35, 90%, 55%)" },
  ];

  return (
    <DrillDownPanel
      title="Ecosystem Impact Activity"
      drillContent={
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">Impact by Region</p>
          <div className="space-y-2">
            {regionData.map((r) => (
              <div key={r.region} className="flex items-center gap-3">
                <span className="text-xs text-secondary-foreground w-32 truncate">{r.region}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(r.hectares / maxHectares) * 100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-20 text-right">{(r.hectares / 1000).toFixed(1)}K ha</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-4 gap-3 mb-4">
        {impactMetrics.map((m) => (
          <div key={m.label} className="text-center">
            <m.icon className="h-5 w-5 mx-auto mb-1" style={{ color: m.color }} />
            <p className="text-lg font-bold font-mono text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={impactData}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', fontSize: 12 }} />
            <Line type="monotone" dataKey="hectares" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="carbon" stroke="hsl(200, 70%, 50%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DrillDownPanel>
  );
};

export default EcosystemImpact;
