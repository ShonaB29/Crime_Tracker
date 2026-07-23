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
  getData,
  DistrictRecord,
} from "@/server/crime-platform.server";

import {
  getCawTrend,
  getCawStateTotals,
  getTopCawDistricts,
  getLatestCawYear,
  getDistrictCoords,
  getCawRecords,
} from "./caw-data";

export interface TrendPoint {
  month: string;
  observed: number;
  projected: number;
}
export interface CawTrendPoint {
  year: number;
  value: number;
}
export interface HotspotPoint {
  district: string;
  lat: number;
  lng: number;
  score: number;
  crimeCount: number;
}
export interface NetworkNode {
  id: string;
  label: string;
  type: string;
  value: number;
}
export interface NetworkEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}
export interface RiskScore {
  district: string;
  score: number;
  trend: number;
}

/** Model validation metrics produced by the 80/20 train-test split */
export interface ModelValidation {
  trainSize: number;
  testSize: number;
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Squared Error
  r2: number; // R² coefficient of determination (0–1)
  mape: number; // Mean Absolute Percentage Error (%)
}

export interface AnalysisResult {
  type: "trend" | "hotspot" | "network" | "prediction" | "caw" | "correlation";
  insight: string;
  chartData?:
    TrendPoint[] | HotspotPoint[] | RiskScore[] | CawTrendPoint[] | Record<string, unknown>[];
  networkData?: { nodes: NetworkNode[]; edges: NetworkEdge[] };
  metrics: Record<string, string | number>;
  /** Model validation — only present for prediction type */
  validation?: ModelValidation;
  /** CAW category breakdown for bar chart */
  cawBreakdown?: Array<{ category: string; count: number }>;
  /** Top districts for CAW heatmap */
  cawHotspots?: Array<{
    district: string;
    lat: number;
    lng: number;
    total_caw: number;
    score: number;
  }>;
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
  if (normalisedQuery.includes("rape")) {
    focusCategory = "rape";
    focusLabel = "Rape";
  } else if (normalisedQuery.includes("dowry")) {
    focusCategory = "dowry_deaths";
    focusLabel = "Dowry Deaths";
  } else if (
    normalisedQuery.includes("cruelty") ||
    normalisedQuery.includes("domestic") ||
    normalisedQuery.includes("husband")
  ) {
    focusCategory = "cruelty_by_husband";
    focusLabel = "Cruelty by Husband / Domestic Violence";
  } else if (
    normalisedQuery.includes("kidnap") ||
    normalisedQuery.includes("abduction") ||
    normalisedQuery.includes("trafficking")
  ) {
    focusCategory = "kidnapping_abduction";
    focusLabel = "Kidnapping & Abduction";
  } else if (normalisedQuery.includes("assault") || normalisedQuery.includes("molestation")) {
    focusCategory = "assault_on_women";
    focusLabel = "Assault on Women";
  }

  // Focused trend
  const focusTrend = getCawTrend(focusCategory as keyof typeof stateTotals);

  // Category breakdown for latest year (bar chart)
  const cawBreakdown = [
    { category: "Rape", count: stateTotals.rape },
    { category: "Kidnapping & Abduction", count: stateTotals.kidnapping_abduction },
    { category: "Dowry Deaths", count: stateTotals.dowry_deaths },
    { category: "Assault on Women", count: stateTotals.assault_on_women },
    { category: "Insult to Modesty", count: stateTotals.insult_to_modesty },
    { category: "Cruelty by Husband", count: stateTotals.cruelty_by_husband },
    { category: "Immoral Trafficking", count: stateTotals.immoral_traffic },
    { category: "Dowry Prohibition", count: stateTotals.dowry_prohibition },
  ].sort((a, b) => b.count - a.count);

  // Hotspot data for map
  const cawHotspots = topDistricts.map((d) => ({
    district: d.district,
    lat: coords[d.district]?.lat ?? 15.0,
    lng: coords[d.district]?.lng ?? 75.5,
    total_caw: d.total_caw,
    score: Math.min(
      99,
      Math.round((d.total_caw / stateTotals.total_caw) * 100 * topDistricts.length * 0.8),
    ),
  }));

  // Year-over-year change
  const prev = getCawStateTotals(latestYear - 1);
  const yoyChange = stateTotals.total_caw - prev.total_caw;
  const yoyPct = Math.round((yoyChange / prev.total_caw) * 100);
  const direction = yoyChange > 0 ? "increased" : "decreased";

  const topDistrict = topDistricts[0];
  const focusValue =
    (stateTotals as Record<string, number>)[focusCategory] ?? stateTotals.total_caw;

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
      totalCaw: stateTotals.total_caw.toLocaleString(),
      rape: stateTotals.rape.toLocaleString(),
      dowryDeaths: stateTotals.dowry_deaths.toLocaleString(),
      crueltyByHusband: stateTotals.cruelty_by_husband.toLocaleString(),
      assaultOnWomen: stateTotals.assault_on_women.toLocaleString(),
      kidnapping: stateTotals.kidnapping_abduction.toLocaleString(),
      topDistrict: topDistrict.district,
      year: latestYear,
      yoyChange: `${yoyChange > 0 ? "+" : ""}${yoyPct}%`,
    },
  };
}

