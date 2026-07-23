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
  heatmapPoints?: Array<{
    lat: number;
    lng: number;
    intensity: number;
    district: string;
    category: string;
  }>;
  cawBreakdown?: Array<{ category: string; count: number }>;
  /** Rows + columns for the results table in AssistantPage */
  tableRows?: Record<string, unknown>[];
  tableColumns?: string[];
  queryDescription?: string;
  executionTimeMs?: number;
  rowsReturned?: number;
  showSqlDebug?: boolean;
}

import { callLlm } from "./llm-client";

function isSqlDebugEnabled(): boolean {
  return (
    process.env.SHOW_SQL_DEBUG === "true" ||
    process.env.VITE_SHOW_SQL_DEBUG === "true"
  );
}

function formatDatabaseResult(rows: Record<string, unknown>[], columns?: string[]): string {
  if (!rows || rows.length === 0) {
    return "*No records found (empty result set).*";
  }

  const cols = columns && columns.length > 0 ? columns : Object.keys(rows[0]);

  if (rows.length > 10) {
    const preview = rows.slice(0, 10);
    return (
      `*Showing first 10 of ${rows.length} rows:*\n\n` +
      `| ${cols.join(" | ")} |\n` +
      `| ${cols.map(() => "---").join(" | ")} |\n` +
      preview
        .map((row) => {
          const rowValues = cols.map((col) => {
            const val = row[col];
            if (val === null || val === undefined) return "NULL";
            if (typeof val === "boolean") return val ? "true" : "false";
            if (typeof val === "object") return JSON.stringify(val);
            return String(val);
          });
          return `| ${rowValues.join(" | ")} |`;
        })
        .join("\n")
    );
  }

  let table = `| ${cols.join(" | ")} |\n`;
  table += `| ${cols.map(() => "---").join(" | ")} |\n`;
  for (const row of rows) {
    const rowValues = cols.map((col) => {
      const val = row[col];
      if (val === null || val === undefined) return "NULL";
      if (typeof val === "boolean") return val ? "true" : "false";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    });
    table += `| ${rowValues.join(" | ")} |\n`;
  }
  return table.trim();
}

async function generateExplanation(question: string, sql: string, rows: any[]): Promise<string> {
  const hasLlm = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!hasLlm) {
    if (sql.toLowerCase().includes("count")) {
      return "This query counts the records matching your criteria across official police records.";
    }
    if (sql.toLowerCase().includes("group by")) {
      return "This summary aggregates data across categories and districts to compare counts and statistical distribution.";
    }
    if (sql.toLowerCase().includes("join")) {
      return "This result combines information across cases, police stations, and incident ledgers for complete visibility.";
    }
    return "This result lists records matching the requested filters.";
  }

  try {
    const prompt = `You are a Crime Intelligence Assistant.
The user asked: "${question}"
The database returned this result:
${JSON.stringify(rows.slice(0, 5))}

Write a simple, concise natural-language explanation (1-2 sentences max) summarizing what the results mean for an investigator. Do not reference SQL syntax, database queries, code, or internal database table names.
Response:`;
    const explanation = await callLlm(prompt);
    if (!explanation) {
      return "This summary aggregates incident records matching your search parameters.";
    }
    return explanation.trim();
  } catch (e) {
    return "This query retrieves records matching the specified filters.";
  }
}

// ── SQL response ─────────────────────────────────────────────────────────────

