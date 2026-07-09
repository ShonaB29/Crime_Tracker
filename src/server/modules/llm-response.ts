/**
 * MODULE: LLM Response Generator (Workflow Steps 8 & 9)
 *
 * Synthesises retrieved data into human-readable responses.
 * Now includes a dedicated CAW (Crimes Against Women) response path.
 */

import type { SqlQueryResult } from "./text-to-sql";
import type { RagResult } from "./rag";
import type { AnalysisResult } from "./analysis-engine";
import type { QueryIntent } from "./intent-router";

export interface HybridAssistantResponse {
  answer: string;
  confidence: number;
  citations: string[];
  suggestions: string[];
  handledBy: QueryIntent;
  chartData?: unknown[];
  networkData?: { nodes: unknown[]; edges: unknown[] };
  metrics?: Record<string, string | number>;
  heatmapPoints?: Array<{ lat: number; lng: number; intensity: number; district: string; category: string }>;
  /** CAW category breakdown for bar chart */
  cawBreakdown?: Array<{ category: string; count: number }>;
}

// ── SQL response ───────────────────────────────────────────────────────────────

export function generateSqlResponse(result: SqlQueryResult, question: string): HybridAssistantResponse {
  // CAW SQL results get a richer answer
  if (result.isCaw) {
    const stateRow = result.rows[0] ?? {};
    const topDistricts = result.rows.slice(1, 4);

    const answer =
      `Crimes Against Women data (Karnataka, ${stateRow.year ?? "latest year"}): ` +
      `Total CAW cases: ${Number(stateRow.total_caw ?? 0).toLocaleString()}. ` +
      (stateRow.rape        ? `Rape: ${Number(stateRow.rape).toLocaleString()}. ` : "") +
      (stateRow.dowry_deaths ? `Dowry deaths: ${Number(stateRow.dowry_deaths).toLocaleString()}. ` : "") +
      (stateRow.cruelty_by_husband ? `Cruelty by husband (domestic violence): ${Number(stateRow.cruelty_by_husband).toLocaleString()}. ` : "") +
      (stateRow.assault_on_women ? `Assault on women: ${Number(stateRow.assault_on_women).toLocaleString()}. ` : "") +
      (stateRow.kidnapping_abduction ? `Kidnapping & abduction: ${Number(stateRow.kidnapping_abduction).toLocaleString()}. ` : "") +
      (topDistricts.length > 0
        ? `Top affected districts: ${topDistricts.map((r) => `${r.district} (${Number(r.total_caw ?? 0).toLocaleString()} cases)`).join(", ")}.`
        : "");

    return {
      answer,
      confidence: 0.95,
      citations: ["NCRB Crimes Against Women 2001-2021", "crimes_against_women table"],
      suggestions: [
        "Show CAW trend over years",
        "Which district has highest rape cases?",
        "Show dowry death statistics",
        "Compare domestic violence by district",
        "Show CAW hotspot map",
      ],
      handledBy: "caw",
      metrics: {
        totalCaw:    Number(stateRow.total_caw ?? 0).toLocaleString(),
        rape:        Number(stateRow.rape ?? 0).toLocaleString(),
        dowryDeaths: Number(stateRow.dowry_deaths ?? 0).toLocaleString(),
        cruelty:     Number(stateRow.cruelty_by_husband ?? 0).toLocaleString(),
        assault:     Number(stateRow.assault_on_women ?? 0).toLocaleString(),
        source:      "NCRB CAW Dataset 2001-2021",
      },
    };
  }

  // General SQL response
  const topRow = result.rows[0] ?? {};
  const preview = Object.entries(topRow).slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(", ");
  return {
    answer: `Found ${result.totalCount.toLocaleString()} records. Query: "${result.queryDescription}". Top result — ${preview}.`,
    confidence: 0.91,
    citations: ["SQL Database", "/api/crimes", "/api/firs"],
    suggestions: ["Show crime trends", "Detect hotspots", "Predict next month", "Show criminal network"],
    handledBy: "sql",
    metrics: { totalRecords: result.totalCount, returnedRows: result.rows.length, query: result.queryDescription },
  };
}

