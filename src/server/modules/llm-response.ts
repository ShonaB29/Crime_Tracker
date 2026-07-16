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
  cawBreakdown?: Array<{ category: string; count: number }>;
  /** Rows + columns for the results table in AssistantPage */
  tableRows?: Record<string, unknown>[];
  tableColumns?: string[];
}

// ── SQL response ─────────────────────────────────────────────────────────────

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
      suggestions: ["Show CAW trend over years", "Which district has highest rape cases?", "Show dowry death statistics", "Compare domestic violence by district", "Show CAW hotspot map"],
      handledBy: "caw",
      metrics: { totalCaw: Number(stateRow.total_caw ?? 0).toLocaleString(), rape: Number(stateRow.rape ?? 0).toLocaleString(), dowryDeaths: Number(stateRow.dowry_deaths ?? 0).toLocaleString(), cruelty: Number(stateRow.cruelty_by_husband ?? 0).toLocaleString(), assault: Number(stateRow.assault_on_women ?? 0).toLocaleString(), source: "NCRB CAW Dataset 2001-2021" },
      tableRows: result.rows,
      tableColumns: result.columns,
    };
  }

  // General SQL — build a natural-language answer from the rows
  const n = result.totalCount;
  const shown = result.rows.length;
  const firstRow = result.rows[0] ?? {};

  // Craft a sentence based on what the query returned
  let answer = "";
  if ("totalCrimes" in firstRow) {
    answer = `The platform has ${Number(firstRow.totalCrimes).toLocaleString()} total crime records. ` +
      `Active cases: ${Number(firstRow.activeCases).toLocaleString()}, ` +
      `Solved: ${Number(firstRow.solvedCases).toLocaleString()}, ` +
      `Pending: ${Number(firstRow.pendingCases).toLocaleString()}, ` +
      `Repeat offenders: ${Number(firstRow.repeatOffenders).toLocaleString()}.`;
  } else if ("totalFirs" in firstRow) {
    answer = `There are ${Number(firstRow.totalFirs).toLocaleString()} FIR records across ${firstRow.districts} districts.`;
  } else if ("crimes" in firstRow && "district" in firstRow) {
    const top3 = result.rows.slice(0, 3).map((r) => `${r.district} (${r.crimes} crimes)`).join(", ");
    answer = `Found ${n} districts. Top 3 by crime count: ${top3}.`;
  } else if ("name" in firstRow && "value" in firstRow) {
    const top3 = result.rows.slice(0, 3).map((r) => `${r.name}: ${r.value}`).join(", ");
    answer = `Crime category breakdown — ${top3}. Total ${n} categories.`;
  } else if ("caseNumber" in firstRow) {
    const top = firstRow;
    answer = `Found ${n.toLocaleString()} matching crime records. ` +
      `Top result: ${top.caseNumber} — ${top.title ?? top.category} in ${top.district}. ` +
      `Status: ${top.status}, Severity: ${top.severity}.`;
    if (shown > 1) answer += ` Showing ${shown} records in the table below.`;
  } else if ("firNumber" in firstRow) {
    const top = firstRow;
    answer = `Found ${n.toLocaleString()} FIR records. ` +
      `Latest: ${top.firNumber} from ${top.district}, filed ${top.dateFiled}. ` +
      `Officer: ${top.officer}, Status: ${top.status}, Section: ${top.section}.`;
    if (shown > 1) answer += ` Showing ${shown} records in the table below.`;
  } else {
    const preview = Object.entries(firstRow).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(", ");
    answer = `Found ${n.toLocaleString()} records. Top result — ${preview}.`;
  }

  return {
    answer,
    confidence: 0.92,
    citations: ["Crime Database", "/api/crimes", "/api/firs"],
    suggestions: [
      "Show open cases", "Show critical crimes", "Show repeat offenders",
      "List recent FIRs", "Show crimes in Bengaluru Urban", "Show crime trends",
    ],
    handledBy: "sql",
    metrics: { totalRecords: n, showing: shown, query: result.queryDescription },
    tableRows: result.rows,
    tableColumns: result.columns,
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
