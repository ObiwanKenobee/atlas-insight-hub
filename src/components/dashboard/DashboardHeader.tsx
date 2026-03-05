import { Activity, Bell, Settings, Filter } from "lucide-react";

interface DashboardHeaderProps {
  onToggleFilters?: () => void;
}

const DashboardHeader = ({ onToggleFilters }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center glow-primary">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Atlas Sanctum
          </h1>
          <p className="text-xs text-muted-foreground font-mono">PRODUCT TELEMETRY CONSOLE</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted-foreground">
          LIVE <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow ml-1" />
        </span>
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
        <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
