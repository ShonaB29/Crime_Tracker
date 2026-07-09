/**
 * MODULE: Analysis Engine (Workflow Step 6 & 7)
 *
 * Supports five analysis types:
 *   - trend      : Monthly crime trend + year-over-year
 *   - hotspot    : Geographic crime cluster detection
 *   - network    : Criminal relationship / co-offending network
 *   - prediction : Linear-regression-based forecast
 *   - caw        : Crimes Against Women deep analysis (NEW)
 */

import {
  getAnalyticsSummary,
  getNetworkGraphSummary,
  getDashboardSummary,
  getDistrictSummaries,
} from "@/server/crime-platform.server";

import {
  getCawTrend,
  getCawStateTotals,
  getTopCawDistricts,
  getLatestCawYear,
  getDistrictCoords,
  getCawRecords,
} from "./caw-data";

export interface TrendPoint   { month: string; observed: number; projected: number }
export interface CawTrendPoint { year: number; value: number }
export interface HotspotPoint { district: string; lat: number; lng: number; score: number; crimeCount: number }
export interface NetworkNode  { id: string; label: string; type: string; value: number }
export interface NetworkEdge  { source: string; target: string; label: string; weight: number }
export interface RiskScore    { district: string; score: number; trend: number }

export interface AnalysisResult {
  type: "trend" | "hotspot" | "network" | "prediction" | "caw";
  insight: string;
  chartData?: TrendPoint[] | HotspotPoint[] | RiskScore[] | CawTrendPoint[] | Record<string, unknown>[];
  networkData?: { nodes: NetworkNode[]; edges: NetworkEdge[] };
  metrics: Record<string, string | number>;
  /** CAW category breakdown for bar chart */
  cawBreakdown?: Array<{ category: string; count: number }>;
  /** Top districts for CAW heatmap */
  cawHotspots?: Array<{ district: string; lat: number; lng: number; total_caw: number; score: number }>;
}

// ── CAW Analysis ───────────────────────────────────────────────────────────────