// ── RAG response ───────────────────────────────────────────────────────────────

export function generateRagResponse(result: RagResult, question: string): HybridAssistantResponse {
  const topChunk = result.chunks[0];
  const excerpt = topChunk ? topChunk.content.slice(0, 300) + "…" : "No relevant documents found.";
  return {
    answer: `Retrieved ${result.chunks.length} relevant document(s) from ${result.documentsSearched} indexed records.\n\n${excerpt}`,
    confidence: topChunk ? Math.min(0.95, topChunk.score + 0.5) : 0.4,
    citations: result.chunks.slice(0, 3).map((c) => c.source),
    suggestions: ["Show CAW trends", "Show crime trends", "List recent FIRs", "Show hotspots"],
    handledBy: "rag",
    metrics: { documentsSearched: result.documentsSearched, chunksRetrieved: result.chunks.length, topSource: topChunk?.source ?? "N/A" },
  };
}

// ── Analysis response ──────────────────────────────────────────────────────────

export function generateAnalysisResponse(result: AnalysisResult, question: string): HybridAssistantResponse {
  // CAW analysis — build heatmap from cawHotspots
  const heatmapPoints =
    result.type === "caw" && result.cawHotspots
      ? result.cawHotspots.map((p) => ({
          lat: p.lat, lng: p.lng,
          intensity: Math.min(1, p.score / 100),
          district: p.district,
          category: "Crimes Against Women",
        }))
      : result.type === "hotspot"
        ? (result.chartData as Array<{ lat: number; lng: number; district: string; score: number }>)?.map((p) => ({
            lat: p.lat, lng: p.lng,
            intensity: Math.min(1, p.score / 100),
            district: p.district,
            category: "Hotspot",
          }))
        : undefined;

  const suggestionMap: Record<string, string[]> = {
    caw:        ["Show CAW trend over years", "Which district has highest rape cases?", "Show dowry death statistics", "Compare domestic violence by district"],
    trend:      ["Detect hotspots", "Predict next month", "Show criminal network", "Show CAW trends"],
    hotspot:    ["Show crime trends", "Predict next month", "Show criminal network", "Show CAW hotspot map"],
    network:    ["Show crime trends", "Detect hotspots", "Predict next month", "List repeat offenders"],
    prediction: ["Show crime trends", "Detect hotspots", "Show criminal network", "Show CAW trends"],
  };

  return {
    answer: result.insight,
    confidence: 0.94,
    citations: result.type === "caw"
      ? ["NCRB Crimes Against Women 2001-2021", "Analysis Engine", "crimes_against_women table"]
      : ["Analysis Engine", "/api/analytics", "/api/network"],
    suggestions: suggestionMap[result.type] ?? [],
    handledBy: result.type === "caw" ? "caw" : "analysis",
    chartData: result.chartData as unknown[],
    networkData: result.networkData as { nodes: unknown[]; edges: unknown[] } | undefined,
    metrics: result.metrics,
    heatmapPoints,
    cawBreakdown: result.cawBreakdown,
  };
}

// ── General fallback ───────────────────────────────────────────────────────────

export function generateGeneralResponse(question: string, totalCrimes: number, totalDistricts: number): HybridAssistantResponse {
  return {
    answer: `The KSP Crime Intelligence platform tracks ${totalCrimes.toLocaleString()} crimes across ${totalDistricts} Karnataka districts. ` +
      `You can ask about: crime trends, hotspot detection, criminal networks, FIR records, predictive insights, ` +
      `or Crimes Against Women (rape, dowry deaths, domestic violence, kidnapping, assault on women).`,
    confidence: 0.82,
    citations: ["/api/dashboard"],
    suggestions: [
      "Show crimes against women",
      "Which district has highest rape cases?",
      "Show crime trends",
      "Detect hotspots",
      "Predict next month",
    ],
    handledBy: "general",
  };
}
