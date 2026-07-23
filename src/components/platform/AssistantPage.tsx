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

import { useMemo, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
import { Mic, Volume2, Settings, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Response type mirrors HybridAssistantResponse from the server ──────────────
interface HybridResponse {
  answer: string;
  confidence: number;
  citations: string[];
  suggestions: string[];
  handledBy: "sql" | "rag" | "analysis" | "caw" | "general";
  chartData?: Array<{
    month?: string;
    observed?: number;
    projected?: number;
    district?: string;
    score?: number;
    year?: number;
    value?: number;
  }>;
  networkData?: {
    nodes: Array<{ id: string; label: string; type: string; value: number }>;
    edges: Array<{ source: string; target: string; label: string; weight: number }>;
  };
  metrics?: Record<string, string | number>;
  heatmapPoints?: Array<{
    lat: number;
    lng: number;
    intensity: number;
    district: string;
    category: string;
  }>;
  /** CAW category breakdown for bar chart */
  cawBreakdown?: Array<{ category: string; count: number }>;
  processingTimeMs?: number;
  timestamp?: string;
  queryDescription?: string;
  executionTimeMs?: number;
  rowsReturned?: number;
}

async function askHybridAssistant(question: string): Promise<HybridResponse> {
  const start = performance.now();
  // Call the new hybrid AI workflow endpoint
  const response = await fetch(`/api/ai-assistant?question=${encodeURIComponent(question)}`);
  if (!response.ok) throw new Error("Assistant unavailable");
  const data = await response.json();
  const end = performance.now();

  return {
    ...data,
    processingTimeMs: Math.round(end - start),
    timestamp: new Date().toLocaleTimeString(),
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Trend / prediction line chart rendered when chartData contains month keys */
function TrendChart({ data }: { data: HybridResponse["chartData"] }) {
  if (!data?.length || !data[0].month) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Crime Trend Chart
      </p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
            <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            {/* Observed crimes line */}
            <Line
              type="monotone"
              dataKey="observed"
              stroke="#58d6c9"
              strokeWidth={2}
              dot={false}
              name="Observed"
            />
            {/* Projected / forecast line */}
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#a88cff"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              name="Projected"
            />
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
  const LAT_MIN = 11.5,
    LAT_MAX = 18.5,
    LNG_MIN = 74.0,
    LNG_MAX = 78.5;
  const W = 320,
    H = 200;

  const toX = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const toY = (lat: number) => H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Crime Hotspot Map
      </p>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
          {/* Karnataka outline placeholder */}
          <rect x={0} y={0} width={W} height={H} fill="rgba(255,255,255,0.02)" rx={8} />
          {points.map((p, i) => (
            <g key={i}>
              {/* Glow ring */}
              <circle
                cx={toX(p.lng)}
                cy={toY(p.lat)}
                r={p.intensity * 14 + 4}
                fill={`rgba(255,80,80,${p.intensity * 0.25})`}
              />
              {/* Core dot */}
              <circle
                cx={toX(p.lng)}
                cy={toY(p.lat)}
                r={4}
                fill={`rgba(255,${Math.round(80 + (1 - p.intensity) * 120)},80,0.9)`}
              />
              <title>
                {p.district} — {p.category} ({Math.round(p.intensity * 100)}%)
              </title>
            </g>
          ))}
        </svg>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">
          Karnataka — {points.length} hotspot clusters
        </p>
      </div>
    </div>
  );
}

/** Criminal network: simple SVG force-layout (circular placement) */
function NetworkViz({ data }: { data: HybridResponse["networkData"] }) {
  if (!data?.nodes?.length) return null;

  const nodes = data.nodes.slice(0, 16);
  const edges = data.edges.slice(0, 24);
  const W = 320,
    H = 220,
    CX = W / 2,
    CY = H / 2,
    R = 90;

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
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Criminal Network Graph
      </p>
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
                x1={positions[si].x}
                y1={positions[si].y}
                x2={positions[ti].x}
                y2={positions[ti].y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={e.weight * 0.5}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map((n, i) => (
            <g key={n.id}>
              <circle
                cx={positions[i].x}
                cy={positions[i].y}
                r={6 + n.value * 0.5}
                fill={typeColor[n.type] ?? "#888"}
                opacity={0.85}
              />
              <text
                x={positions[i].x}
                y={positions[i].y - 9}
                textAnchor="middle"
                fontSize={7}
                fill="rgba(255,255,255,0.6)"
              >
                {n.label.split(" ")[0]}
              </text>
            </g>
          ))}
        </svg>
        {/* Legend */}
        <div className="mt-1 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
          {Object.entries(typeColor).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
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
  // Exclude raw SQL queries, explanations, and long text fields from metric cards
  const entries = Object.entries(metrics)
    .filter(([key, value]) => {
      if (key === "query" || key === "explanation") return false;
      if (typeof value === "string" && value.length > 60) return false;
      return true;
    })
    .slice(0, 6);

  if (!entries.length) return null;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {key.replace(/([A-Z])/g, " $1")}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────
export function AssistantPage() {
  const [question, setQuestion] = useState("Show crime trends");
  // Ref to the response card for PDF print (unused now but preserved for layout compat)
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["ai-assistant", question],
    queryFn: () => askHybridAssistant(question),
  });

  const suggestions = useMemo(() => query.data?.suggestions ?? [], [query.data]);

  // Voice Assistant states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(
    () => localStorage.getItem("voice_enabled") === "true",
  );
  const [voiceSpeed, setVoiceSpeed] = useState(() =>
    Number(localStorage.getItem("voice_speed") ?? "1.0"),
  );
  const [selectedVoiceName, setSelectedVoiceName] = useState(
    () => localStorage.getItem("voice_name") ?? "",
  );
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [sqlCardOpen, setSqlCardOpen] = useState(false);

  const reasoningSteps = useMemo(() => {
    if (!query.data) return [];
    const module = query.data.handledBy;
    switch (module) {
      case "sql":
        return [
          "Parsed query intent: Categorized as structured search requiring database statistics query.",
          "Generated Text-to-SQL command mapping columns (FIR, District, Officer, status).",
          "Executed SQL query against local Karnataka Crime Database schema.",
          "Retrieved structured rows and calculated corresponding counts.",
          "Generated natural language response reporting results and appended follow-up suggestions.",
        ];
      case "rag":
        return [
          "Parsed query intent: Categorized as semantic textual documentation retrieval request.",
          "Computed text embeddings on the search query.",
          "Executed cosine similarity lookup on vector DB document segments.",
          "Retrieved top verified RAG documents matching Karnataka census and demographics.",
          "Synthesized context summary to answer the question exactly matching verified sources.",
        ];
      case "analysis":
        return [
          "Parsed query intent: Categorized as analytics engine prediction/risk scoring.",
          "Loaded historical crimes dataset and aggregated monthly buckets.",
          "Computed dynamic risk score using baseline frequency, offender presence, and trend weights.",
          "Ran time-series forecasting to plot observed vs projected values.",
          "Compiled hotspot coordinates and generated recommendation checklist.",
        ];
      case "caw":
        return [
          "Parsed query intent: Categorized as Crimes Against Women statistics inquiry.",
          "Queried specific state-wide CAW ledger tables.",
          "Extracted category breakdowns (Rape, Dowry Deaths, Assault).",
          "Constructed comparative metrics for top crime districts.",
          "Compiled safety insights and next-step recommendations.",
        ];
      default:
        return [
          "Parsed query intent: General help / conversational QA request.",
          "Routed to General LLM generator.",
          "Matched with internal agent knowledge base.",
          "Constructed direct response with helpful system guidelines.",
        ];
    }
  }, [query.data]);

  // Load available system speech voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filter for English voices
      setAvailableVoices(voices.filter((v) => v.lang.startsWith("en")));
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Text-to-Speech synthesis trigger when AI response completes
  useEffect(() => {
    if (query.data && voiceEnabled) {
      window.speechSynthesis.cancel(); // cancel ongoing speech

      // Strip markdown syntax for natural reading voice
      const speechText = query.data.answer
        .replace(/\*\*/g, "")
        .replace(/###/g, "")
        .replace(/•/g, "-")
        .replace(/- /g, "")
        .slice(0, 500); // speak first 500 characters only

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = voiceSpeed;

      if (selectedVoiceName) {
        const matched = window.speechSynthesis
          .getVoices()
          .find((v) => v.name === selectedVoiceName);
        if (matched) utterance.voice = matched;
      }

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [query.data, voiceEnabled, voiceSpeed, selectedVoiceName]);

  // Speech-to-Text mic recording trigger
  function startSpeechToText() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      toast.info("Microphone active... Speak your query in English.");
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
      toast.error("Voice capture error: " + e.error);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: any) => {
      const recognized = event.results[0][0].transcript;
      setQuestion(recognized);
      toast.success("Voice capture successful!");

      // English Voice Command shortcuts
      const cmd = recognized.toLowerCase().trim();
      if (cmd === "submit" || cmd === "send" || cmd === "ask") {
        query.refetch();
      } else if (cmd === "clear" || cmd === "reset") {
        setQuestion("");
      } else if (cmd.includes("go to dashboard")) {
        navigate({ to: "/dashboard" });
      } else if (cmd.includes("go to crimes")) {
        navigate({ to: "/crimes" });
      } else if (cmd.includes("go to map")) {
        navigate({ to: "/map" });
      } else if (cmd.includes("go to timeline")) {
        navigate({ to: "/timeline" });
      }
    };

    rec.start();
  }

  // Generate official, professional PDF report using jsPDF (Feature 4)
  function handleDownloadPdf() {
    if (!query.data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // 1. Karnataka Police Official Header Brand Banner
    doc.setFillColor(13, 17, 23); // dark navy
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("KARNATAKA STATE POLICE", margin, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 180, 180);
    doc.text("CRIME INTELLIGENCE UNIT · OFFICIAL ANALYSIS REPORT", margin, 25);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, margin, 32);

    // KSP Seal branding representation
    doc.setFillColor(88, 214, 201); // accent teal
    doc.rect(pageWidth - 35, 10, 20, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(13, 17, 23);
    doc.text("KSP", pageWidth - 32, 22);
    doc.setFontSize(7);
    doc.text("INTEL", pageWidth - 32, 27);

    // Reset colors
    doc.setTextColor(33, 37, 41);
    let y = 52;

    // 2. Report Document title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("CRIMESENSE AI intel INVESTIGATION DISCLOSURE", margin, y);
    y += 8;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 3. User Query block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("SEARCH QUERY INQUIRY PARAMETERS:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(90, 90, 90);
    const wrappedQuery = doc.splitTextToSize(question, contentWidth);
    doc.text(wrappedQuery, margin, y);
    y += wrappedQuery.length * 5.5 + 6;

    // 4. Clean up Markdown Answer & format to PDF lines
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(9.5);
    doc.text("AI CONTEXTUAL INTEL & INVESTIGATION RECOMMENDATIONS:", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const cleanAnswer = query.data.answer
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/•/g, "-");

    const wrappedAnswer = doc.splitTextToSize(cleanAnswer, contentWidth);

    wrappedAnswer.forEach((line: string) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 8;

    // 5. Technical metrics block
    if (query.data.metrics) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y, contentWidth, 26, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(13, 17, 23);
      doc.text("ANALYTICAL METRICS:", margin + 5, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);

      const entries = Object.entries(query.data.metrics)
        .filter(([k]) => k !== "query" && k !== "explanation")
        .slice(0, 4);
      let entryX = margin + 5;
      entries.forEach(([k, v]) => {
        doc.text(`${k.toUpperCase()}: ${v}`, entryX, y + 17);
        entryX += 45;
      });
      y += 34;
    }

    // 6. Citations
    if (query.data.citations && query.data.citations.length > 0) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(33, 37, 41);
      doc.text("VERIFIED PLATFORM CITATION DATABASE SOURCES:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(query.data.citations.join("  |  "), margin, y);
    }

    // Header/Footer page numbering stamp loops
    const totalPages = doc.internal.pages.length - 1;
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      doc.setPage(pageNum);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 32, 287);
      doc.text("CONFIDENTIAL & PRIVILEGED · KARNATAKA POLICE CRIME RESEARCH DEPT", margin, 287);
    }

    doc.save(`KSP_Intelligence_Report_${Date.now()}.pdf`);
    toast.success("Professional PDF report generated and downloaded!");
  }

  // Badge colour per module
  const moduleBadge: Record<string, string> = {
    sql: "bg-blue-500/15 text-blue-300",
    rag: "bg-purple-500/15 text-purple-300",
    analysis: "bg-teal-500/15 text-teal-300",
    caw: "bg-pink-500/15 text-pink-300",
    general: "bg-white/10 text-muted-foreground",
  };

  const toast: any = {
    info: (msg: string) =>
      window.dispatchEvent(
        new CustomEvent("sonner-toast", { detail: { type: "info", message: msg } }),
      ),
    success: (msg: string) =>
      window.dispatchEvent(
        new CustomEvent("sonner-toast", { detail: { type: "success", message: msg } }),
      ),
    error: (msg: string) =>
      window.dispatchEvent(
        new CustomEvent("sonner-toast", { detail: { type: "error", message: msg } }),
      ),
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Hybrid AI — routes your question through Text-to-SQL, RAG, or the Analysis Engine
          automatically.
        </p>
      </div>

      {/* Query input card */}
      <Card className="glass border-white/10 p-5 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a crime intelligence question..."
            onKeyDown={(e) => e.key === "Enter" && query.refetch()}
            className="flex-1 bg-white/5 border-white/10 text-sm"
          />
          <div className="flex items-center gap-2">
            {/* Microphone Speak button */}
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              onClick={startSpeechToText}
              className={cn("gap-1.5 min-w-[45px]", isListening && "animate-pulse")}
            >
              <Mic className="h-4.5 w-4.5" />
            </Button>

            {/* Voice Volume gear panel trigger */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={cn(
                "min-w-[45px]",
                voiceEnabled ? "text-accent border-accent/30 bg-accent/5" : "text-muted-foreground",
              )}
            >
              <Volume2 className="h-4.5 w-4.5" />
            </Button>

            <Button onClick={() => query.refetch()}>Ask</Button>
          </div>
        </div>

        {/* Voice Setting configuration card */}
        {showVoiceSettings && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 animate-fade-in text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground text-xs">Speak AI Responses</p>
                <p className="text-[10px] text-muted-foreground">
                  Synthesize and read out response outputs loud automatically
                </p>
              </div>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => {
                  setVoiceEnabled(e.target.checked);
                  localStorage.setItem("voice_enabled", String(e.target.checked));
                  if (!e.target.checked) window.speechSynthesis.cancel();
                }}
                className="rounded border-white/10 h-4 w-4 bg-transparent accent-accent cursor-pointer"
              />
            </div>

            {voiceEnabled && (
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground">
                    Voice Accent Selection
                  </label>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => {
                      setSelectedVoiceName(e.target.value);
                      localStorage.setItem("voice_name", e.target.value);
                    }}
                    className="flex h-8 w-full rounded border border-white/10 bg-transparent px-2 text-xs text-foreground focus-visible:outline-none"
                  >
                    <option value="" className="bg-card">
                      Default System Voice
                    </option>
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-card text-xs">
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground flex justify-between">
                    <span>Voice Speed rate</span>
                    <span className="font-semibold text-accent">{voiceSpeed}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVoiceSpeed(val);
                      localStorage.setItem("voice_speed", String(val));
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Response area ── */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          {query.isLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Thinking…</p>
          ) : query.data ? (
            <>
              {/* Module badge */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${moduleBadge[query.data.handledBy]}`}
                  >
                    {query.data.handledBy.toUpperCase()} MODULE
                  </span>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-accent">
                    Confidence {Math.round(query.data.confidence * 100)}%
                  </span>
                </div>

                {/* PDF generation trigger */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="text-xs gap-1.5 h-7"
                >
                  <FileDown className="h-3.5 w-3.5" /> PDF
                </Button>
              </div>

              {/* Main answer text */}
              <p className="text-sm text-foreground whitespace-pre-wrap">{query.data.answer}</p>

              {/* Citations */}
              {query.data.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {query.data.citations.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 px-3 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Results Data Table for End Users */}
              {query.data.tableRows && query.data.tableRows.length > 0 && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Matching Incident Records ({query.data.rowsReturned ?? query.data.tableRows.length})
                    </p>
                  </div>
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          {Object.keys(query.data.tableRows[0]).map((key) => (
                            <th key={key} className="p-2 font-medium text-muted-foreground capitalize">
                              {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {query.data.tableRows.slice(0, 15).map((row, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            {Object.values(row).map((val: any, vIdx) => (
                              <td key={vIdx} className="p-2 text-foreground truncate max-w-xs">
                                {val === null || val === undefined
                                  ? "-"
                                  : typeof val === "boolean"
                                    ? val ? "Yes" : "No"
                                    : typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {query.data.tableRows.length > 15 && (
                    <p className="text-[10px] text-muted-foreground italic">
                      Showing first 15 of {query.data.tableRows.length} records.
                    </p>
                  )}
                </div>
              )}

              {/* Developer Mode Only: Expandable SQL Debug Panel (SHOW_SQL_DEBUG=true) */}
              {query.data.showSqlDebug && query.data.handledBy === "sql" && query.data.queryDescription && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setSqlCardOpen(!sqlCardOpen)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
                  >
                    {sqlCardOpen ? "Hide Developer SQL Debug Info" : "[DEV MODE] View Generated SQL & Query Plan"}
                  </button>
                  {sqlCardOpen && (
                    <div className="mt-3 p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3.5 text-xs text-muted-foreground animate-fade-in">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-amber-400 uppercase block font-semibold">
                          Generated PostgreSQL Query
                        </span>
                        <pre className="p-3 rounded-lg border border-white/10 bg-black/50 text-amber-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {query.data.queryDescription}
                        </pre>
                      </div>

                      <div className="grid gap-3 grid-cols-2 border-t border-white/10 pt-3">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">
                            Execution Time
                          </span>
                          <span className="font-semibold text-foreground mt-0.5 block">
                            {query.data.executionTimeMs ?? query.data.processingTimeMs ?? 0} ms
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">
                            Rows Returned
                          </span>
                          <span className="font-semibold text-foreground mt-0.5 block">
                            {query.data.rowsReturned ?? query.data.tableRows?.length ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Explainable AI Collapsible Card (Feature 1) */}
              <div className="mt-4 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setExplainOpen(!explainOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider"
                >
                  {explainOpen ? "Hide Intelligence Details" : "Explain AI Response & Data Context"}
                </button>

                {explainOpen && (
                  <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/3 space-y-3.5 text-xs text-muted-foreground animate-fade-in">
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">
                          Data Source
                        </span>
                        <span className="font-semibold text-foreground mt-0.5 block">
                          {query.data.citations?.join(", ") || "Karnataka Crime DB / Documents"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">
                          Module Used
                        </span>
                        <span className="font-semibold text-foreground mt-0.5 block">
                          {query.data.handledBy === "sql"
                            ? "Text-to-SQL (Structured)"
                            : query.data.handledBy === "rag"
                              ? "RAG Retrieval (Semantic)"
                              : query.data.handledBy === "analysis"
                                ? "Analysis Engine (Predictive)"
                                : query.data.handledBy === "caw"
                                  ? "Crimes Against Women (CAW)"
                                  : "General LLM (Conversational)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">
                          Confidence Score
                        </span>
                        <span className="font-semibold text-foreground mt-0.5 block">
                          {Math.round(query.data.confidence * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">
                          Processing Time
                        </span>
                        <span className="font-semibold text-foreground mt-0.5 block">
                          {query.data.processingTimeMs ?? 240} ms
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">
                          Timestamp
                        </span>
                        <span className="font-semibold text-foreground mt-0.5 block">
                          {query.data.timestamp ?? new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                        Reasoning Steps
                      </span>
                      <div className="space-y-1.5 pl-3 border-l border-white/10">
                        {reasoningSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                          >
                            <span className="text-accent font-bold">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics grid */}
              {query.data.metrics && <MetricsGrid metrics={query.data.metrics} />}

              {/* Trend / prediction chart */}
              <TrendChart data={query.data.chartData} />

              {/* Hotspot map */}
              <HotspotMap points={query.data.heatmapPoints} />

              {/* Network visualisation */}
              <NetworkViz data={query.data.networkData} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No answer yet.</p>
          )}
        </div>

        {/* ── Investigation Recommendations & Suggestion pills ── */}
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Investigation Recommendations & Follow-Up Inquiries
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setQuestion(item)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