export async function generateSqlResponse(
  result: SqlQueryResult,
  question: string,
): Promise<HybridAssistantResponse> {
  const debugMode = isSqlDebugEnabled();

  if (result.error) {
    let finalAnswer = `I encountered an issue retrieving data for your inquiry.`;
    if (debugMode) {
      finalAnswer +=
        `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n` +
        `**[Developer Mode] Error**\n\`${result.error}\``;
    }
    return {
      answer: finalAnswer,
      confidence: 0.5,
      citations: ["Database system error handler"],
      suggestions: ["Show open cases", "Show crime trends"],
      handledBy: "sql",
      queryDescription: result.queryDescription,
      executionTimeMs: result.executionTimeMs,
      rowsReturned: result.rowsReturned,
      showSqlDebug: debugMode,
    };
  }

  // CAW SQL results
  if (result.isCaw) {
    const stateRow = result.rows[0] ?? {};
    const topDistricts = result.rows.slice(1, 4);
    const answer =
      `Crimes Against Women data (Karnataka, ${stateRow.year ?? "latest year"}): ` +
      `Total CAW cases: ${Number(stateRow.total_caw ?? 0).toLocaleString()}. ` +
      (stateRow.rape ? `Rape: ${Number(stateRow.rape).toLocaleString()}. ` : "") +
      (stateRow.dowry_deaths
        ? `Dowry deaths: ${Number(stateRow.dowry_deaths).toLocaleString()}. `
        : "") +
      (stateRow.cruelty_by_husband
        ? `Cruelty by husband (domestic violence): ${Number(stateRow.cruelty_by_husband).toLocaleString()}. `
        : "") +
      (stateRow.assault_on_women
        ? `Assault on women: ${Number(stateRow.assault_on_women).toLocaleString()}. `
        : "") +
      (stateRow.kidnapping_abduction
        ? `Kidnapping & abduction: ${Number(stateRow.kidnapping_abduction).toLocaleString()}. `
        : "") +
      (topDistricts.length > 0
        ? `Top affected districts: ${topDistricts.map((r) => `${r.district} (${Number(r.total_caw ?? 0).toLocaleString()} cases)`).join(", ")}.`
        : "");

    const explanation = await generateExplanation(question, result.queryDescription, result.rows);
    let finalAnswer = answer;
    if (explanation) {
      finalAnswer += `\n\n${explanation}`;
    }

    if (debugMode) {
      const formattedResult = formatDatabaseResult(result.rows, result.columns);
      finalAnswer +=
        `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n` +
        `**[Developer Mode] Execution Result**\n${formattedResult}`;
    }

    return {
      answer: finalAnswer,
      confidence: 0.95,
      citations: ["NCRB Crimes Against Women 2001-2021", "Crimes Against Women Ledger"],
      suggestions: [
        "Show CAW trend over years",
        "Which district has highest rape cases?",
        "Show dowry death statistics",
        "Compare domestic violence by district",
        "Show CAW hotspot map",
      ],
      handledBy: "caw",
      metrics: {
        totalCaw: Number(stateRow.total_caw ?? 0).toLocaleString(),
        rape: Number(stateRow.rape ?? 0).toLocaleString(),
        dowryDeaths: Number(stateRow.dowry_deaths ?? 0).toLocaleString(),
        cruelty: Number(stateRow.cruelty_by_husband ?? 0).toLocaleString(),
        assault: Number(stateRow.assault_on_women ?? 0).toLocaleString(),
        source: "NCRB CAW Dataset 2001-2021",
        explanation,
      },
      tableRows: result.rows,
      tableColumns: result.columns,
      queryDescription: result.queryDescription,
      executionTimeMs: result.executionTimeMs,
      rowsReturned: result.rowsReturned,
      showSqlDebug: debugMode,
    };
  }

  // General SQL — build natural language answer
  const n = result.totalCount;
  const shown = result.rows.length;
  const firstRow = result.rows[0] ?? {};

  let answer = "";
  if ("totalCrimes" in firstRow || "total_crimes" in firstRow) {
    const countVal = Number(firstRow.totalCrimes ?? firstRow.total_crimes ?? 0);
    answer = `Found ${countVal.toLocaleString()} matching crime record(s).`;
  } else if ("totalFirs" in firstRow) {
    answer = `There are ${Number(firstRow.totalFirs).toLocaleString()} FIR records across ${firstRow.districts} districts.`;
  } else if ("crimes" in firstRow && "district" in firstRow) {
    const top3 = result.rows
      .slice(0, 3)
      .map((r) => `${r.district} (${r.crimes} crimes)`)
      .join(", ");
    answer = `Found ${n} districts. Top 3 by crime count: ${top3}.`;
  } else if ("name" in firstRow && "value" in firstRow) {
    const top3 = result.rows
      .slice(0, 3)
      .map((r) => `${r.name}: ${r.value}`)
      .join(", ");
    answer = `Crime category breakdown — ${top3}. Total ${n} categories.`;
  } else if ("caseNumber" in firstRow) {
    const top = firstRow;
    answer =
      `Found ${n.toLocaleString()} matching crime record(s). ` +
      `Top match: ${top.caseNumber} — ${top.title ?? top.category ?? "Incident"} in ${top.districtName ?? top.district}. ` +
      `Status: ${top.status}, Severity: ${top.severity}.`;
    if (shown > 1) answer += ` See the results table below for complete details.`;
  } else if ("fir_number" in firstRow || "firNumber" in firstRow) {
    const top = firstRow;
    const firNum = top.fir_number ?? top.firNumber;
    const distName = top.district_name ?? top.districtName ?? top.district ?? "";
    answer =
      `Found ${n.toLocaleString()} matching FIR record(s). ` +
      `Latest record: ${firNum}${distName ? ` in ${distName}` : ""}. ` +
      `Status: ${top.crime_status ?? top.status ?? "Registered"}, Section: ${top.ipc_section ?? top.section ?? "N/A"}.`;
    if (shown > 1) answer += ` See the results table below for matching records.`;
  } else {
    answer = `Found ${n.toLocaleString()} matching record(s).`;
  }

  const explanation = await generateExplanation(question, result.queryDescription, result.rows);
  let finalAnswer = answer;
  if (explanation) {
    finalAnswer += `\n\n${explanation}`;
  }

  if (debugMode) {
    const formattedResult = formatDatabaseResult(result.rows, result.columns);
    finalAnswer +=
      `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n` +
      `**[Developer Mode] Execution Result**\n${formattedResult}`;
  }

  return {
    answer: finalAnswer,
    confidence: 0.92,
    citations: ["Karnataka Police Crime Database"],
    suggestions: [
      "Show open cases",
      "Show critical crimes",
      "Show repeat offenders",
      "List recent FIRs",
      "Show crimes in Bengaluru Urban",
      "Show crime trends",
    ],
    handledBy: "sql",
    metrics: { totalRecords: n, showing: shown, query: result.queryDescription, explanation },
    tableRows: result.rows,
    tableColumns: result.columns,
    queryDescription: result.queryDescription,
    executionTimeMs: result.executionTimeMs,
    rowsReturned: result.rowsReturned,
    showSqlDebug: debugMode,
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
    metrics: {
      documentsSearched: result.documentsSearched,
      chunksRetrieved: result.chunks.length,
      topSource: topChunk?.source ?? "N/A",
    },
  };
}

