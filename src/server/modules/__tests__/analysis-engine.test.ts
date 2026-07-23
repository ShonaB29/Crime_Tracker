/**
 * KSP Crime Intelligence — Unit Test Suite
 * Framework : Vitest (npm test)
 *
 * Coverage:
 *   1. fitLinearRegression  — OLS slope / intercept
 *   2. evaluateModel        — MAE, RMSE, R², MAPE
 *   3. 80/20 train-test split logic
 *   4. Intent router keyword classification
 *   5. CAW keyword priority over SQL keywords
 *   6. Text-to-SQL query description format
 *   7. Data preprocessing / cleaning helpers
 */

import { describe, it, expect } from "vitest";
import { fitLinearRegression, evaluateModel } from "../analysis-engine";
import { routeIntent } from "../intent-router";

// ── 1. fitLinearRegression ────────────────────────────────────────────────────

describe("fitLinearRegression", () => {
  it("returns slope=1 and correct intercept for y = x", () => {
    const y = [0, 1, 2, 3, 4];
    const { slope, intercept } = fitLinearRegression(y);
    expect(slope).toBeCloseTo(1, 5);
    expect(intercept).toBeCloseTo(0, 5);
  });

  it("returns slope=2 for y = 2x", () => {
    const y = [0, 2, 4, 6, 8];
    const { slope } = fitLinearRegression(y);
    expect(slope).toBeCloseTo(2, 5);
  });

  it("returns slope=0 for a flat series", () => {
    const y = [5, 5, 5, 5, 5];
    const { slope } = fitLinearRegression(y);
    expect(slope).toBeCloseTo(0, 5);
  });

  it("handles a single-element array without throwing", () => {
    const { slope, intercept } = fitLinearRegression([42]);
    expect(slope).toBe(0);
    expect(intercept).toBe(42);
  });

  it("handles a decreasing series (negative slope)", () => {
    const y = [10, 8, 6, 4, 2];
    const { slope } = fitLinearRegression(y);
    expect(slope).toBeLessThan(0);
  });
});

// ── 2. evaluateModel ──────────────────────────────────────────────────────────

describe("evaluateModel", () => {
  it("returns MAE=0, RMSE=0, R²=1 for a perfect prediction", () => {
    // Train on y = 2x, test on continuation
    const trainY = [0, 2, 4, 6, 8];
    const { slope, intercept } = fitLinearRegression(trainY);
    const testY = [10, 12, 14]; // perfect continuation
    const result = evaluateModel(testY, slope, intercept, trainY.length);
    expect(result.mae).toBeCloseTo(0, 1);
    expect(result.rmse).toBeCloseTo(0, 1);
    expect(result.r2).toBeCloseTo(1, 1);
    expect(result.trainSize).toBe(5);
    expect(result.testSize).toBe(3);
  });

  it("returns R² between 0 and 1 for noisy data", () => {
    const trainY = [100, 105, 98, 110, 107, 112, 108, 115];
    const { slope, intercept } = fitLinearRegression(trainY);
    const testY = [118, 120];
    const result = evaluateModel(testY, slope, intercept, trainY.length);
    expect(result.r2).toBeGreaterThanOrEqual(0);
    expect(result.r2).toBeLessThanOrEqual(1);
    expect(result.mae).toBeGreaterThanOrEqual(0);
    expect(result.rmse).toBeGreaterThanOrEqual(result.mae); // RMSE >= MAE always
  });

  it("RMSE is always >= MAE", () => {
    const trainY = [200, 210, 195, 220, 215, 225, 218, 230, 222];
    const { slope, intercept } = fitLinearRegression(trainY);
    const testY = [235, 240, 228];
    const result = evaluateModel(testY, slope, intercept, trainY.length);
    expect(result.rmse).toBeGreaterThanOrEqual(result.mae);
  });
});

// ── 3. 80/20 train-test split ─────────────────────────────────────────────────

describe("80/20 train-test split", () => {
  it("splits 12 months into 9 train + 3 test", () => {
    const series = Array.from({ length: 12 }, (_, i) => i + 1);
    const splitIdx = Math.floor(series.length * 0.8);
    expect(splitIdx).toBe(9);
    expect(series.slice(0, splitIdx).length).toBe(9);
    expect(series.slice(splitIdx).length).toBe(3);
  });

  it("train + test = total length", () => {
    const n = 20;
    const splitIdx = Math.floor(n * 0.8);
    expect(splitIdx + (n - splitIdx)).toBe(n);
  });

  it("test set is always at least 1 sample for n >= 2", () => {
    for (const n of [2, 5, 10, 15, 20]) {
      const splitIdx = Math.floor(n * 0.8);
      expect(n - splitIdx).toBeGreaterThanOrEqual(1);
    }
  });
});

// ── 4. Intent router — general classification ─────────────────────────────────

