/**
 * MODULE: Intent Router (Workflow Step 3 & 4)
 *
 * Classifies the user query into one of four buckets:
 *   "sql"      → Text-to-SQL  (structured counts, lists, filters)
 *   "rag"      → RAG          (document/report retrieval)
 *   "analysis" → Analysis Engine (trends, hotspots, predictions, network)
 *   "caw"      → Crimes Against Women handler (dedicated bucket)
 *   "general"  → Fallback
 */

import { callLlm } from "./llm-client";

export type QueryIntent = "sql" | "rag" | "analysis" | "caw" | "general";

export interface IntentResult {
  intent: QueryIntent;
  normalisedQuery: string;
  analysisType?: "trend" | "hotspot" | "network" | "prediction" | "correlation";
}

// ── Keyword lists ──────────────────────────────────────────────────────────────

// Crimes Against Women — checked FIRST so they are never swallowed by other buckets
const CAW_KEYWORDS = [
  "women",
  "woman",
  "female",
  "girl",
  "rape",
  "sexual assault",
  "dowry",
  "dowry death",
  "domestic violence",
  "cruelty by husband",
  "kidnapping of women",
  "abduction",
  "molestation",
  "eve teasing",
  "insult to modesty",
  "immoral traffic",
  "trafficking",
  "acid attack",
  "stalking",
  "crimes against women",
  "violence against women",
  "gender crime",
  "assault on women",
  "outraging modesty",
  "indecent representation",
];

const SQL_KEYWORDS = [
  "how many",
  "count",
  "list",
  "show",
  "find",
  "search",
  "top",
  "highest",
  "lowest",
  "total",
  "fir",
  "firs",
  "case number",
  "case",
  "cases",
  "case/",
  "fir/",
  "district",
  "officer",
  "accused",
  "victim",
  "status",
  "category",
  "severity",
  "weapon",
  "arrest",
  "court",
  "station",
  "record",
  "records",
  "ipc",
  "section",
  "open",
  "solved",
  "pending",
  "critical",
  "high",
  "medium",
  "low",
  "theft",
  "murder",
  "assault",
  "fraud",
  "robbery",
  "burglary",
  "narcotics",
  "cyber",
  "recent",
  "latest",
  "today",
  "this month",
  "last month",
  "unsolved",
  "under investigation",
  "charge sheet",
  "convicted",
  "acquitted",
  "bail",
  "wanted",
  "arrested",
  "repeat",
  "modus",
  "knife",
  "firearm",
  "property",
  "violent",
  "economic",
  "organized",
  "si",
  "inspector",
  "bagalkote",
  "ballari",
  "belagavi",
  "bengaluru rural",
  "bengaluru urban",
  "bidar",
  "chamarajanagar",
  "chikkaballapura",
  "chikkamagaluru",
  "chitradurga",
  "dakshina kannada",
  "davanagere",
  "dharwad",
  "gadag",
  "hassan",
  "haveri",
  "kalaburagi",
  "kodagu",
  "kolar",
  "koppal",
  "mandya",
  "mysuru",
  "raichur",
  "ramanagara",
  "shivamogga",
  "tumakuru",
  "udupi",
  "uttara kannada",
  "vijayapura",
  "yadgir",
  "vijayanagara",
  "mysore",
];

const RAG_KEYWORDS = [
  "report",
  "document",
  "summary",
  "investigation",
  "legal",
  "pdf",
  "detail",
  "description",
  "notes",
  "evidence",
  "charge sheet",
  "case summary",
  "case detail",
  "file",
  "census",
];

const ANALYSIS_KEYWORDS = [
  "trend",
  "forecast",
  "predict",
  "hotspot",
  "heat",
  "network",
  "relationship",
  "pattern",
  "spike",
  "anomaly",
  "risk score",
  "repeat offender",
  "modus operandi",
  "cluster",
  "year over year",
  "monthly",
  "annual",
  "increase",
  "decrease",
  "correlation",
  "vs",
  "compare",
];

function countMatches(lower: string, keywords: string[]): number {
  return keywords.filter((kw) => lower.includes(kw)).length;
}

