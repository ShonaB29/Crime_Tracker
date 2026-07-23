import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MapPayload {
  heatmapPoints: Array<{
    lat: number;
    lng: number;
    intensity: number;
    district: string;
    category: string;
  }>;
  districts: Array<{
    name: string;
    crimeCount: number;
    hotspotCount: number;
    policeStationCount: number;
    riskScore?: number;
    riskLevel?: "Low" | "Medium" | "High";
  }>;
}

async function fetchMap(): Promise<MapPayload> {
  const response = await fetch("/api/map");
  if (!response.ok) throw new Error("Unable to load map data");
  return response.json();
}

export function CrimeMapPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["map"], queryFn: fetchMap });

  if (isLoading)
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Loading map data...
      </Card>
    );
  if (error || !data)
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Map data unavailable.
      </Card>
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Crime Map</h1>
        <p className="text-sm text-muted-foreground">
          Leaflet-ready hotspot and marker feed for Karnataka district visualization.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="glass border-white/10 p-5 xl:col-span-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Hotspots</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.heatmapPoints.slice(0, 18).map((point, index) => (
              <div
                key={`${point.district}-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-foreground">{point.district}</p>
                <p className="text-xs text-muted-foreground">{point.category}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                </p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${Math.round(point.intensity * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Districts</h2>
          <div className="mt-4 space-y-3">
            {data.districts.slice(0, 10).map((district) => (
              <div key={district.name} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{district.name}</p>
                  {district.riskLevel && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        district.riskLevel === "High"
                          ? "bg-red-500/15 text-red-400 border border-red-500/10"
                          : district.riskLevel === "Medium"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10",
                      )}
                    >
                      {district.riskScore} {district.riskLevel[0]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {district.crimeCount} crimes · {district.hotspotCount} hotspots ·{" "}
                  {district.policeStationCount} stations
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
