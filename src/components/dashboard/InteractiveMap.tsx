import { useState } from "react";
import { Globe, MapPin, Maximize2 } from "lucide-react";
import { useEcosystemIntegrations } from "@/hooks/use-dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REGIONS = [
  { id: "amazon", name: "Amazon Basin", x: 28, y: 52, hectares: 8400, carbon: 2100, projects: 12, status: "active" },
  { id: "congo", name: "Congo Rainforest", x: 52, y: 55, hectares: 6200, carbon: 1800, projects: 8, status: "active" },
  { id: "sea", name: "Southeast Asia", x: 78, y: 52, hectares: 5100, carbon: 1400, projects: 6, status: "warning" },
  { id: "europe", name: "European Rewilding", x: 52, y: 32, hectares: 4800, carbon: 1200, projects: 15, status: "active" },
  { id: "namerica", name: "North America", x: 22, y: 30, hectares: 6700, carbon: 1600, projects: 22, status: "active" },
  { id: "oceania", name: "Oceania", x: 82, y: 68, hectares: 3200, carbon: 900, projects: 4, status: "monitoring" },
  { id: "africa_east", name: "East Africa", x: 58, y: 52, hectares: 4100, carbon: 1100, projects: 7, status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-primary",
  warning: "bg-chart-4",
  monitoring: "bg-chart-3",
};

const statusGlow: Record<string, string> = {
  active: "shadow-[0_0_12px_hsl(var(--glow-primary)/0.6)]",
  warning: "shadow-[0_0_12px_hsl(var(--glow-warning)/0.6)]",
  monitoring: "shadow-[0_0_12px_hsl(var(--glow-info)/0.6)]",
};

const InteractiveMap = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: dbIntegrations } = useEcosystemIntegrations();

  const selectedRegion = REGIONS.find((r) => r.id === selected);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Globe className="h-4 w-4 text-chart-3" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Global Impact Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map area */}
        <div className="relative w-full aspect-[2/1] rounded-lg bg-secondary/30 border border-border/30 overflow-hidden panel-grid">
          {/* Grid overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

          {/* Region pins */}
          {REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelected(selected === region.id ? null : region.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
            >
              <div
                className={`relative w-3 h-3 rounded-full ${statusColors[region.status]} ${statusGlow[region.status]} 
                  ${selected === region.id ? "scale-150" : "hover:scale-125"} 
                  transition-all duration-300 animate-pulse-glow`}
              >
                {selected === region.id && (
                  <div className="absolute -inset-2 rounded-full border border-primary/30 animate-ping" />
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card/95 border border-border/50 px-2 py-0.5 rounded text-[9px] font-mono text-foreground pointer-events-none">
                {region.name}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex gap-3">
            {[
              { label: "Active", status: "active" },
              { label: "Warning", status: "warning" },
              { label: "Monitoring", status: "monitoring" },
            ].map((l) => (
              <div key={l.status} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${statusColors[l.status]}`} />
                <span className="text-[8px] font-mono text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected region detail */}
        {selectedRegion && (
          <div className="mt-3 p-3 rounded-lg bg-secondary/40 border border-border/30 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-xs font-mono text-foreground font-semibold">{selectedRegion.name}</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                selectedRegion.status === "active" ? "bg-primary/15 text-primary" :
                selectedRegion.status === "warning" ? "bg-chart-4/15 text-chart-4" :
                "bg-chart-3/15 text-chart-3"
              }`}>
                {selectedRegion.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-lg font-bold font-mono text-foreground">{(selectedRegion.hectares / 1000).toFixed(1)}K</p>
                <p className="text-[9px] text-muted-foreground">Hectares</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono text-foreground">{(selectedRegion.carbon / 1000).toFixed(1)}K</p>
                <p className="text-[9px] text-muted-foreground">tCO₂ Seq.</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono text-foreground">{selectedRegion.projects}</p>
                <p className="text-[9px] text-muted-foreground">Projects</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