// ── Trend Analysis ─────────────────────────────────────────────────────────────

function analyseTrend(): AnalysisResult {
  const analytics = getAnalyticsSummary();
  const latest = analytics.predictionGraph.slice(-3);
  const avgObserved = Math.round(latest.reduce((s, p) => s + p.observed, 0) / latest.length);
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
  const dashboard = getDashboardSummary();
  const totalCrimes = districts.reduce((s, d) => s + d.crimeCount, 0);

  const hotspots: HotspotPoint[] = districts
    .map((d) => ({
      district: d.name,
      lat: d.latitude,
      lng: d.longitude,
      crimeCount: d.crimeCount,
      score: Math.min(
        99,
        Math.round(
          (d.crimeCount / totalCrimes) * 100 * districts.length * 0.6 + d.hotspotCount * 1.5,
        ),
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const top = hotspots[0];
  return {
    type: "hotspot",
    insight: `Hotspot analysis identified ${hotspots.length} high-risk zones. Highest-risk district: ${top.district} (score: ${top.score}) with ${top.crimeCount} crimes. Heatmap covers ${dashboard.heatmapPoints.length} geo-tagged incidents.`,
    chartData: hotspots,
    metrics: {
      topDistrict: top.district,
      topScore: top.score,
      hotspotsCovered: hotspots.length,
      heatmapPoints: dashboard.heatmapPoints.length,
    },
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
      totalNodes: network.nodes.length,
      totalEdges: network.edges.length,
      repeatOffenders: network.highlights.find((h) => h.label === "Repeat offenders")?.value ?? 0,
      topEntity: topCriminal?.label ?? "N/A",
    },
  };
}

// ── Model validation helpers ───────────────────────────────────────────────────

/**
 * Fits a simple linear regression (OLS) on the given (x, y) pairs.
 * Returns intercept and slope.
 */
export function fitLinearRegression(y: number[]): { slope: number; intercept: number } {
  const n = y.length;
  if (n < 2) return { slope: 0, intercept: y[0] ?? 0 };
  const xMean = (n - 1) / 2;
  const yMean = y.reduce((s, v) => s + v, 0) / n;
  const slope =
    y.reduce((s, v, i) => s + (i - xMean) * (v - yMean), 0) /
    y.reduce((s, _, i) => s + (i - xMean) ** 2, 0);
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}

/**
 * Evaluates a fitted model on test data and returns MAE, RMSE, R², MAPE.
 * predicted[i] = intercept + slope * (trainSize + i)
 */
export function evaluateModel(
  testY: number[],
  slope: number,
  intercept: number,
  trainSize: number,
): ModelValidation {
  const n = testY.length;
  const predicted = testY.map((_, i) => intercept + slope * (trainSize + i));

  const mae = predicted.reduce((s, p, i) => s + Math.abs(p - testY[i]), 0) / n;
  const mse = predicted.reduce((s, p, i) => s + (p - testY[i]) ** 2, 0) / n;
  const rmse = Math.sqrt(mse);

  const yMean = testY.reduce((s, v) => s + v, 0) / n;
  const ssTot = testY.reduce((s, v) => s + (v - yMean) ** 2, 0);
  const ssRes = predicted.reduce((s, p, i) => s + (p - testY[i]) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  const mape =
    (predicted.reduce(
      (s, p, i) => s + (testY[i] === 0 ? 0 : Math.abs((p - testY[i]) / testY[i])),
      0,
    ) /
      n) *
    100;

  return {
    trainSize,
    testSize: n,
    mae: Math.round(mae * 100) / 100,
    rmse: Math.round(rmse * 100) / 100,
    r2: Math.round(r2 * 1000) / 1000,
    mape: Math.round(mape * 100) / 100,
  };
}

// ── Prediction ─────────────────────────────────────────────────────────────────

function analysePrediction(): AnalysisResult {
  const analytics = getAnalyticsSummary();
  const series = analytics.predictionGraph;

  // ── 80 / 20 train-test split ──────────────────────────────────────────────
  const splitIdx = Math.floor(series.length * 0.8); // e.g. 9 of 12
  const trainY = series.slice(0, splitIdx).map((p) => p.observed);
  const testY = series.slice(splitIdx).map((p) => p.observed);

  const { slope, intercept } = fitLinearRegression(trainY);
  const validation = evaluateModel(testY, slope, intercept, splitIdx);

  // ── Forecast ──────────────────────────────────────────────────────────────
  const nextMonthProjection = Math.round(intercept + slope * series.length);
  const direction = slope > 0 ? "increasing" : "decreasing";

  const extended: TrendPoint[] = [
    ...series,
    { month: "M+1", observed: 0, projected: nextMonthProjection },
    { month: "M+2", observed: 0, projected: Math.round(intercept + slope * (series.length + 1)) },
    { month: "M+3", observed: 0, projected: Math.round(intercept + slope * (series.length + 2)) },
  ];

  return {
    type: "prediction",
    insight:
      `Predictive model (linear regression, 80/20 split) shows crime counts are ${direction} ` +
      `at ${Math.abs(Math.round(slope))} crimes/month. ` +
      `Next month projection: ${nextMonthProjection} crimes. ` +
      `Model accuracy — MAE: ${validation.mae}, RMSE: ${validation.rmse}, R²: ${validation.r2}. ` +
      `Top risk districts: ${analytics.riskScores
        .slice(0, 3)
        .map((r) => r.district)
        .join(", ")}.`,
    chartData: extended,
    validation,
    metrics: {
      slope: Math.round(slope),
      intercept: Math.round(intercept),
      nextMonthProjection,
      direction,
      trainSamples: validation.trainSize,
      testSamples: validation.testSize,
      mae: validation.mae,
      rmse: validation.rmse,
      r2: validation.r2,
      mape: `${validation.mape}%`,
      topRiskDistrict: analytics.riskScores[0]?.district ?? "N/A",
    },
  };
}

// ── Correlation & Demographics ────────────────────────────────────────────────

function analyseCorrelation(normalisedQuery: string): AnalysisResult {
  const districts = getData().districts;

  let xLabel = "Population Density (per sq km)";
  let yLabel = "Hotspot Count";
  let xVal = (d: DistrictRecord) => d.density;
  let yVal = (d: DistrictRecord) => d.hotspotCount;

  if (normalisedQuery.includes("literacy")) {
    xLabel = "Literacy Rate (%)";
    yLabel = "Crime Rate (per 1,000 population)";
    xVal = (d: DistrictRecord) => d.literacyRate;
    yVal = (d: DistrictRecord) => Math.round((d.crimeCount / d.population) * 1000 * 10) / 10;
  } else if (
    normalisedQuery.includes("gender") ||
    normalisedQuery.includes("sex") ||
    normalisedQuery.includes("women") ||
    normalisedQuery.includes("ratio")
  ) {
    xLabel = "Gender Ratio (Females per 1,000 Males)";
    yLabel = "Crimes Against Women (CAW)";
    xVal = (d: DistrictRecord) => d.genderRatio;

    const cawRecords = getCawRecords();
    yVal = (d: DistrictRecord) => {
      const rec = cawRecords.find(
        (r) => r.district.toLowerCase() === d.name.toLowerCase() && r.year === 2021,
      );
      return rec ? rec.total_caw : 0;
    };
  }

  const X = districts.map(xVal);
  const Y = districts.map(yVal);
  const correlation = pearsonCorrelation(X, Y);

  const chartData = districts.map((d) => ({
    district: d.name,
    xValue: xVal(d),
    yValue: yVal(d),
  }));

  const direction = correlation > 0 ? "positive" : "negative";
  const strength =
    Math.abs(correlation) > 0.7 ? "strong" : Math.abs(correlation) > 0.4 ? "moderate" : "weak";

  return {
    type: "correlation",
    insight: `Demographic correlation analysis reveals a ${strength} ${direction} correlation (Pearson r = ${correlation.toFixed(3)}) between ${xLabel} and ${yLabel} across the 31 districts of Karnataka.`,
    chartData: chartData as any,
    metrics: {
      correlation: correlation.toFixed(3),
      strength,
      direction,
      xLabel,
      yLabel,
    },
  };
}

function pearsonCorrelation(X: number[], Y: number[]): number {
  const n = X.length;
  if (n === 0) return 0;
  const xMean = X.reduce((s, v) => s + v, 0) / n;
  const yMean = Y.reduce((s, v) => s + v, 0) / n;
  const num = X.reduce((s, x, i) => s + (x - xMean) * (Y[i] - yMean), 0);
  const denX = X.reduce((s, x) => s + (x - xMean) ** 2, 0);
  const denY = Y.reduce((s, y) => s + (y - yMean) ** 2, 0);
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}

// ── Public entry point ─────────────────────────────────────────────────────────

export function runAnalysis(
  type: "trend" | "hotspot" | "network" | "prediction" | "caw" | "correlation",
  normalisedQuery = "",
): AnalysisResult {
  switch (type) {
    case "caw":
      return analyseCaw(normalisedQuery);
    case "hotspot":
      return analyseHotspots();
    case "network":
      return analyseNetwork();
    case "prediction":
      return analysePrediction();
    case "correlation":
      return analyseCorrelation(normalisedQuery);
    default:
      return analyseTrend();
  }
}
