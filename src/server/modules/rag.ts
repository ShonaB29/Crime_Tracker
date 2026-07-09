/**
 * MODULE: RAG — Retrieval-Augmented Generation (Workflow Step 4b & 5)
 *
 * Document corpus now includes:
 *   1. FIR case narratives (general crimes)
 *   2. CAW district summaries (Crimes Against Women 2001-2021)
 *   3. NCRB-style annual report excerpts per district
 */

import { listFirs, listCrimes } from "@/server/crime-platform.server";
import { getCawRecords, getCawStateTotals, getTopCawDistricts, getLatestCawYear } from "./caw-data";

export interface RagChunk {
  source: string;
  content: string;
  score: number;
}

export interface RagResult {
  chunks: RagChunk[];
  documentsSearched: number;
}

// ── Build document corpus ──────────────────────────────────────────────────────

function buildCorpus(): Array<{ source: string; content: string }> {
  const docs: Array<{ source: string; content: string }> = [];

  // 1. FIR narratives
  const firs = listFirs({ pageSize: 100 }).items;
  for (const fir of firs) {
    docs.push({
      source: fir.firNumber,
      content: `FIR ${fir.firNumber} filed on ${fir.dateFiled.slice(0, 10)} at ${fir.policeStationName}, ${fir.districtName}. Officer: ${fir.officer}. Section: ${fir.section}. Status: ${fir.status}. Details: ${fir.caseDetails}`,
    });
  }

  // 2. Crime case summaries
  const crimes = listCrimes({ pageSize: 100 }).items;
  for (const crime of crimes) {
    docs.push({
      source: crime.caseNumber,
      content: `Case ${crime.caseNumber}: ${crime.title}. Category: ${crime.category} (${crime.crimeType}). Severity: ${crime.severity}. Status: ${crime.status}. Accused: ${crime.accusedName}. Victim: ${crime.victimName}. MO: ${crime.modusOperandi}. Officer: ${crime.investigationOfficer}.`,
    });
  }

  // 3. CAW district annual summaries — one document per district per year
  //    These are the "investigation report" style documents for women's crimes
  const latestYear = getLatestCawYear();
  const cawRecords = getCawRecords().filter((r) => r.year >= 2015); // last 7 years
  for (const r of cawRecords) {
    docs.push({
      source: `CAW-${r.district}-${r.year}`,
      content: `Crimes Against Women report for ${r.district} district, Karnataka, year ${r.year}. ` +
        `Total CAW cases: ${r.total_caw}. ` +
        `Rape: ${r.rape} cases. ` +
        `Kidnapping and abduction of women: ${r.kidnapping_abduction} cases. ` +
        `Dowry deaths: ${r.dowry_deaths} cases. ` +
        `Assault on women with intent to outrage modesty: ${r.assault_on_women} cases. ` +
        `Insult to modesty of women: ${r.insult_to_modesty} cases. ` +
        `Cruelty by husband or his relatives (domestic violence): ${r.cruelty_by_husband} cases. ` +
        `Immoral trafficking: ${r.immoral_traffic} cases. ` +
        `Dowry prohibition act violations: ${r.dowry_prohibition} cases. ` +
        `Source: NCRB Crimes Against Women dataset 2001-2021.`,
    });
  }

  // 4. Karnataka state-level CAW summary document
  const stateTotals = getCawStateTotals(latestYear);
  docs.push({
    source: `CAW-Karnataka-${latestYear}-StateSummary`,
    content: `Karnataka State Crimes Against Women Summary for ${latestYear}. ` +
      `Total CAW cases across all 31 districts: ${stateTotals.total_caw.toLocaleString()}. ` +
      `Rape cases: ${stateTotals.rape.toLocaleString()}. ` +
      `Dowry deaths: ${stateTotals.dowry_deaths.toLocaleString()}. ` +
      `Cruelty by husband (domestic violence): ${stateTotals.cruelty_by_husband.toLocaleString()}. ` +
      `Assault on women: ${stateTotals.assault_on_women.toLocaleString()}. ` +
      `Kidnapping and abduction: ${stateTotals.kidnapping_abduction.toLocaleString()}. ` +
      `Top affected districts: ${getTopCawDistricts(latestYear, 5).map((d) => d.district).join(", ")}. ` +
      `Source: NCRB Crimes Against Women in India 2001-2021 dataset.`,
  });

  return docs;
}

// ── Similarity scoring ─────────────────────────────────────────────────────────

function similarityScore(content: string, query: string): number {
  const queryWords = query.split(/\s+/).filter((w) => w.length > 3);
  if (queryWords.length === 0) return 0;
  const contentLower = content.toLowerCase();
  const matches = queryWords.filter((w) => contentLower.includes(w)).length;
  return matches / queryWords.length;
}

// ── Public entry point ─────────────────────────────────────────────────────────

export function retrieveFromRag(normalisedQuery: string, topK = 5): RagResult {
  const corpus = buildCorpus();

  const scored: RagChunk[] = corpus
    .map((doc) => ({
      source: doc.source,
      content: doc.content,
      score: similarityScore(doc.content.toLowerCase(), normalisedQuery),
    }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (scored.length === 0) {
    // Fallback: return CAW state summary + recent FIRs
    const fallback: RagChunk[] = corpus
      .filter((d) => d.source.includes("StateSummary") || d.source.startsWith("FIR"))
      .slice(0, topK)
      .map((doc) => ({ source: doc.source, content: doc.content, score: 0.1 }));
    return { chunks: fallback, documentsSearched: corpus.length };
  }

  return { chunks: scored, documentsSearched: corpus.length };
}
