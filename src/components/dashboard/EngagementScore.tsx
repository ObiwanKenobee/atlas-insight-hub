import DrillDownPanel from "./DrillDownPanel";
import { useAnimatedNumber, useLiveData } from "@/hooks/use-animated-number";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const signals = [
  { label: "Login Frequency", value: 82, fullMark: 100 },
  { label: "Datasets Uploaded", value: 68, fullMark: 100 },
  { label: "Verification Jobs", value: 74, fullMark: 100 },
  { label: "Simulations Run", value: 61, fullMark: 100 },
  { label: "Reports Generated", value: 79, fullMark: 100 },
];

const radarData = signals.map(s => ({ subject: s.label.split(" ")[0], A: s.value }));

const EngagementScore = () => {
  const liveScore = useLiveData(73, (prev) => Math.min(100, Math.max(40, prev + Math.round((Math.random() - 0.45) * 2))), 5000);
  const animatedScore = useAnimatedNumber(liveScore);
  const maxScore = 100;
  const circumference = Math.PI * 80;
  const offset = circumference - (animatedScore / maxScore) * circumference;

  return (
    <DrillDownPanel
      title="Product Engagement Score"
      drillContent={
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">Engagement Radar</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220, 15%, 18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 50%)' }} />
                <Radar dataKey="A" stroke="hsl(160, 60%, 45%)" fill="hsl(160, 60%, 45%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="rounded-md bg-card p-2 border border-border">
              <p className="text-[10px] text-muted-foreground">At-Risk Users</p>
              <p className="text-sm font-bold font-mono text-glow-warning">142</p>
            </div>
            <div className="rounded-md bg-card p-2 border border-border">
              <p className="text-[10px] text-muted-foreground">Power Users</p>
              <p className="text-sm font-bold font-mono text-primary">318</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="180" height="100" viewBox="0 0 180 100">
            <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="hsl(220, 15%, 18%)" strokeWidth="12" strokeLinecap="round" />
            <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 70%, 50%)" />
                <stop offset="40%" stopColor="hsl(35, 90%, 55%)" />
                <stop offset="100%" stopColor="hsl(160, 60%, 45%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <div className="text-center">
              <span className="text-3xl font-bold font-mono text-foreground">{animatedScore}</span>
              <span className="text-xs text-muted-foreground block">/ {maxScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {signals.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <span className="text-secondary-foreground">{s.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${s.value}%` }} />
              </div>
              <span className="font-mono text-muted-foreground w-8 text-right">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </DrillDownPanel>
  );
};

export default EngagementScore;
