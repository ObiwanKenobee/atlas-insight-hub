import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Database, Wifi, ShieldCheck, FlaskConical } from "lucide-react";
import DrillDownPanel from "./DrillDownPanel";
import { useAnimatedNumber, useLiveData } from "@/hooks/use-animated-number";

const dailyData = [
  { day: "Mon", uploads: 142 },
  { day: "Tue", uploads: 178 },
  { day: "Wed", uploads: 195 },
  { day: "Thu", uploads: 163 },
  { day: "Fri", uploads: 211 },
  { day: "Sat", uploads: 89 },
  { day: "Sun", uploads: 67 },
];

const activityStream = [
  { time: "14:32", event: "GeoTIFF dataset uploaded", source: "Sentinel-2 Connector", status: "success" },
  { time: "14:28", event: "Verification job #4821 completed", source: "Impact Verification", status: "success" },
  { time: "14:25", event: "IoT data stream reconnected", source: "AWS IoT Core", status: "warning" },
  { time: "14:21", event: "Policy simulation queued", source: "Simulation Engine", status: "pending" },
  { time: "14:18", event: "Carbon metrics recalculated", source: "Analytics Pipeline", status: "success" },
  { time: "14:12", event: "New data source registered", source: "REST API", status: "success" },
];

const statusDot: Record<string, string> = {
  success: "bg-primary",
  warning: "bg-glow-warning",
  pending: "bg-glow-info",
};

const DataActivityMonitor = () => {
  const liveUploads = useLiveData(211, (prev) => Math.max(100, prev + Math.round((Math.random() - 0.4) * 15)), 3000);
  const liveJobs = useLiveData(12, (prev) => Math.max(1, prev + Math.round((Math.random() - 0.5) * 3)), 4000);
  const animUploads = useAnimatedNumber(liveUploads, 800);
  const animJobs = useAnimatedNumber(liveJobs, 800);

  const metrics = [
    { label: "Datasets Uploaded Today", value: animUploads.toString(), icon: Database, trend: "+14%" },
    { label: "Active Integrations", value: "38", icon: Wifi, trend: "+2" },
    { label: "Verification Jobs Running", value: animJobs.toString(), icon: ShieldCheck, trend: "3 queued" },
    { label: "Simulations Executed", value: "47", icon: FlaskConical, trend: "+8 today" },
  ];

  return (
    <DrillDownPanel
      title="Data Activity Monitor"
      drillContent={
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">Live Activity Stream</p>
          <div className="space-y-2">
            {activityStream.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="font-mono text-muted-foreground w-12">{a.time}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[a.status]} animate-pulse-glow`} />
                <span className="text-secondary-foreground flex-1 truncate">{a.event}</span>
                <span className="text-muted-foreground text-[10px] hidden sm:inline">{a.source}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
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
            <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', fontSize: 12 }} />
            <Bar dataKey="uploads" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DrillDownPanel>
  );
};

export default DataActivityMonitor;
