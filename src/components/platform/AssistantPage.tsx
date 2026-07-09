/**
 * AssistantPage — Workflow Step 10
 *
 * Displays the hybrid AI response including:
 *   - Answer text + confidence + citations  (existing UI, unchanged)
 *   - Metrics card                          (new)
 *   - Trend / prediction chart              (new – recharts LineChart)
 *   - Hotspot map overlay                   (new – SVG dot map)
 *   - Criminal network visualisation        (new – SVG force-layout)
 *   - Downloadable PDF report               (new – browser print)
 *   - Follow-up suggestion pills            (existing UI, unchanged)
 */

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Response type mirrors HybridAssistantResponse from the server ──────────────
interface HybridResponse {
  answer: string;
  confidence: number;
  citations: string[];
  suggestions: string[];
  handledBy: "sql" | "rag" | "analysis" | "caw" | "general";
  chartData?: Array<{ month?: string; observed?: number; projected?: number; district?: string; score?: number; year?: number; value?: number }>;
  networkData?: {
    nodes: Array<{ id: string; label: string; type: string; value: number }>;
    edges: Array<{ source: string; target: string; label: string; weight: number }>;
  };
  metrics?: Record<string, string | number>;
  heatmapPoints?: Array<{ lat: number; lng: number; intensity: number; district: string; category: string }>;
  /** CAW category breakdown for bar chart */
  cawBreakdown?: Array<{ category: string; count: number }>;
}

async function askHybridAssistant(question: string): Promise<HybridResponse> {
  // Call the new hybrid AI workflow endpoint
  const response = await fetch(`/api/ai-assistant?question=${encodeURIComponent(question)}`);
  if (!response.ok) throw new Error("Assistant unavailable");
  return response.json();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Trend / prediction line chart rendered when chartData contains month keys */
function TrendChart({ data }: { data: HybridResponse["chartData"] }) {
  if (!data?.length || !data[0].month) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Crime Trend Chart</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
            <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }} />
            {/* Observed crimes line */}
            <Line type="monotone" dataKey="observed" stroke="#58d6c9" strokeWidth={2} dot={false} name="Observed" />
            {/* Projected / forecast line */}
            <Line type="monotone" dataKey="projected" stroke="#a88cff" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Projected" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Hotspot map: SVG dot-map using normalised lat/lng coordinates */
function HotspotMap({ points }: { points: HybridResponse["heatmapPoints"] }) {
  if (!points?.length) return null;

  // Karnataka bounding box (approx)
  const LAT_MIN = 11.5, LAT_MAX = 18.5, LNG_MIN = 74.0, LNG_MAX = 78.5;
  const W = 320, H = 200;

  const toX = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const toY = (lat: number) => H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Crime Hotspot Map</p>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
          {/* Karnataka outline placeholder */}
          <rect x={0} y={0} width={W} height={H} fill="rgba(255,255,255,0.02)" rx={8} />
          {points.map((p, i) => (
            <g key={i}>
              {/* Glow ring */}
              <circle cx={toX(p.lng)} cy={toY(p.lat)} r={p.intensity * 14 + 4} fill={`rgba(255,80,80,${p.intensity * 0.25})`} />
              {/* Core dot */}
              <circle cx={toX(p.lng)} cy={toY(p.lat)} r={4} fill={`rgba(255,${Math.round(80 + (1 - p.intensity) * 120)},80,0.9)`} />
              <title>{p.district} — {p.category} ({Math.round(p.intensity * 100)}%)</title>
            </g>
          ))}
        </svg>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">Karnataka — {points.length} hotspot clusters</p>
      </div>
    </div>
  );
}

