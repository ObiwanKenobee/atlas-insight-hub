import { useState, useRef, useCallback } from "react";
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
import KeyboardShortcutsHelp from "@/components/dashboard/KeyboardShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

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

      <main className="p-3 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
        <AnimatedSection delay={100} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <ActivationPanel />
          </div>
          <EngagementScore />
        </AnimatedSection>

        <AnimatedSection delay={250} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FeatureAdoptionMap />
          <WorkflowTracker />
        </AnimatedSection>

        <AnimatedSection delay={400} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <DataActivityMonitor />
          <CohortAnalysis />
        </AnimatedSection>

        <AnimatedSection delay={550} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <EcosystemImpact />
          <FeedbackLoop />
        </AnimatedSection>
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
