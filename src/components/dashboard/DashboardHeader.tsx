import { Activity, Bell, Filter, Menu, X, LogOut, Download, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";
import DataExportPanel from "./DataExportPanel";
import { useAuth } from "@/hooks/use-auth";

interface DashboardHeaderProps {
  onToggleFilters?: () => void;
}

const DashboardHeader = ({ onToggleFilters }: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center glow-primary">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">Atlas Sanctum</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">PRODUCT TELEMETRY CONSOLE</p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground mr-1">
            LIVE <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow ml-1" />
          </span>
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
          >
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Profile"
          >
            <User className="h-4 w-4" />
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title={`Sign out (${user?.email})`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex sm:hidden items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">
            LIVE <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow ml-1" />
          </span>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && isMobile && (
          <div className="absolute top-14 right-4 z-50 bg-card border border-border rounded-lg p-3 space-y-2 shadow-lg animate-fade-in">
            <button
              onClick={() => { onToggleFilters?.(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
            <button
              onClick={() => { setExportOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export Data
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </button>
            <button
              onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <User className="h-3.5 w-3.5" /> Profile
            </button>
            <button
              onClick={() => { signOut(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <DataExportPanel open={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  );
};

export default DashboardHeader;
