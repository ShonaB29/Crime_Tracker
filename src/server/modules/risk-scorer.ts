import { DistrictRecord, CrimeRecord } from "../crime-platform.server";

export interface DynamicRiskScore {
  districtId: string;
  district: string;
  score: number; // 0 to 100
  level: "Low" | "Medium" | "High";
  reasons: string[];
  metrics: {
    frequencyScore: number;
    trendScore: number;
    repeatOffenderScore: number;
    severityScore: number;
  };
}

/**
 * Calculates dynamic risk scores (0-100) for all districts.
 * Based on crime frequency, monthly trends, repeat offender presence, and case severity.
 */
export function calculateDistrictRiskScores(
  districts: DistrictRecord[],
  crimes: CrimeRecord[]
): DynamicRiskScore[] {
  // Find maximum crime count across all districts to normalize frequency
  const maxCrimes = Math.max(...districts.map((d) => d.crimeCount), 1);

  return districts.map((district) => {
    const districtCrimes = crimes.filter((c) => c.districtId === district.id);
    const totalCrimes = districtCrimes.length;

    // 1. Crime Frequency Score (max 40 pts)
    const freqScore = (district.crimeCount / maxCrimes) * 40;

    // 2. Recent Trend Score (max 20 pts)
    // Compare last 3 months average to previous 3 months average in district.trend (12 months)
    const trend = district.trend ?? [];
    let trendScore = 10; // Neutral default
    let trendPctChange = 0;
    if (trend.length >= 6) {
      const last3 = trend.slice(-3);
      const prev3 = trend.slice(-6, -3);
      const avgLast3 = last3.reduce((s, v) => s + v, 0) / 3;
      const avgPrev3 = prev3.reduce((s, v) => s + v, 0) / 3;
      trendPctChange = avgPrev3 > 0 ? (avgLast3 - avgPrev3) / avgPrev3 : 0;
      // Clamp trendPctChange between -0.5 and 0.5, then map to 0 - 20
      trendScore = Math.max(0, Math.min(20, (trendPctChange + 0.5) * 20));
    }

    // 3. Repeat Offenders Score (max 20 pts)
    const repeatOffendersCount = districtCrimes.filter((c) => c.repeatOffender).length;
    const repeatRatio = totalCrimes > 0 ? repeatOffendersCount / totalCrimes : 0;
    // Scale so 33% repeat offender ratio is max score (20 pts)
    const repeatScore = Math.max(0, Math.min(20, repeatRatio * 60));

    // 4. Crime Severity Score (max 20 pts)
    const criticalOrHighCount = districtCrimes.filter(
      (c) => c.severity === "Critical" || c.severity === "High"
    ).length;
    const severityRatio = totalCrimes > 0 ? criticalOrHighCount / totalCrimes : 0;
    // Scale so 50% severity ratio is max score (20 pts)
    const severityScore = Math.max(0, Math.min(20, severityRatio * 40));

    // Sum and round
    const score = Math.max(0, Math.min(100, Math.round(freqScore + trendScore + repeatScore + severityScore)));

    // Risk level
    let level: "Low" | "Medium" | "High" = "Medium";
    if (score >= 70) {
      level = "High";
    } else if (score < 40) {
      level = "Low";
    }

    // Dynamic reasons based on contributing factors
    const reasons: string[] = [];
    if (freqScore >= 25) {
      reasons.push("High baseline crime frequency");
    }
    if (trendPctChange >= 0.15) {
      reasons.push(`Recent crime spike (+${Math.round(trendPctChange * 100)}%)`);
    }
    if (repeatScore >= 14) {
      reasons.push("Elevated volume of active repeat offenders");
    }
    if (severityScore >= 14) {
      reasons.push("High proportion of critical/high-severity cases");
    }
    if (reasons.length === 0) {
      reasons.push("Stable crime frequency and severity profiles");
    }

    return {
      districtId: district.id,
      district: district.name,
      score,
      level,
      reasons,
      metrics: {
        frequencyScore: Math.round(freqScore * 10) / 10,
        trendScore: Math.round(trendScore * 10) / 10,
        repeatOffenderScore: Math.round(repeatScore * 10) / 10,
        severityScore: Math.round(severityScore * 10) / 10,
      },
    };
  });
}
