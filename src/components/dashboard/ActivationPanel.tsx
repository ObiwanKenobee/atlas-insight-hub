import { useState } from "react";
import { TrendingUp, TrendingDown, Users, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import DrillDownPanel from "./DrillDownPanel";
import { useAnimatedNumber, useLiveData } from "@/hooks/use-animated-number";

const weeklyData = [
  { week: "W1", rate: 42 },
  { week: "W2", rate: 45 },
  { week: "W3", rate: 48 },
  { week: "W4", rate: 51 },
  { week: "W5", rate: 55 },
  { week: "W6", rate: 58 },
  { week: "W7", rate: 62 },
  { week: "W8", rate: 67 },
];

const initialFunnel = [
  { label: "Account Created", count: 2480, pct: 100 },
  { label: "Data Source Connected", count: 1860, pct: 75 },
  { label: "First Dataset Uploaded", count: 1364, pct: 55 },
  { label: "First Metric Calculated", count: 918, pct: 37 },
  { label: "First Asset Verified", count: 670, pct: 27 },
];

const drilldownData = [
  { segment: "Enterprise", activation: 84, users: 420 },
  { segment: "Pro", activation: 72, users: 890 },
  { segment: "Starter", activation: 51, users: 640 },
  { segment: "Trial", activation: 38, users: 530 },
];

const ActivationPanel = () => {
  const activationRate = useLiveData(67, (prev) => Math.min(99, Math.max(50, prev + Math.round((Math.random() - 0.45) * 3))), 4000);
  const animatedRate = useAnimatedNumber(activationRate);

  return (
    <DrillDownPanel
      title="Activation Rate"
      drillContent={
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Activation by Segment</p>
          <div className="space-y-3">
            {drilldownData.map((d) => (
              <div key={d.segment} className="flex items-center gap-3">
                <span className="text-xs text-secondary-foreground w-20">{d.segment}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${d.activation}%` }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-16 text-right">{d.activation}% · {d.users}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-card p-3 border border-border">
              <p className="text-[10px] text-muted-foreground">Avg Time to Activate</p>
              <p className="text-lg font-bold font-mono text-foreground">3.2d</p>
            </div>
            <div className="rounded-md bg-card p-3 border border-border">
              <p className="text-[10px] text-muted-foreground">Top Drop-off</p>
              <p className="text-lg font-bold font-mono text-glow-warning">Step 3</p>
            </div>
            <div className="rounded-md bg-card p-3 border border-border">
              <p className="text-[10px] text-muted-foreground">Conversion Rate</p>
              <p className="text-lg font-bold font-mono text-primary">27%</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-5xl font-bold text-primary text-glow font-mono">{animatedRate}%</span>
        <span className="flex items-center text-sm text-primary gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          +5.2% this week
        </span>
      </div>

      <div className="h-32 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="activationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[30, 80]} />
            <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', fontSize: 12 }} labelStyle={{ color: 'hsl(160, 10%, 75%)' }} />
            <Area type="monotone" dataKey="rate" stroke="hsl(160, 60%, 45%)" strokeWidth={2} fill="url(#activationGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Activation Funnel</p>
        <div className="space-y-2">
          {initialFunnel.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="w-5 text-right text-xs font-mono text-muted-foreground">{i + 1}</div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary-foreground">{step.label}</span>
                  <span className="font-mono text-muted-foreground">{step.count.toLocaleString()} · {step.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${step.pct}%`, opacity: 0.4 + (step.pct / 100) * 0.6 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DrillDownPanel>
  );
};

export default ActivationPanel;
