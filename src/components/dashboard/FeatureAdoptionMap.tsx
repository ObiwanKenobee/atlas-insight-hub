import { Shield, ArrowLeftRight, FlaskConical, Database, BarChart3 } from "lucide-react";

const features = [
  { name: "Impact Verification Engine", icon: Shield, users: 1284, adoption: 82, growth: 12.4 },
  { name: "Regenerative Asset Exchange", icon: ArrowLeftRight, users: 946, adoption: 61, growth: 8.7 },
  { name: "Policy Simulation Engine", icon: FlaskConical, users: 734, adoption: 47, growth: 22.1 },
  { name: "Data Integration Tools", icon: Database, users: 1102, adoption: 71, growth: 5.3 },
  { name: "Impact Reporting & Viz", icon: BarChart3, users: 856, adoption: 55, growth: 15.8 },
];

const FeatureAdoptionMap = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Feature Adoption Map</p>
      <div className="grid grid-cols-1 gap-3">
        {features.map((f) => {
          const intensity = f.adoption / 100;
          return (
            <div
              key={f.name}
              className="rounded-md border border-border p-4 transition-all hover:border-primary/40"
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
                    <span className="text-xs font-mono text-primary">+{f.growth}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureAdoptionMap;
