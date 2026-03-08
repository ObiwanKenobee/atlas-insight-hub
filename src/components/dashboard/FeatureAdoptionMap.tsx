import { useState } from "react";
import { Shield, ArrowLeftRight, FlaskConical, Database, BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import DrillDownPanel from "./DrillDownPanel";
import { useFeatureAdoption } from "@/hooks/use-dashboard-data";

const iconMap: Record<string, typeof Shield> = {
  "Impact Verification Engine": Shield,
  "Multi-Source Data Fusion": Database,
  "Real-Time Anomaly Detection": BarChart3,
  "Automated Report Builder": BarChart3,
  "Predictive Risk Scoring": FlaskConical,
  "Collaborative Annotations": Users,
};

const fallbackFeatures = [
  { name: "Impact Verification Engine", icon: Shield, users: 1284, adoption: 82, growth: 12.4, drilldown: { dailyActive: [32,45,38,52,61,48,55], avgSession: "24 min", topAction: "Verify Asset", retention: 78 } },
  { name: "Regenerative Asset Exchange", icon: ArrowLeftRight, users: 946, adoption: 61, growth: 8.7, drilldown: { dailyActive: [22,28,31,35,29,33,38], avgSession: "18 min", topAction: "List Asset", retention: 64 } },
  { name: "Policy Simulation Engine", icon: FlaskConical, users: 734, adoption: 47, growth: 22.1, drilldown: { dailyActive: [12,18,22,28,35,31,42], avgSession: "32 min", topAction: "Run Simulation", retention: 71 } },
  { name: "Data Integration Tools", icon: Database, users: 1102, adoption: 71, growth: 5.3, drilldown: { dailyActive: [48,52,45,58,62,55,51], avgSession: "12 min", topAction: "Connect Source", retention: 85 } },
  { name: "Impact Reporting & Viz", icon: BarChart3, users: 856, adoption: 55, growth: 15.8, drilldown: { dailyActive: [25,32,28,38,42,35,40], avgSession: "21 min", topAction: "Generate Report", retention: 69 } },
];

const FeatureAdoptionMap = () => {
  const { data: dbFeatures } = useFeatureAdoption();
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = dbFeatures?.length
    ? dbFeatures.map((f) => ({
        name: f.feature_name,
        icon: iconMap[f.feature_name] || Shield,
        users: Math.round(Number(f.adoption_pct) * 15),
        adoption: Number(f.adoption_pct),
        growth: f.trend === "up" ? 12.4 : f.trend === "down" ? -3.2 : 0,
        drilldown: { dailyActive: [32,45,38,52,61,48,55], avgSession: "20 min", topAction: "Use Feature", retention: 70 },
      }))
    : fallbackFeatures;

  const selected = selectedFeature !== null ? features[selectedFeature] : null;

  return (
    <DrillDownPanel
      title="Feature Adoption Map"
      drillContent={
        selected ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <selected.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{selected.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-md bg-card p-3 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Avg Session</p>
                </div>
                <p className="text-lg font-bold font-mono text-foreground">{selected.drilldown.avgSession}</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Top Action</p>
                </div>
                <p className="text-sm font-bold font-mono text-primary">{selected.drilldown.topAction}</p>
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">7d Retention</p>
                </div>
                <p className="text-lg font-bold font-mono text-foreground">{selected.drilldown.retention}%</p>
              </div>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mb-2">DAILY ACTIVE USERS (LAST 7 DAYS)</p>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selected.drilldown.dailyActive.map((v, i) => ({ day: ["M","T","W","T","F","S","S"][i], val: v }))}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="val" fill="hsl(160, 60%, 45%)" radius={[3, 3, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Click a feature tile above to see detailed analytics.</p>
        )
      }
    >
      <div className="grid grid-cols-1 gap-3">
        {features.map((f, idx) => {
          const intensity = f.adoption / 100;
          const isSelected = selectedFeature === idx;
          return (
            <div
              key={f.name}
              onClick={() => setSelectedFeature(isSelected ? null : idx)}
              className={`rounded-md border p-4 transition-all cursor-pointer ${
                isSelected ? "border-primary/60 ring-1 ring-primary/30" : "border-border hover:border-primary/40"
              }`}
              style={{
                background: `linear-gradient(135deg, hsl(160, 60%, 45%, ${intensity * 0.12}), hsl(170, 50%, 40%, ${intensity * 0.06}))`,
                boxShadow: intensity > 0.6 ? `0 0 ${intensity * 20}px -8px hsl(160, 60%, 45%, ${intensity * 0.25})` : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <f.icon className="h-4 w-4 text-primary" style={{ opacity: 0.5 + intensity * 0.5 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">{f.users.toLocaleString()} users</span>
                    <span className="text-xs font-mono text-muted-foreground">{f.adoption}% adopted</span>
                    <span className="text-xs font-mono text-primary">{f.growth > 0 ? "+" : ""}{f.growth}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DrillDownPanel>
  );
};

export default FeatureAdoptionMap;