/** Criminal network: simple SVG force-layout (circular placement) */
function NetworkViz({ data }: { data: HybridResponse["networkData"] }) {
  if (!data?.nodes?.length) return null;

  const nodes = data.nodes.slice(0, 16);
  const edges = data.edges.slice(0, 24);
  const W = 320, H = 220, CX = W / 2, CY = H / 2, R = 90;

  // Place nodes in a circle
  const positions = nodes.map((_, i) => ({
    x: CX + R * Math.cos((2 * Math.PI * i) / nodes.length),
    y: CY + R * Math.sin((2 * Math.PI * i) / nodes.length),
  }));

  const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]));

  const typeColor: Record<string, string> = {
    criminal: "#ff6b6b",
    victim: "#67a4ff",
    station: "#58d6c9",
    district: "#a88cff",
    case: "#ffb86b",
  };

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Criminal Network Graph</p>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
          {/* Edges */}
          {edges.map((e, i) => {
            const si = nodeIndex.get(e.source);
            const ti = nodeIndex.get(e.target);
            if (si === undefined || ti === undefined) return null;
            return (
              <line
                key={i}
                x1={positions[si].x} y1={positions[si].y}
                x2={positions[ti].x} y2={positions[ti].y}
                stroke="rgba(255,255,255,0.12)" strokeWidth={e.weight * 0.5}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map((n, i) => (
            <g key={n.id}>
              <circle cx={positions[i].x} cy={positions[i].y} r={6 + n.value * 0.5} fill={typeColor[n.type] ?? "#888"} opacity={0.85} />
              <text x={positions[i].x} y={positions[i].y - 9} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.6)">
                {n.label.split(" ")[0]}
              </text>
            </g>
          ))}
        </svg>
        {/* Legend */}
        <div className="mt-1 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
          {Object.entries(typeColor).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Key metrics grid */
function MetricsGrid({ metrics }: { metrics: Record<string, string | number> }) {
  const entries = Object.entries(metrics).slice(0, 6);
  if (!entries.length) return null;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────
export function AssistantPage() {
  const [question, setQuestion] = useState("Show crime trends");
  // Ref to the response card for PDF print
  const printRef = useRef<HTMLDivElement>(null);

  const query = useQuery({
    queryKey: ["ai-assistant", question],
    queryFn: () => askHybridAssistant(question),
  });

  const suggestions = useMemo(() => query.data?.suggestions ?? [], [query.data]);

  // Trigger browser print dialog scoped to the response card
  function handleDownloadPdf() {
    window.print();
  }

  // Badge colour per module
  const moduleBadge: Record<string, string> = {
    sql:      "bg-blue-500/15 text-blue-300",
    rag:      "bg-purple-500/15 text-purple-300",
    analysis: "bg-teal-500/15 text-teal-300",
    caw:      "bg-pink-500/15 text-pink-300",
    general:  "bg-white/10 text-muted-foreground",
  };

  return (
    <div className="space-y-4">
      {/* ── Header (unchanged) ── */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Hybrid AI — routes your question through Text-to-SQL, RAG, or the Analysis Engine automatically.
        </p>
      </div>

      {/* ── Query input (unchanged layout) ── */}
      <Card className="glass border-white/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a crime intelligence question"
            onKeyDown={(e) => e.key === "Enter" && query.refetch()}
          />
          <Button onClick={() => query.refetch()}>Ask</Button>
        </div>

        {/* ── Response area ── */}
        <div ref={printRef} className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 print:border-black print:bg-white print:text-black">
          {query.isLoading ? (
            <p className="text-sm text-muted-foreground">Thinking…</p>
          ) : query.data ? (
            <>
              {/* Module badge — shows which workflow path handled the query */}
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${moduleBadge[query.data.handledBy]}`}>
                  {query.data.handledBy.toUpperCase()} MODULE
                </span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-accent">
                  Confidence {Math.round(query.data.confidence * 100)}%
                </span>
              </div>

              {/* Main answer text */}
              <p className="text-sm text-foreground">{query.data.answer}</p>

              {/* Citations */}
              {query.data.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {query.data.citations.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 px-3 py-1">{c}</span>
                  ))}
                </div>
              )}

              {/* Metrics grid — Step 10 */}
              {query.data.metrics && <MetricsGrid metrics={query.data.metrics} />}

              {/* Trend / prediction chart — Step 10 */}
              <TrendChart data={query.data.chartData} />

              {/* Hotspot map — Step 10 */}
              <HotspotMap points={query.data.heatmapPoints} />

              {/* Network visualisation — Step 10 */}
              <NetworkViz data={query.data.networkData} />

              {/* PDF download button — Step 10 */}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="text-xs">
                  Download PDF Report
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No answer yet.</p>
          )}
        </div>

        {/* ── Suggestion pills (unchanged) ── */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => setQuestion(item)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
