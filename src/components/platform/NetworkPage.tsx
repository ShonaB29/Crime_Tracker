import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";

interface NetworkPayload {
  nodes: Array<{ id: string; label: string; type: string; district?: string; value: number }>;
  edges: Array<{ source: string; target: string; label: string; weight: number }>;
  highlights: Array<{ label: string; value: string }>;
}

async function fetchNetwork(): Promise<NetworkPayload> {
  const response = await fetch("/api/network");
  if (!response.ok) throw new Error("Unable to load network data");
  return response.json();
}

export function NetworkPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["network"], queryFn: fetchNetwork });

  if (isLoading)
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Loading network graph...
      </Card>
    );
  if (error || !data)
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Network graph unavailable.
      </Card>
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Network Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Neo4j-style relationships between criminals, victims, FIRs, stations, and districts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.highlights.map((item) => (
          <Card key={item.label} className="glass border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="glass border-white/10 p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">Entities</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.nodes.slice(0, 18).map((node) => (
            <div key={node.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-foreground">{node.label}</p>
              <p className="text-xs text-muted-foreground">
                {node.type} · {node.district ?? "global"}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass border-white/10 p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">Relationships</h2>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {data.edges.slice(0, 20).map((edge, index) => (
            <div
              key={`${edge.source}-${edge.target}-${index}`}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="text-foreground">{edge.source}</span>
              <span>→</span>
              <span className="text-foreground">{edge.target}</span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-accent">
                {edge.label}
              </span>
              <span className="text-xs">weight {edge.weight}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
