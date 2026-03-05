import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivationPanel from "@/components/dashboard/ActivationPanel";
import FeatureAdoptionMap from "@/components/dashboard/FeatureAdoptionMap";
import EngagementScore from "@/components/dashboard/EngagementScore";
import CohortAnalysis from "@/components/dashboard/CohortAnalysis";
import WorkflowTracker from "@/components/dashboard/WorkflowTracker";
import DataActivityMonitor from "@/components/dashboard/DataActivityMonitor";
import EcosystemImpact from "@/components/dashboard/EcosystemImpact";
import FeedbackLoop from "@/components/dashboard/FeedbackLoop";
import FilterSidebar, { DashboardFilters } from "@/components/dashboard/FilterSidebar";

const Index = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "Last 30 days",
    segment: "All Users",
    featureCategory: "All Features",
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onToggleFilters={() => setFiltersOpen(!filtersOpen)} />
      
      <div className="scanline pointer-events-none fixed inset-0 z-30" />

      {/* Active filter pills */}
      {(filters.dateRange !== "Last 30 days" || filters.segment !== "All Users" || filters.featureCategory !== "All Features") && (
        <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-muted-foreground">ACTIVE FILTERS:</span>
          {filters.dateRange !== "Last 30 days" && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{filters.dateRange}</span>
          )}
          {filters.segment !== "All Users" && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{filters.segment}</span>
          )}
          {filters.featureCategory !== "All Features" && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{filters.featureCategory}</span>
          )}
        </div>
      )}

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivationPanel />
          </div>
          <EngagementScore />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureAdoptionMap />
          <WorkflowTracker />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataActivityMonitor />
          <CohortAnalysis />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EcosystemImpact />
          <FeedbackLoop />
        </section>
      </main>

      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />
    </div>
  );
};

export default Index;