export async function routeIntent(question: string): Promise<IntentResult> {
  const normalisedQuery = question.trim().toLowerCase();

  // Try LLM classification first
  try {
    const prompt = `You are a query classifier for a Crime Intelligence platform.
Analyze the user's query and classify it into one of these intents:
- "sql": structured questions asking for statistics, counts, trends, totals, averages, sorting (top/bottom), district comparison, or lists of records (e.g. "how many crimes in Belagavi", "top 10 districts by crime count", "average crimes per district", "show theft cases in Mysore", "monthly crime trend of Belagavi").
- "rag": unstructured questions asking about case narratives, details of what happened, evidence summaries, officer reports, descriptions, legal sections/IPC sections context, or Census 2011 documentation summaries (e.g. "what are the case details for CASE/K01", "summarize investigation notes for FIR 123", "explain the evidence against Rajesh").
- "analysis": complex analysis such as forecasting, linear regression predictions, geospatial hotspots/heatmaps, or co-offending network relationships (e.g. "predict crimes next month", "detect hotspots", "show repeat offender networks", "correlation of literacy vs crime", "literacy vs crime rate correlation").
- "caw": questions relating directly to Crimes Against Women (rape, dowry deaths, domestic violence, molestation).
- "general": greetings, fallback, or non-analytical queries.

If the intent is "analysis", extract one of the following analysis types: "trend", "hotspot", "network", "prediction", "correlation". Otherwise, set analysisType to null.

You MUST respond ONLY with a JSON object in this format:
{
  "intent": "sql" | "rag" | "analysis" | "caw" | "general",
  "analysisType": "trend" | "hotspot" | "network" | "prediction" | "correlation" | null
}

Query: "${question}"
Response:`;

    const llmOutput = await callLlm(prompt);
    if (llmOutput) {
      // Find JSON block if LLM wrapped in markdown codeblock
      const jsonStart = llmOutput.indexOf("{");
      const jsonEnd = llmOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = llmOutput.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === "object" && parsed.intent) {
          const intent = parsed.intent as QueryIntent;
          const result: IntentResult = { intent, normalisedQuery };
          if (parsed.analysisType) {
            result.analysisType = parsed.analysisType;
          }
          return result;
        }
      }
    }
  } catch (e: any) {
    console.warn("[Intent Router] LLM classification unavailable, using offline heuristics:", e.message || String(e));
  }

  // Offline Heuristics Fallback
  // CAW check runs FIRST — highest priority
  const cawScore = countMatches(normalisedQuery, CAW_KEYWORDS);
  if (cawScore > 0) {
    return { intent: "caw", normalisedQuery };
  }

  const sqlScore = countMatches(normalisedQuery, SQL_KEYWORDS);
  const ragScore = countMatches(normalisedQuery, RAG_KEYWORDS);
  const analysisScore = countMatches(normalisedQuery, ANALYSIS_KEYWORDS);

  if (analysisScore >= sqlScore && analysisScore >= ragScore && analysisScore > 0) {
    let analysisType: IntentResult["analysisType"] = "trend";
    if (
      normalisedQuery.includes("hotspot") ||
      normalisedQuery.includes("heat") ||
      normalisedQuery.includes("cluster")
    ) {
      analysisType = "hotspot";
    } else if (normalisedQuery.includes("network") || normalisedQuery.includes("relationship")) {
      analysisType = "network";
    } else if (normalisedQuery.includes("predict") || normalisedQuery.includes("forecast")) {
      analysisType = "prediction";
    } else if (
      normalisedQuery.includes("correlation") ||
      normalisedQuery.includes("literacy") ||
      normalisedQuery.includes("demographic") ||
      normalisedQuery.includes("ratio") ||
      normalisedQuery.includes("density") ||
      normalisedQuery.includes("vs") ||
      normalisedQuery.includes("compare")
    ) {
      analysisType = "correlation";
    }
    return { intent: "analysis", normalisedQuery, analysisType };
  }

  if (ragScore >= sqlScore && ragScore > 0) return { intent: "rag", normalisedQuery };
  if (sqlScore > 0) return { intent: "sql", normalisedQuery };
  return { intent: "general", normalisedQuery };
}
