import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivationPanel from "@/components/dashboard/ActivationPanel";
import FeatureAdoptionMap from "@/components/dashboard/FeatureAdoptionMap";
import EngagementScore from "@/components/dashboard/EngagementScore";
import CohortAnalysis from "@/components/dashboard/CohortAnalysis";
import WorkflowTracker from "@/components/dashboard/WorkflowTracker";
import DataActivityMonitor from "@/components/dashboard/DataActivityMonitor";
import EcosystemImpact from "@/components/dashboard/EcosystemImpact";
import FeedbackLoop from "@/components/dashboard/FeedbackLoop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="scanline pointer-events-none fixed inset-0 z-50" />

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Top Layer: Activation */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivationPanel />
          </div>
          <EngagementScore />
        </section>

        {/* Middle Layer: Feature Value */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureAdoptionMap />
          <WorkflowTracker />
        </section>

        {/* Data & Cohorts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataActivityMonitor />
          <CohortAnalysis />
        </section>

        {/* Deeper Layers */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EcosystemImpact />
          <FeedbackLoop />
        </section>
      </main>
    </div>
  );
};

export default Index;