// ── Analysis response ──────────────────────────────────────────────────────────

export function generateAnalysisResponse(
  result: AnalysisResult,
  question: string,
): HybridAssistantResponse {
  // CAW analysis — build heatmap from cawHotspots
  const heatmapPoints =
    result.type === "caw" && result.cawHotspots
      ? result.cawHotspots.map((p) => ({
          lat: p.lat,
          lng: p.lng,
          intensity: Math.min(1, p.score / 100),
          district: p.district,
          category: "Crimes Against Women",
        }))
      : result.type === "hotspot"
        ? (
            result.chartData as Array<{ lat: number; lng: number; district: string; score: number }>
          )?.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            intensity: Math.min(1, p.score / 100),
            district: p.district,
            category: "Hotspot",
          }))
        : undefined;

  const suggestionMap: Record<string, string[]> = {
    caw: [
      "Show CAW trend over years",
      "Which district has highest rape cases?",
      "Show dowry death statistics",
      "Compare domestic violence by district",
    ],
    trend: ["Detect hotspots", "Predict next month", "Show criminal network", "Show CAW trends"],
    hotspot: [
      "Show crime trends",
      "Predict next month",
      "Show criminal network",
      "Show CAW hotspot map",
    ],
    network: [
      "Show crime trends",
      "Detect hotspots",
      "Predict next month",
      "List repeat offenders",
    ],
    prediction: [
      "Show crime trends",
      "Detect hotspots",
      "Show criminal network",
      "Show CAW trends",
    ],
  };

  return {
    answer: result.insight,
    confidence: 0.94,
    citations:
      result.type === "caw"
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

export function generateGeneralResponse(
  question: string,
  totalCrimes: number,
  totalDistricts: number,
): HybridAssistantResponse {
  return {
    answer:
      `The KSP Crime Intelligence platform tracks ${totalCrimes.toLocaleString()} crimes across ${totalDistricts} Karnataka districts. ` +
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
