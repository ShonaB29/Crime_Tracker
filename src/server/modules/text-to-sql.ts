/**
 * MODULE: Text-to-SQL (Workflow Step 4a & 5)
 *
 * Translates natural-language questions into structured dataset queries.
 * Covers every field visible in the Crimes page and FIR Records page:
 *
 * Crimes page fields:
 *   caseNumber, title, district, category, crimeType, severity, status,
 *   weapon, investigationOfficer, arrestStatus, courtStatus,
 *   repeatOffender, modusOperandi, victimName, accusedName, crimeTime
 *
 * FIR Records page fields:
 *   firNumber, districtName, policeStationName, officer, status,
 *   dateFiled, section, caseDetails
 */

import {
  listCrimes,
  listFirs,
  getDistrictSummaries,
  getDashboardSummary,
  getData,
} from "@/server/crime-platform.server";

import {
  getCawRecords,
  getCawStateTotals,
  getTopCawDistricts,
  getLatestCawYear,
  getCawByDistrict,
} from "./caw-data";
import { getCrimeIndiaAnnualRecords } from "./crime-india-data";

export interface SqlQueryResult {
  queryDescription: string;
  rows: Record<string, unknown>[];
  totalCount: number;
  isCaw?: boolean;
  /** Column headers for the results table */
  columns?: string[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

const DISTRICT_NAMES = [
  "bagalkote","ballari","belagavi","bengaluru rural","bengaluru urban","bidar",
  "chamarajanagar","chikkaballapura","chikkamagaluru","chitradurga","dakshina kannada",
  "davanagere","dharwad","gadag","hassan","haveri","kalaburagi","kodagu","kolar",
  "koppal","mandya","mysuru","raichur","ramanagara","shivamogga","tumakuru","udupi",
  "uttara kannada","vijayapura","yadgir","vijayanagara",
];

function detectDistrict(q: string): string | undefined {
  const normalised = q.replaceAll("mysore", "mysuru");
  return DISTRICT_NAMES.find((d) => normalised.includes(d));
}

// ── CAW query handler ─────────────────────────────────────────────────────────

function handleCawQuery(q: string): SqlQueryResult {
  const latestYear = getLatestCawYear();

  if (q.includes("rape")) {
    const rows = getTopCawDistricts(latestYear, 10).map((r) => ({
      district: r.district, year: r.year, rape_cases: r.rape, total_caw: r.total_caw,
    }));
    return {
      queryDescription: `SELECT district, year, rape, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY rape DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "rape_cases", "total_caw"],
    };
  }

  if (q.includes("dowry")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.dowry_deaths - a.dowry_deaths)
      .map((r) => ({ district: r.district, year: r.year, dowry_deaths: r.dowry_deaths, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, dowry_deaths, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY dowry_deaths DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "dowry_deaths", "total_caw"],
    };
  }

  if (q.includes("cruelty") || q.includes("husband") || q.includes("domestic")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.cruelty_by_husband - a.cruelty_by_husband)
      .map((r) => ({ district: r.district, year: r.year, cruelty_by_husband: r.cruelty_by_husband, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, cruelty_by_husband, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY cruelty_by_husband DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "cruelty_by_husband", "total_caw"],
    };
  }

  if (q.includes("kidnap") || q.includes("abduction") || q.includes("trafficking")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.kidnapping_abduction - a.kidnapping_abduction)
      .map((r) => ({ district: r.district, year: r.year, kidnapping_abduction: r.kidnapping_abduction, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, kidnapping_abduction, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY kidnapping_abduction DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "kidnapping_abduction", "total_caw"],
    };
  }

  if (q.includes("assault") || q.includes("molestation") || q.includes("modesty")) {
    const rows = getTopCawDistricts(latestYear, 10)
      .sort((a, b) => b.assault_on_women - a.assault_on_women)
      .map((r) => ({ district: r.district, year: r.year, assault_on_women: r.assault_on_women, insult_to_modesty: r.insult_to_modesty, total_caw: r.total_caw }));
    return {
      queryDescription: `SELECT district, year, assault_on_women, insult_to_modesty, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY assault_on_women DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "assault_on_women", "insult_to_modesty", "total_caw"],
    };
  }

  const districtMatch = getCawRecords().map((r) => r.district.toLowerCase()).find((d) => q.includes(d));
  if (districtMatch) {
    const rows = getCawByDistrict(districtMatch)
      .sort((a, b) => b.year - a.year).slice(0, 10)
      .map((r) => ({
        district: r.district, year: r.year, rape: r.rape, dowry_deaths: r.dowry_deaths,
        cruelty_by_husband: r.cruelty_by_husband, assault_on_women: r.assault_on_women, total_caw: r.total_caw,
      }));
    return {
      queryDescription: `SELECT * FROM crimes_against_women WHERE district='${districtMatch}' ORDER BY year DESC LIMIT 10`,
      rows, totalCount: rows.length, isCaw: true,
      columns: ["district", "year", "rape", "dowry_deaths", "cruelty_by_husband", "assault_on_women", "total_caw"],
    };
  }

  const stateTotals = getCawStateTotals(latestYear);
  const topDistricts = getTopCawDistricts(latestYear, 10).map((r) => ({
    district: r.district, year: r.year, rape: r.rape, dowry_deaths: r.dowry_deaths,
    cruelty_by_husband: r.cruelty_by_husband, assault_on_women: r.assault_on_women,
    kidnapping_abduction: r.kidnapping_abduction, total_caw: r.total_caw,
  }));
  return {
    queryDescription: `SELECT district, rape, dowry_deaths, cruelty_by_husband, assault_on_women, total_caw FROM crimes_against_women WHERE year=${latestYear} ORDER BY total_caw DESC LIMIT 10`,
    rows: [
      { district: "Karnataka (State Total)", year: latestYear, rape: stateTotals.rape, dowry_deaths: stateTotals.dowry_deaths, cruelty_by_husband: stateTotals.cruelty_by_husband, assault_on_women: stateTotals.assault_on_women, kidnapping_abduction: stateTotals.kidnapping_abduction, total_caw: stateTotals.total_caw },
      ...topDistricts,
    ],
    totalCount: getCawRecords().filter((r) => r.year === latestYear).length,
    isCaw: true,
    columns: ["district", "year", "rape", "dowry_deaths", "cruelty_by_husband", "assault_on_women", "kidnapping_abduction", "total_caw"],
  };
}

// ── Crime record query handler ────────────────────────────────────────────────

function handleCrimeQuery(q: string): SqlQueryResult {
  // ── 1. Specific case number lookup  e.g. "CASE/K001/000042"
  const caseMatch = q.match(/case\/[a-z0-9]+\/\d+/i);
  if (caseMatch) {
    const result = listCrimes({ search: caseMatch[0].toUpperCase(), pageSize: 5 });
    const rows = result.items.map(crimeRow);
    return {
      queryDescription: `SELECT * FROM crimes WHERE case_number ILIKE '%${caseMatch[0]}%'`,
      rows, totalCount: result.total,
      columns: CRIME_COLS,
    };
  }

  // ── 2. Status filters
  if (q.includes("open case") || q.includes("open crimes") || q.includes("all open")) {
    const result = listCrimes({ status: "Open", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE status='Open' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("solved") && !q.includes("unsolved")) {
    const result = listCrimes({ status: "Solved", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE status='Solved' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("unsolved") || q.includes("pending") || q.includes("under investigation")) {
    const result = listCrimes({ status: "Under Investigation", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE status='Under Investigation' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("filed in court") || q.includes("charge sheet")) {
    const result = listCrimes({ status: "Filed In Court", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE status='Filed In Court' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("forensic") || q.includes("pending forensic")) {
    const result = listCrimes({ status: "Pending Forensic", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE status='Pending Forensic' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }

  // ── 3. Severity filters
  if (q.includes("critical")) {
    const result = listCrimes({ severity: "Critical", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE severity='Critical' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("high severity") || q.includes("high-severity")) {
    const result = listCrimes({ severity: "High", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE severity='High' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("medium severity")) {
    const result = listCrimes({ severity: "Medium", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE severity='Medium' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }
  if (q.includes("low severity")) {
    const result = listCrimes({ severity: "Low", pageSize: 15 });
    return { queryDescription: "SELECT * FROM crimes WHERE severity='Low' LIMIT 15", rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }

  // ── 4. Category filters
  const CATEGORIES: Record<string, string> = {
    "property crime": "Property Crime", "theft": "Property Crime", "burglary": "Property Crime",
    "robbery": "Property Crime", "vehicle theft": "Property Crime",
    "violent crime": "Violent Crime", "murder": "Violent Crime", "kidnapping": "Violent Crime",
    "economic offence": "Economic Offence", "fraud": "Economic Offence", "forgery": "Economic Offence",
    "cyber crime": "Cyber Crime", "phishing": "Cyber Crime", "identity theft": "Cyber Crime",
    "public order": "Public Order", "rioting": "Public Order", "arson": "Public Order",
    "organized crime": "Organized Crime", "narcotics": "Organized Crime", "smuggling": "Organized Crime",
  };
  for (const [kw, cat] of Object.entries(CATEGORIES)) {
    if (q.includes(kw)) {
      const result = listCrimes({ category: cat, pageSize: 15 });
      return { queryDescription: `SELECT * FROM crimes WHERE category='${cat}' LIMIT 15`, rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
    }
  }

  // ── 5. Weapon filter
  const WEAPONS = ["knife","firearm","blunt object","vehicle","poison","sharp weapon"];
  for (const w of WEAPONS) {
    if (q.includes(w)) {
      const result = listCrimes({ search: w, pageSize: 15 });
      return { queryDescription: `SELECT * FROM crimes WHERE weapon_used ILIKE '%${w}%' LIMIT 15`, rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
    }
  }

  // ── 6. Officer filter
  const officerMatch = q.match(/officer\s+([a-z.]+\s+[a-z]+)/i) || q.match(/inspector\s+([a-z.]+\s+[a-z]+)/i) || q.match(/si\s+([a-z.]+\s+[a-z]+)/i);
  if (officerMatch) {
    const result = listCrimes({ search: officerMatch[1], pageSize: 15 });
    return { queryDescription: `SELECT * FROM crimes WHERE investigation_officer ILIKE '%${officerMatch[1]}%' LIMIT 15`, rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }

  // ── 7. Repeat offenders
  if (q.includes("repeat offender") || q.includes("repeat") || q.includes("recidivist")) {
    const result = listCrimes({ pageSize: 15, sortBy: "repeatOffender", sortDir: "desc" });
    const filtered = result.items.filter((c) => c.repeatOffender);
    return {
      queryDescription: "SELECT * FROM crimes WHERE repeat_offender = true ORDER BY crime_time DESC LIMIT 15",
      rows: filtered.map(crimeRow), totalCount: filtered.length, columns: CRIME_COLS,
    };
  }

  // ── 8. Accused / victim name search
  if (q.includes("accused") || q.includes("suspect")) {
    const result = listCrimes({ pageSize: 15, sortBy: "crimeTime", sortDir: "desc" });
    return { queryDescription: "SELECT case_number, accused_name, modus_operandi, district, status FROM crimes LIMIT 15", rows: result.items.map((c) => ({ caseNumber: c.caseNumber, accusedName: c.accusedName, modusOperandi: c.modusOperandi, district: c.districtName, status: c.status })), totalCount: result.total, columns: ["caseNumber","accusedName","modusOperandi","district","status"] };
  }
  if (q.includes("victim")) {
    const result = listCrimes({ pageSize: 15, sortBy: "crimeTime", sortDir: "desc" });
    return { queryDescription: "SELECT case_number, victim_name, category, district, status FROM crimes LIMIT 15", rows: result.items.map((c) => ({ caseNumber: c.caseNumber, victimName: c.victimName, category: c.category, district: c.districtName, status: c.status })), totalCount: result.total, columns: ["caseNumber","victimName","category","district","status"] };
  }

  // ── 9. District filter
  const district = detectDistrict(q);
  if (district) {
    const result = listCrimes({ district, pageSize: 15 });
    return { queryDescription: `SELECT * FROM crimes WHERE district='${district}' ORDER BY crime_time DESC LIMIT 15`, rows: result.items.map(crimeRow), totalCount: result.total, columns: CRIME_COLS };
  }

  // ── 10. Count / total queries
  if (q.includes("how many") || q.includes("count") || q.includes("total crimes")) {
    const dashboard = getDashboardSummary();
    return {
      queryDescription: "SELECT COUNT(*) as total, SUM(CASE WHEN status='Solved' THEN 1 ELSE 0 END) as solved FROM crimes",
      rows: [{ totalCrimes: dashboard.totals.crimes, activeCases: dashboard.totals.activeCases, solvedCases: dashboard.totals.solvedCases, pendingCases: dashboard.totals.pendingCases, repeatOffenders: dashboard.totals.repeatOffenders }],
      totalCount: 1,
      columns: ["totalCrimes","activeCases","solvedCases","pendingCases","repeatOffenders"],
    };
  }

  // ── 11. Category breakdown
  if (q.includes("category") || q.includes("type of crime") || q.includes("crime type")) {
    const dashboard = getDashboardSummary();
    return {
      queryDescription: "SELECT category, COUNT(*) as count FROM crimes GROUP BY category ORDER BY count DESC",
      rows: dashboard.crimeCategories as unknown as Record<string, unknown>[],
      totalCount: dashboard.crimeCategories.length,
      columns: ["name","value"],
    };
  }

  // ── 12. District comparison
  if (q.includes("district") || q.includes("which district") || q.includes("top district")) {
    const districts = getDistrictSummaries();
    const sorted = [...districts].sort((a, b) => b.crimeCount - a.crimeCount).slice(0, 10);
    return {
      queryDescription: "SELECT name, crime_count, fir_count, hotspot_count FROM districts ORDER BY crime_count DESC LIMIT 10",
      rows: sorted.map((d) => ({ district: d.name, crimes: d.crimeCount, firs: d.firCount, hotspots: d.hotspotCount, stations: d.policeStationCount })),
      totalCount: districts.length,
      columns: ["district","crimes","firs","hotspots","stations"],
    };
  }

  // ── 13. Default: recent crimes
  const result = listCrimes({ pageSize: 15, sortBy: "crimeTime", sortDir: "desc" });
  return {
    queryDescription: "SELECT * FROM crimes ORDER BY crime_time DESC LIMIT 15",
    rows: result.items.map(crimeRow),
    totalCount: result.total,
    columns: CRIME_COLS,
  };
}

// ── FIR query handler ─────────────────────────────────────────────────────────

function handleFirQuery(q: string): SqlQueryResult {
  // Specific FIR number lookup
  const firMatch = q.match(/fir\/[a-z0-9]+\/\d+/i);
  if (firMatch) {
    const result = listFirs({ search: firMatch[0].toUpperCase(), pageSize: 5 });
    return { queryDescription: `SELECT * FROM firs WHERE fir_number ILIKE '%${firMatch[0]}%'`, rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }

  // FIR status filters
  if (q.includes("registered")) {
    const result = listFirs({ status: "Registered", pageSize: 15 });
    return { queryDescription: "SELECT * FROM firs WHERE status='Registered' LIMIT 15", rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }
  if (q.includes("investigating") || q.includes("under investigation")) {
    const result = listFirs({ status: "Investigating", pageSize: 15 });
    return { queryDescription: "SELECT * FROM firs WHERE status='Investigating' LIMIT 15", rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }
  if (q.includes("closed fir") || q.includes("closed case")) {
    const result = listFirs({ status: "Closed", pageSize: 15 });
    return { queryDescription: "SELECT * FROM firs WHERE status='Closed' LIMIT 15", rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }

  // District filter for FIRs
  const district = detectDistrict(q);
  if (district) {
    const result = listFirs({ district, pageSize: 15 });
    return { queryDescription: `SELECT * FROM firs WHERE district='${district}' ORDER BY date_filed DESC LIMIT 15`, rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }

  // Officer filter
  const officerMatch = q.match(/officer\s+([a-z.]+\s+[a-z]+)/i);
  if (officerMatch) {
    const result = listFirs({ officer: officerMatch[1], pageSize: 15 });
    return { queryDescription: `SELECT * FROM firs WHERE officer ILIKE '%${officerMatch[1]}%' LIMIT 15`, rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }

  // IPC section filter
  const sectionMatch = q.match(/ipc\s*(\d+[a-z]?)/i) || q.match(/section\s*(\d+[a-z]?)/i);
  if (sectionMatch) {
    const result = listFirs({ search: sectionMatch[0], pageSize: 15 });
    return { queryDescription: `SELECT * FROM firs WHERE section ILIKE '%${sectionMatch[0]}%' LIMIT 15`, rows: result.items.map(firRow), totalCount: result.total, columns: FIR_COLS };
  }

  // Count FIRs
  if (q.includes("how many fir") || q.includes("total fir") || q.includes("count fir")) {
    const dashboard = getDashboardSummary();
    return {
      queryDescription: "SELECT COUNT(*) as total_firs FROM firs",
      rows: [{ totalFirs: dashboard.totals.firs, districts: dashboard.totals.districts }],
      totalCount: 1,
      columns: ["totalFirs","districts"],
    };
  }

  // Default: recent FIRs
  const result = listFirs({ pageSize: 15 });
  return {
    queryDescription: "SELECT * FROM firs ORDER BY date_filed DESC LIMIT 15",
    rows: result.items.map(firRow),
    totalCount: result.total,
    columns: FIR_COLS,
  };
}

// ── Row mappers ───────────────────────────────────────────────────────────────

const CRIME_COLS = ["caseNumber","title","district","category","severity","status","officer","weapon","accused","victim"];
const FIR_COLS   = ["firNumber","district","station","officer","status","section","dateFiled"];

function crimeRow(c: ReturnType<typeof listCrimes>["items"][number]): Record<string, unknown> {
  return {
    caseNumber: c.caseNumber,
    title:      c.title,
    district:   c.districtName,
    category:   c.category,
    severity:   c.severity,
    status:     c.status,
    officer:    c.investigationOfficer,
    weapon:     c.weapon,
    accused:    c.accusedName,
    victim:     c.victimName,
  };
}

function firRow(f: ReturnType<typeof listFirs>["items"][number]): Record<string, unknown> {
  return {
    firNumber: f.firNumber,
    district:  f.districtName,
    station:   f.policeStationName,
    officer:   f.officer,
    status:    f.status,
    section:   f.section,
    dateFiled: f.dateFiled.slice(0, 10),
  };
}

// ── Census & Historical query handlers ───────────────────────────────────────

function handleCensusQuery(q: string): SqlQueryResult {
  const districts = getData().districts;
  const targetDistrict = detectDistrict(q);

  let filtered = districts;
  let queryDesc = "SELECT district_name, population, area_sq_km, literacy_rate, gender_ratio, density FROM census_2011";

  if (targetDistrict) {
    filtered = districts.filter((d) => d.name.toLowerCase() === targetDistrict.toLowerCase());
    queryDesc += ` WHERE district_name = '${targetDistrict}'`;
  }

  // Handle sorting
  if (q.includes("highest literacy") || q.includes("most literate")) {
    filtered = [...filtered].sort((a, b) => b.literacyRate - a.literacyRate);
    queryDesc += " ORDER BY literacy_rate DESC LIMIT 1";
    filtered = filtered.slice(0, 1);
  } else if (q.includes("highest population") || q.includes("most populous")) {
    filtered = [...filtered].sort((a, b) => b.population - a.population);
    queryDesc += " ORDER BY population DESC LIMIT 1";
    filtered = filtered.slice(0, 1);
  } else if (q.includes("highest gender") || q.includes("highest sex") || q.includes("best gender")) {
    filtered = [...filtered].sort((a, b) => b.genderRatio - a.genderRatio);
    queryDesc += " ORDER BY gender_ratio DESC LIMIT 1";
    filtered = filtered.slice(0, 1);
  } else if (q.includes("highest density")) {
    filtered = [...filtered].sort((a, b) => b.density - a.density);
    queryDesc += " ORDER BY density DESC LIMIT 1";
    filtered = filtered.slice(0, 1);
  }

  const rows = filtered.map((d) => ({
    districtName: d.name,
    population: d.population,
    areaSqKm: d.areaSqKm,
    literacyRate: d.literacyRate,
    genderRatio: d.genderRatio,
    density: d.density,
  }));

  return {
    queryDescription: queryDesc,
    rows,
    totalCount: rows.length,
    columns: ["districtName", "population", "areaSqKm", "literacyRate", "genderRatio", "density"],
  };
}

function handleHistoricalQuery(q: string): SqlQueryResult {
  const districts = getData().districts;
  const records = getCrimeIndiaAnnualRecords(districts);
  const targetDistrict = detectDistrict(q);

  const yearMatch = q.match(/\b(200[1-9]|201[0-9]|202[0-1])\b/);
  const targetYear = yearMatch ? parseInt(yearMatch[0], 10) : null;

  let targetHead: string | null = null;
  if (q.includes("murder")) targetHead = "Murder";
  else if (q.includes("theft")) targetHead = "Theft";
  else if (q.includes("kidnap")) targetHead = "Kidnapping";
  else if (q.includes("cheat")) targetHead = "Cheating";

  let filtered = records;
  let queryDesc = "SELECT district, year, crime_head, crime_group, cases_reported, cases_chargesheeted, cases_convicted, persons_arrested FROM crime_india_annual";
  const conditions: string[] = [];

  if (targetDistrict) {
    filtered = filtered.filter((r) => r.district.toLowerCase() === targetDistrict.toLowerCase());
    conditions.push(`district = '${targetDistrict}'`);
  }
  if (targetYear) {
    filtered = filtered.filter((r) => r.year === targetYear);
    conditions.push(`year = ${targetYear}`);
  }
  if (targetHead) {
    filtered = filtered.filter((r) => r.crime_head === targetHead);
    conditions.push(`crime_head = '${targetHead}'`);
  }

  if (conditions.length > 0) {
    queryDesc += " WHERE " + conditions.join(" AND ");
  }

  const limited = filtered.slice(0, 15);
  const rows = limited.map((r) => ({
    district: r.district,
    year: r.year,
    crimeHead: r.crime_head,
    crimeGroup: r.crime_group,
    casesReported: r.cases_reported,
    casesChargesheeted: r.cases_chargesheeted,
    casesConvicted: r.cases_convicted,
    personsArrested: r.persons_arrested,
  }));

  return {
    queryDescription: queryDesc,
    rows,
    totalCount: filtered.length,
    columns: ["district", "year", "crimeHead", "crimeGroup", "casesReported", "casesChargesheeted", "casesConvicted", "personsArrested"],
  };
}

// ── Public entry point ────────────────────────────────────────────────────────

export function executeTextToSql(normalisedQuery: string, intent?: string): SqlQueryResult {
  if (intent === "caw") return handleCawQuery(normalisedQuery);

  const isCensus = ["literacy", "sex ratio", "gender ratio", "population", "density", "area"].some((kw) => normalisedQuery.includes(kw)) &&
                   !["correlation", "vs", "compare"].some((kw) => normalisedQuery.includes(kw));

  if (isCensus) {
    return handleCensusQuery(normalisedQuery);
  }

  const isHistorical = ["historical", "ncrb", "annual", "reported", "chargesheeted"].some((kw) => normalisedQuery.includes(kw)) ||
                       /\b(200[1-9]|201[0-9]|202[0-1])\b/.test(normalisedQuery);

  if (isHistorical) {
    return handleHistoricalQuery(normalisedQuery);
  }

  const firKeywords = ["fir", "first information", "fir/", "registered fir", "recent fir", "latest fir", "how many fir", "total fir", "count fir", "closed fir", "investigating fir"];
  const isFirQuery = firKeywords.some((kw) => normalisedQuery.includes(kw));

  if (isFirQuery) return handleFirQuery(normalisedQuery);
  return handleCrimeQuery(normalisedQuery);
}