function analyseCaw(normalisedQuery: string): AnalysisResult {
  const latestYear = getLatestCawYear();
  const stateTotals = getCawStateTotals(latestYear);
  const topDistricts = getTopCawDistricts(latestYear, 10);
  const coords = getDistrictCoords();

  // Year-over-year trend for total CAW
  const yearlyTrend = getCawTrend("total_caw");

  // Determine which sub-category to highlight based on query
  let focusCategory = "total_caw";
  let focusLabel = "Total Crimes Against Women";
  if (normalisedQuery.includes("rape"))                                    { focusCategory = "rape";               focusLabel = "Rape"; }
  else if (normalisedQuery.includes("dowry"))                              { focusCategory = "dowry_deaths";       focusLabel = "Dowry Deaths"; }
  else if (normalisedQuery.includes("cruelty") || normalisedQuery.includes("domestic") || normalisedQuery.includes("husband")) {
    focusCategory = "cruelty_by_husband"; focusLabel = "Cruelty by Husband / Domestic Violence";
  }
  else if (normalisedQuery.includes("kidnap") || normalisedQuery.includes("abduction") || normalisedQuery.includes("trafficking")) {
    focusCategory = "kidnapping_abduction"; focusLabel = "Kidnapping & Abduction";
  }
  else if (normalisedQuery.includes("assault") || normalisedQuery.includes("molestation")) {
    focusCategory = "assault_on_women"; focusLabel = "Assault on Women";
  }

  // Focused trend
  const focusTrend = getCawTrend(focusCategory as keyof typeof stateTotals);

  // Category breakdown for latest year (bar chart)
  const cawBreakdown = [
    { category: "Rape",                    count: stateTotals.rape },
    { category: "Kidnapping & Abduction",  count: stateTotals.kidnapping_abduction },
    { category: "Dowry Deaths",            count: stateTotals.dowry_deaths },
    { category: "Assault on Women",        count: stateTotals.assault_on_women },
    { category: "Insult to Modesty",       count: stateTotals.insult_to_modesty },
    { category: "Cruelty by Husband",      count: stateTotals.cruelty_by_husband },
    { category: "Immoral Trafficking",     count: stateTotals.immoral_traffic },
    { category: "Dowry Prohibition",       count: stateTotals.dowry_prohibition },
  ].sort((a, b) => b.count - a.count);

  // Hotspot data for map
  const cawHotspots = topDistricts.map((d) => ({
    district: d.district,
    lat: coords[d.district]?.lat ?? 15.0,
    lng: coords[d.district]?.lng ?? 75.5,
    total_caw: d.total_caw,
    score: Math.min(99, Math.round((d.total_caw / stateTotals.total_caw) * 100 * topDistricts.length * 0.8)),
  }));

  // Year-over-year change
  const prev = getCawStateTotals(latestYear - 1);
  const yoyChange = stateTotals.total_caw - prev.total_caw;
  const yoyPct = Math.round((yoyChange / prev.total_caw) * 100);
  const direction = yoyChange > 0 ? "increased" : "decreased";

  const topDistrict = topDistricts[0];
  const focusValue = (stateTotals as Record<string, number>)[focusCategory] ?? stateTotals.total_caw;

  const insight =
    `Crimes Against Women in Karnataka (${latestYear}): ` +
    `Total ${stateTotals.total_caw.toLocaleString()} cases reported across 31 districts. ` +
    `${focusLabel}: ${focusValue.toLocaleString()} cases. ` +
    `Cruelty by husband / domestic violence is the highest category with ${stateTotals.cruelty_by_husband.toLocaleString()} cases. ` +
    `Rape cases: ${stateTotals.rape.toLocaleString()}. ` +
    `Dowry deaths: ${stateTotals.dowry_deaths.toLocaleString()}. ` +
    `Assault on women: ${stateTotals.assault_on_women.toLocaleString()}. ` +
    `Top affected district: ${topDistrict.district} with ${topDistrict.total_caw.toLocaleString()} total CAW cases. ` +
    `Year-over-year: CAW cases ${direction} by ${Math.abs(yoyPct)}% compared to ${latestYear - 1}. ` +
    `Source: NCRB Crimes Against Women in India 2001–2021 dataset.`;

  return {
    type: "caw",
    insight,
    chartData: focusTrend as unknown as Record<string, unknown>[],
    cawBreakdown,
    cawHotspots,
    metrics: {
      totalCaw:          stateTotals.total_caw.toLocaleString(),
      rape:              stateTotals.rape.toLocaleString(),
      dowryDeaths:       stateTotals.dowry_deaths.toLocaleString(),
      crueltyByHusband:  stateTotals.cruelty_by_husband.toLocaleString(),
      assaultOnWomen:    stateTotals.assault_on_women.toLocaleString(),
      kidnapping:        stateTotals.kidnapping_abduction.toLocaleString(),
      topDistrict:       topDistrict.district,
      year:              latestYear,
      yoyChange:         `${yoyChange > 0 ? "+" : ""}${yoyPct}%`,
    },
  };
}

// ── Trend Analysis ─────────────────────────────────────────────────────────────

function analyseTrend(): AnalysisResult {
  const analytics = getAnalyticsSummary();
  const latest = analytics.predictionGraph.slice(-3);
  const avgObserved  = Math.round(latest.reduce((s, p) => s + p.observed, 0) / latest.length);
  const avgProjected = Math.round(latest.reduce((s, p) => s + p.projected, 0) / latest.length);
  const direction = avgProjected > avgObserved ? "upward" : "downward";

  return {
    type: "trend",
    insight: `Crime activity is trending ${direction}. Average observed crimes over the last 3 months: ${avgObserved}. Projected average: ${avgProjected}. Top category: ${analytics.pieSeries[0]?.name ?? "N/A"} with ${analytics.pieSeries[0]?.value ?? 0} incidents.`,
    chartData: analytics.predictionGraph as TrendPoint[],
    metrics: {
      avgObserved,
      avgProjected,
      topCategory: analytics.pieSeries[0]?.name ?? "N/A",
      yearlyGrowth: `${analytics.yearlyTrend.length > 1 ? Math.round(((analytics.yearlyTrend.at(-1)!.crimes - analytics.yearlyTrend.at(-2)!.crimes) / analytics.yearlyTrend.at(-2)!.crimes) * 100) : 0}%`,
    },
  };
}

