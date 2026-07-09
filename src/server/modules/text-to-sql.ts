/**
 * MODULE: Text-to-SQL (Workflow Step 4a & 5)
 *
 * Translates natural-language questions into structured dataset queries.
 * Handles both general crime data AND Crimes Against Women (CAW) dataset.
 *
 * Datasets covered:
 *   - Crime in India 2001+ (general crimes, FIRs, districts)
 *   - Crimes Against Women 2001-2021 (rape, dowry, assault, cruelty, etc.)
 */

import {
  listCrimes,
  listFirs,
  getDistrictSummaries,
  getDashboardSummary,
} from "@/server/crime-platform.server";

import {
  getCawRecords,
  getCawByYear,
  getCawStateTotals,
  getTopCawDistricts,
  getLatestCawYear,
  getCawByDistrict,
} from "./caw-data";

export interface SqlQueryResult {
  queryDescription: string;
  rows: Record<string, unknown>[];
  totalCount: number;
  /** Set to true when result comes from the CAW dataset */
  isCaw?: boolean;
}

// ── CAW query handler ──────────────────────────────────────────────────────────

function handleCawQuery(q: string): SqlQueryResult {
  const latestYear = getLatestCawYear();

  // Specific sub-category queries
  if (q.includes("rape")) {
    const rows = getTopCawDistricts(latestYear, 10).map((r) => ({
      district: r.district, year: r.year, rape_cases: r.rape, total_caw: r.total_caw,
    }));
    return {
      queryDescription: `SELECT district, year, rape, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY rape DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  if (q.includes("dowry")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.dowry_deaths - a.dowry_deaths)
      .map((r) => ({ district: r.district, year: r.year, dowry_deaths: r.dowry_deaths, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, dowry_deaths, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY dowry_deaths DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  if (q.includes("cruelty") || q.includes("husband") || q.includes("domestic")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.cruelty_by_husband - a.cruelty_by_husband)
      .map((r) => ({ district: r.district, year: r.year, cruelty_by_husband: r.cruelty_by_husband, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, cruelty_by_husband, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY cruelty_by_husband DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  if (q.includes("kidnap") || q.includes("abduction") || q.includes("trafficking")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.kidnapping_abduction - a.kidnapping_abduction)
      .map((r) => ({ district: r.district, year: r.year, kidnapping_abduction: r.kidnapping_abduction, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, kidnapping_abduction, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY kidnapping_abduction DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  if (q.includes("assault") || q.includes("molestation") || q.includes("modesty")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.assault_on_women - a.assault_on_women)
      .map((r) => ({ district: r.district, year: r.year, assault_on_women: r.assault_on_women, insult_to_modesty: r.insult_to_modesty, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, assault_on_women, insult_to_modesty, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY assault_on_women DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  // District-specific CAW query
  const districtMatch = getCawRecords()
    .map((r) => r.district.toLowerCase())
    .find((d) => q.includes(d));
  if (districtMatch) {
    const rows = getCawByDistrict(districtMatch)
      .sort((a, b) => b.year - a.year)
      .slice(0, 10)
      .map((r) => ({
        district: r.district, year: r.year, rape: r.rape, dowry_deaths: r.dowry_deaths,
        cruelty_by_husband: r.cruelty_by_husband, assault_on_women: r.assault_on_women, total_caw: r.total_caw,
      }));
    return {
      queryDescription: `SELECT * FROM crimes_against_women WHERE district='${districtMatch}' ORDER BY year DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
    };
  }

  // Default: top districts by total CAW in latest year
  const stateTotals = getCawStateTotals(latestYear);
  const topDistricts = getTopCawDistricts(latestYear, 10).map((r) => ({
    district: r.district,
    year: r.year,
    rape: r.rape,
    dowry_deaths: r.dowry_deaths,
    cruelty_by_husband: r.cruelty_by_husband,
    assault_on_women: r.assault_on_women,
    kidnapping_abduction: r.kidnapping_abduction,
    total_caw: r.total_caw,
  }));

  return {
    queryDescription: `SELECT district, rape, dowry_deaths, cruelty_by_husband, assault_on_women, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY total_caw DESC LIMIT 10`,
    rows: [
      // First row = Karnataka state summary
      {
        district: "Karnataka (State Total)",
        year: latestYear,
        rape: stateTotals.rape,
        dowry_deaths: stateTotals.dowry_deaths,
        cruelty_by_husband: stateTotals.cruelty_by_husband,
        assault_on_women: stateTotals.assault_on_women,
        kidnapping_abduction: stateTotals.kidnapping_abduction,
        total_caw: stateTotals.total_caw,
      },
      ...topDistricts,
    ],
    totalCount: getCawRecords().filter((r) => r.year === latestYear).length,
    isCaw: true,
  };
}

// ── General crime query handler ────────────────────────────────────────────────

export function executeTextToSql(normalisedQuery: string, intent?: string): SqlQueryResult {
  // Route CAW queries to dedicated handler
  if (intent === "caw") return handleCawQuery(normalisedQuery);

  if (normalisedQuery.includes("fir")) {
    const result = listFirs({ pageSize: 10 });
    return {
      queryDescription: "SELECT * FROM firs ORDER BY date_filed DESC LIMIT 10",
      rows: result.items as unknown as Record<string, unknown>[],
      totalCount: result.total,
    };
  }

  if (normalisedQuery.includes("district")) {
    const districts = getDistrictSummaries();
    const sorted = [...districts].sort((a, b) => b.crimeCount - a.crimeCount).slice(0, 10);
    return {
      queryDescription: "SELECT name, crime_count, fir_count, hotspot_count FROM districts ORDER BY crime_count DESC LIMIT 10",
      rows: sorted.map((d) => ({ id: d.id, name: d.name, crimeCount: d.crimeCount, firCount: d.firCount, hotspotCount: d.hotspotCount })),
      totalCount: districts.length,
    };
  }

  if (normalisedQuery.includes("accused") || normalisedQuery.includes("repeat offender")) {
    const result = listCrimes({ pageSize: 10, sortBy: "repeatOffender", sortDir: "desc" });
    return {
      queryDescription: "SELECT case_number, accused_name, repeat_offender, modus_operandi FROM crimes WHERE repeat_offender = true LIMIT 10",
      rows: result.items.map((c) => ({
        caseNumber: c.caseNumber, accusedName: c.accusedName,
        repeatOffender: c.repeatOffender, modusOperandi: c.modusOperandi, district: c.districtName,
      })),
      totalCount: result.total,
    };
  }

  const dashboard = getDashboardSummary();
  if (normalisedQuery.includes("category") || normalisedQuery.includes("type")) {
    return {
      queryDescription: "SELECT category, COUNT(*) as count FROM crimes GROUP BY category ORDER BY count DESC",
      rows: dashboard.crimeCategories as unknown as Record<string, unknown>[],
      totalCount: dashboard.crimeCategories.length,
    };
  }

  const result = listCrimes({ pageSize: 10, sortBy: "crimeTime", sortDir: "desc" });
  return {
    queryDescription: "SELECT id, case_number, title, district, category, status, severity FROM crimes ORDER BY crime_time DESC LIMIT 10",
    rows: result.items.map((c) => ({
      caseNumber: c.caseNumber, title: c.title, district: c.districtName,
      category: c.category, status: c.status, severity: c.severity, crimeTime: c.crimeTime,
    })),
    totalCount: result.total,
  };
}
