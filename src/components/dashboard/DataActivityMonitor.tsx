import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Database, Wifi, ShieldCheck, FlaskConical } from "lucide-react";

const dailyData = [
  { day: "Mon", uploads: 142 },
  { day: "Tue", uploads: 178 },
  { day: "Wed", uploads: 195 },
  { day: "Thu", uploads: 163 },
  { day: "Fri", uploads: 211 },
  { day: "Sat", uploads: 89 },
  { day: "Sun", uploads: 67 },
];

const metrics = [
  { label: "Datasets Uploaded Today", value: "211", icon: Database, trend: "+14%" },
  { label: "Active Integrations", value: "38", icon: Wifi, trend: "+2" },
  { label: "Verification Jobs Running", value: "12", icon: ShieldCheck, trend: "3 queued" },
  { label: "Simulations Executed", value: "47", icon: FlaskConical, trend: "+8 today" },
];

const DataActivityMonitor = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Data Activity Monitor</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <m.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground truncate">{m.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-foreground">{m.value}</span>
              <span className="text-xs font-mono text-primary">{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', fontSize: 12 }}
            />
            <Bar dataKey="uploads" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataActivityMonitor;
