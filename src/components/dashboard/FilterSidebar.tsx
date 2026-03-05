import { useState } from "react";
import { Calendar, Users, Layers, Filter, X } from "lucide-react";

export interface DashboardFilters {
  dateRange: string;
  segment: string;
  featureCategory: string;
}

interface FilterSidebarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  open: boolean;
  onClose: () => void;
}

const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 6 months", "Year to date"];
const segments = ["All Users", "Enterprise", "Pro", "Starter", "Trial", "Churned"];
const categories = ["All Features", "Verification", "Exchange", "Simulation", "Data Tools", "Reporting"];

const FilterSidebar = ({ filters, onFiltersChange, open, onClose }: FilterSidebarProps) => {
  const update = (key: keyof DashboardFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-background/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Filters</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Date Range</span>
            </div>
            <div className="space-y-1">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => update("dateRange", range)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-md transition-colors ${
                    filters.dateRange === range
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* User Segment */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">User Segment</span>
            </div>
            <div className="space-y-1">
              {segments.map((seg) => (
                <button
                  key={seg}
                  onClick={() => update("segment", seg)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-md transition-colors ${
                    filters.segment === seg
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Category */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Feature Category</span>
            </div>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => update("featureCategory", cat)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-md transition-colors ${
                    filters.featureCategory === cat
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => onFiltersChange({ dateRange: "Last 30 days", segment: "All Users", featureCategory: "All Features" })}
            className="w-full text-xs font-mono text-muted-foreground hover:text-foreground py-2 rounded-md hover:bg-secondary transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
