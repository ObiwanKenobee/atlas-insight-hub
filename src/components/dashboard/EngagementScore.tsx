const score = 73;
const maxScore = 100;
const angle = (score / maxScore) * 180;

const signals = [
  { label: "Login Frequency", value: 82 },
  { label: "Datasets Uploaded", value: 68 },
  { label: "Verification Jobs", value: 74 },
  { label: "Simulations Run", value: 61 },
  { label: "Reports Generated", value: 79 },
];

const EngagementScore = () => {
  const circumference = Math.PI * 80;
  const offset = circumference - (score / maxScore) * circumference;

  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Product Engagement Score</p>
      
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="180" height="100" viewBox="0 0 180 100">
            <path
              d="M 10 90 A 80 80 0 0 1 170 90"
              fill="none"
              stroke="hsl(220, 15%, 18%)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 10 90 A 80 80 0 0 1 170 90"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
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
              <span className="text-3xl font-bold font-mono text-foreground">{score}</span>
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
                <div className="h-full rounded-full bg-primary" style={{ width: `${s.value}%` }} />
              </div>
              <span className="font-mono text-muted-foreground w-8 text-right">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementScore;