// ── Hotspot Detection ──────────────────────────────────────────────────────────

function analyseHotspots(): AnalysisResult {
  const districts = getDistrictSummaries();
  const dashboard  = getDashboardSummary();
  const totalCrimes = districts.reduce((s, d) => s + d.crimeCount, 0);

  const hotspots: HotspotPoint[] = districts
    .map((d) => ({
      district: d.name, lat: d.latitude, lng: d.longitude, crimeCount: d.crimeCount,
      score: Math.min(99, Math.round((d.crimeCount / totalCrimes) * 100 * districts.length * 0.6 + d.hotspotCount * 1.5)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const top = hotspots[0];
  return {
    type: "hotspot",
    insight: `Hotspot analysis identified ${hotspots.length} high-risk zones. Highest-risk district: ${top.district} (score: ${top.score}) with ${top.crimeCount} crimes. Heatmap covers ${dashboard.heatmapPoints.length} geo-tagged incidents.`,
    chartData: hotspots,
    metrics: { topDistrict: top.district, topScore: top.score, hotspotsCovered: hotspots.length, heatmapPoints: dashboard.heatmapPoints.length },
  };
}

// ── Network Analysis ───────────────────────────────────────────────────────────

function analyseNetwork(): AnalysisResult {
  const network = getNetworkGraphSummary();
  const criminals = network.nodes.filter((n) => n.type === "criminal");
  const topCriminal = criminals[0];

  return {
    type: "network",
    insight: `Criminal network analysis found ${network.nodes.length} entities and ${network.edges.length} relationships. Top connected entity: ${topCriminal?.label ?? "N/A"}. Repeat offenders: ${network.highlights.find((h) => h.label === "Repeat offenders")?.value ?? 0}.`,
    networkData: { nodes: network.nodes as NetworkNode[], edges: network.edges as NetworkEdge[] },
    metrics: {
      totalNodes: network.nodes.length, totalEdges: network.edges.length,
      repeatOffenders: network.highlights.find((h) => h.label === "Repeat offenders")?.value ?? 0,
      topEntity: topCriminal?.label ?? "N/A",
    },
  };
}

// ── Prediction ─────────────────────────────────────────────────────────────────

function analysePrediction(): AnalysisResult {
  const analytics = getAnalyticsSummary();
  const series = analytics.predictionGraph;
  const n = series.length;
  const xMean = (n - 1) / 2;
  const yMean = series.reduce((s, p) => s + p.observed, 0) / n;
  const slope = series.reduce((s, p, i) => s + (i - xMean) * (p.observed - yMean), 0) /
    series.reduce((s, _, i) => s + (i - xMean) ** 2, 0);
  const nextMonthProjection = Math.round(series.at(-1)!.observed + slope);
  const direction = slope > 0 ? "increasing" : "decreasing";

  const extended: TrendPoint[] = [
    ...series,
    { month: "M+1", observed: 0, projected: nextMonthProjection },
    { month: "M+2", observed: 0, projected: Math.round(nextMonthProjection + slope) },
    { month: "M+3", observed: 0, projected: Math.round(nextMonthProjection + slope * 2) },
  ];

  return {
    type: "prediction",
    insight: `Predictive model (linear regression) shows crime counts are ${direction} at ${Math.abs(Math.round(slope))} crimes/month. Next month projection: ${nextMonthProjection} crimes. Top risk districts: ${analytics.riskScores.slice(0, 3).map((r) => r.district).join(", ")}.`,
    chartData: extended,
    metrics: { slope: Math.round(slope), nextMonthProjection, direction, topRiskDistrict: analytics.riskScores[0]?.district ?? "N/A" },
  };
}

// ── Public entry point ─────────────────────────────────────────────────────────

export function runAnalysis(
  type: "trend" | "hotspot" | "network" | "prediction" | "caw",
  normalisedQuery = ""
): AnalysisResult {
  switch (type) {
    case "caw":        return analyseCaw(normalisedQuery);
    case "hotspot":    return analyseHotspots();
    case "network":    return analyseNetwork();
    case "prediction": return analysePrediction();
    default:           return analyseTrend();
  }
}
