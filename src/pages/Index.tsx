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
import AIInsightsFeed from "@/components/dashboard/AIInsightsFeed";
import AlertsNotifications from "@/components/dashboard/AlertsNotifications";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import CollaborativeAnnotations from "@/components/dashboard/CollaborativeAnnotations";
import FilterSidebar, { DashboardFilters } from "@/components/dashboard/FilterSidebar";
import KeyboardShortcutsHelp from "@/components/dashboard/KeyboardShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useRealtimeDashboard } from "@/hooks/use-realtime-dashboard";

const AnimatedSection = ({ children, delay = 0, className = "", sectionRef }: { children: React.ReactNode; delay?: number; className?: string; sectionRef?: React.Ref<HTMLElement> }) => (
  <section
    ref={sectionRef}
    className={`animate-fade-in-up opacity-0 ${className}`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    {children}
  </section>
);

const Index = () => {
  useRealtimeDashboard();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "Last 30 days",
    segment: "All Users",
    featureCategory: "All Features",
  });

  const sectionRefs = useRef<(HTMLElement | null)[]>([null, null, null, null, null, null]);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("light");
  }, []);

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useKeyboardShortcuts({
    onToggleFilters: () => setFiltersOpen((prev) => !prev),
    onToggleTheme: toggleTheme,
    onScrollToSection: scrollToSection,
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

      <main className="p-3 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
        {/* AI Insights + Alerts row */}
        <AnimatedSection delay={50} sectionRef={setSectionRef(0)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <AIInsightsFeed />
          <AlertsNotifications />
        </AnimatedSection>

        <AnimatedSection delay={150} sectionRef={setSectionRef(1)} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <ActivationPanel />
          </div>
          <EngagementScore />
        </AnimatedSection>

        {/* Interactive Map + Feature Adoption */}
        <AnimatedSection delay={300} sectionRef={setSectionRef(2)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <InteractiveMap />
          <FeatureAdoptionMap />
        </AnimatedSection>

        <AnimatedSection delay={400} sectionRef={setSectionRef(3)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <WorkflowTracker />
          <DataActivityMonitor />
        </AnimatedSection>

        <AnimatedSection delay={500} sectionRef={setSectionRef(4)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <CohortAnalysis />
          <EcosystemImpact />
        </AnimatedSection>

        {/* Feedback + Annotations */}
        <AnimatedSection delay={600} sectionRef={setSectionRef(5)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FeedbackLoop />
          <CollaborativeAnnotations />
        </AnimatedSection>
      </main>

      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <KeyboardShortcutsHelp />
    </div>
  );
};

export default Index;