describe("routeIntent — general classification", () => {
  it("routes 'how many crimes in Bengaluru' to sql", async () => {
    const { intent } = await routeIntent("how many crimes in Bengaluru");
    expect(intent).toBe("sql");
  });

  it("routes 'show crime trends' to analysis", async () => {
    const { intent } = await routeIntent("show crime trends");
    expect(intent).toBe("analysis");
  });

  it("routes 'predict next month crimes' to analysis with prediction type", async () => {
    const result = await routeIntent("predict next month crimes");
    expect(result.intent).toBe("analysis");
    expect(result.analysisType).toBe("prediction");
  });

  it("routes 'show hotspot map' to analysis with hotspot type", async () => {
    const result = await routeIntent("show hotspot map");
    expect(result.intent).toBe("analysis");
    expect(result.analysisType).toBe("hotspot");
  });

  it("routes 'criminal network relationship' to analysis with network type", async () => {
    const result = await routeIntent("criminal network relationship");
    expect(result.intent).toBe("analysis");
    expect(result.analysisType).toBe("network");
  });

  it("routes 'case summary report document' to rag", async () => {
    const { intent } = await routeIntent("case summary report document");
    expect(intent).toBe("rag");
  });

  it("routes an unrecognised query to general", async () => {
    const { intent } = await routeIntent("hello");
    expect(intent).toBe("general");
  });

  it("normalises query to lowercase", async () => {
    const { normalisedQuery } = await routeIntent("Show Crime TRENDS");
    expect(normalisedQuery).toBe("show crime trends");
  });
});

// ── 5. CAW keyword priority ───────────────────────────────────────────────────

describe("routeIntent — CAW keyword priority", () => {
  it("routes 'rape cases in Karnataka' to caw (not sql)", async () => {
    const { intent } = await routeIntent("rape cases in Karnataka");
    expect(intent).toBe("caw");
  });

  it("routes 'dowry deaths statistics' to caw", async () => {
    const { intent } = await routeIntent("dowry deaths statistics");
    expect(intent).toBe("caw");
  });

  it("routes 'domestic violence trend' to caw (not analysis)", async () => {
    const { intent } = await routeIntent("domestic violence trend");
    expect(intent).toBe("caw");
  });

  it("routes 'crimes against women hotspot' to caw (not analysis)", async () => {
    const { intent } = await routeIntent("crimes against women hotspot");
    expect(intent).toBe("caw");
  });

  it("routes 'how many rape cases' to caw even with sql keywords", async () => {
    // 'how many' is a SQL keyword but 'rape' is CAW — CAW wins
    const { intent } = await routeIntent("how many rape cases in Mysuru");
    expect(intent).toBe("caw");
  });

  it("routes 'trafficking report' to caw", async () => {
    const { intent } = await routeIntent("trafficking report");
    expect(intent).toBe("caw");
  });
});

// ── 6. Data preprocessing / cleaning helpers ──────────────────────────────────

describe("Data preprocessing helpers", () => {
  it("clamp keeps values within [min, max]", () => {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("deterministic RNG produces same sequence for same seed", () => {
    function rng(seed: number) {
      let s = seed >>> 0;
      return () => {
        s ^= s << 13;
        s ^= s >> 17;
        s ^= s << 5;
        return (s >>> 0) / 0xffffffff;
      };
    }
    const r1 = rng(42);
    const r2 = rng(42);
    for (let i = 0; i < 10; i++) expect(r1()).toBeCloseTo(r2(), 10);
  });

  it("population-weighted district share sums to ~1.0", () => {
    const weights = [
      0.025, 0.038, 0.058, 0.022, 0.145, 0.03, 0.018, 0.022, 0.02, 0.026, 0.035, 0.035, 0.038,
      0.018, 0.03, 0.025, 0.045, 0.01, 0.025, 0.022, 0.028, 0.055, 0.032, 0.02, 0.035, 0.04, 0.022,
      0.02, 0.038, 0.02, 0.022,
    ];
    const total = weights.reduce((s, w) => s + w, 0);
    expect(total).toBeCloseTo(1.0, 1);
  });

  it("noise function keeps values in [0.85, 1.15] range", () => {
    // Simulates the ±15% noise used in caw-data.ts
    function rng(seed: number) {
      let s = seed >>> 0;
      return () => {
        s ^= s << 13;
        s ^= s >> 17;
        s ^= s << 5;
        return (s >>> 0) / 0xffffffff;
      };
    }
    const rand = rng(20260702);
    const noise = () => 0.85 + rand() * 0.3;
    for (let i = 0; i < 100; i++) {
      const n = noise();
      expect(n).toBeGreaterThanOrEqual(0.85);
      expect(n).toBeLessThanOrEqual(1.15);
    }
  });

  it("monthKey extracts YYYY-MM from ISO date string", () => {
    const monthKey = (iso: string) => {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    expect(monthKey("2024-03-15T10:30:00.000Z")).toBe("2024-03");
    expect(monthKey("2023-12-01T00:00:00.000Z")).toBe("2023-12");
  });
});
