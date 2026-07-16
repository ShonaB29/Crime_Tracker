# Data Preprocessing & Cleaning Documentation
## KSP Crime Intelligence Platform

---

## 1. Overview

This document describes every preprocessing and cleaning step applied to the datasets used in the KSP Crime Intelligence platform. Two primary datasets are used:

| Dataset | Source | Records | Format |
|---|---|---|---|
| Crimes Against Women 2001–2021 | NCRB / Kaggle (balajivaraprasad) | 31 districts × 21 years = 651 rows | CSV → in-memory TypeScript |
| General Crime / FIR Database | NCRB Crime in India + simulated FIRs | 10,000 crimes + 5,000 FIRs | Seeded in-memory |

---

## 2. Raw Data Issues Identified

### 2.1 CAW Dataset (NCRB)

| Issue | Description | How Handled |
|---|---|---|
| Missing district-level breakdown | NCRB publishes state totals; district-level data is aggregated | Distributed using Census 2011 population weights (see §4) |
| Zero values for rare categories | `sati_prevention`, `importation_of_girls` are near-zero post-2010 | Kept as-is; `Math.max(0, ...)` prevents negative values |
| Year 2020 anomaly | COVID-19 caused a ~10% drop in reported cases | Retained as real signal; documented in trend analysis |
| Inconsistent column names | NCRB uses verbose names ("Assault on Women with Intent to Outrage Modesty") | Normalised to snake_case: `assault_on_women` |
| No district coordinates | NCRB data has no lat/lng | Merged with Census 2011 district centroids |

### 2.2 General Crime Dataset

| Issue | Description | How Handled |
|---|---|---|
| No real FIR text | NCRB does not publish individual FIR narratives | Synthetic narratives generated from crime category + MO templates |
| Imbalanced severity distribution | Real data skews toward Low/Medium | Uniform random distribution applied for demo balance |
| Missing accused/victim linkage | NCRB data has no individual-level records | Simulated with deterministic RNG (seed: 20260702) |
| Date gaps | Some months have no crimes in sparse districts | Handled by monthly bucketing with zero-fill |

---

## 3. Preprocessing Pipeline

```
Raw NCRB State Totals (KA_STATE_TOTALS)
        │
        ▼
Step 1: Validate year range (2001–2021)
        │
        ▼
Step 2: Apply Census 2011 population weights per district
        │  weight[district] = district_population / state_population
        │
        ▼
Step 3: Add ±15% stochastic noise (deterministic RNG, seed=20260702)
        │  noise() = 0.85 + rand() * 0.30
        │
        ▼
Step 4: Clamp to non-negative integers
        │  Math.max(0, Math.round(value))
        │
        ▼
Step 5: Compute total_caw = sum of all sub-categories
        │
        ▼
Step 6: Attach district coordinates (lat/lng from Census shapefile centroids)
        │
        ▼
Clean CawRecord[] — 651 rows, 15 columns, zero nulls
```

---

## 4. Population Weight Calculation

District-level crime counts are derived from Karnataka state totals using Census 2011 population weights:

```
district_count = state_total × (district_population / state_population) × noise_factor
```

**Example — Bengaluru Urban (weight = 0.145):**
```
rape_2021 = 2135 × 0.145 × noise ≈ 309 ± 46 cases
```

The 31 district weights sum to 1.0 (verified in test suite — `analysis-engine.test.ts`, test: *"population-weighted district share sums to ~1.0"*).

---

## 5. Deterministic Random Number Generator

To ensure **reproducibility** (same data on every server restart), a custom xorshift32 RNG is used with a fixed seed:

```typescript
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xFFFFFFFF;  // [0, 1)
  };
}
const rand = rng(20260702);  // Fixed seed — same output every run
```

**Why this matters:** Without a fixed seed, crime counts would change on every server restart, making the system non-reproducible and untestable.

---

## 6. Data Cleaning Functions

### 6.1 `clamp(value, min, max)`
Prevents out-of-range values. Used for:
- Risk scores: `clamp(score, 20, 99)`
- Heatmap intensity: `clamp(intensity, 0.35, 1.0)`
- Vulnerability scores: `clamp(score, 0, 100)`

```typescript
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
```

### 6.2 `monthKey(isoDate)`
Normalises ISO datetime strings to `YYYY-MM` for monthly aggregation:

```typescript
function monthKey(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
```

### 6.3 `matchesSearch(value, search)`
Case-insensitive substring search for filtering:

```typescript
function matchesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}
```

### 6.4 `paginate(records, page, pageSize)`
Prevents out-of-bounds access on large datasets:

```typescript
function paginate<T>(records: T[], page = 1, pageSize = 20) {
  const safePage     = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  // ...
}
```

---

## 7. Feature Engineering

The following derived features are computed from raw data:

| Feature | Formula | Used In |
|---|---|---|
| `crimeRate` | `totalCrimes / districtCount` | Dashboard KPI |
| `hotspotScore` | `(crimeCount / totalCrimes) × 100 × n × 0.6 + hotspotCount × 1.5` | Hotspot detection |
| `riskScore` | `crimeCount / 25 + hotspotCount × 2.8 + rank × 1.1` | Analytics risk grid |
| `cawHotspotScore` | `(district_caw / state_caw) × 100 × n × 0.8` | CAW heatmap |
| `vulnerabilityScore` | `20 + rand() × 80` | Victim profiling |
| `yoyChange` | `(current - previous) / previous × 100` | CAW trend insight |
| `solveRate` | `solvedCases / totalCrimes × 100` | Analytics KPI |

---

## 8. Data Validation Rules

All records are validated at seed time:

| Field | Rule |
|---|---|
| `year` | Must be between 2001 and 2021 |
| `age` (accused) | Must be between 18 and 57 |
| `age` (victim) | Must be between 11 and 74 |
| `latitude` | Must be within Karnataka bounds: 11.5°N – 18.5°N |
| `longitude` | Must be within Karnataka bounds: 74.0°E – 78.5°E |
| `severity` | Must be one of: Low, Medium, High, Critical |
| `status` | Must be one of the defined CrimeStatus enum values |
| All counts | `Math.max(0, Math.round(...))` — no negatives, no decimals |

---

## 9. SQL Schema Constraints

The Supabase migration (`20260702000001_dataset_schema.sql`) enforces data integrity at the database level:

```sql
year   SMALLINT NOT NULL CHECK (year BETWEEN 2001 AND 2030)
age    SMALLINT NOT NULL CHECK (age BETWEEN 10 AND 90)
vulnerability_score SMALLINT NOT NULL DEFAULT 50
                    CHECK (vulnerability_score BETWEEN 0 AND 100)
```

PostgreSQL enums enforce valid values for `crime_severity`, `crime_status`, `arrest_status`, `court_status`, `fir_status`, and `gender_type`.

---

## 10. Reproducibility Statement

All data in this platform is **fully reproducible**:
- Fixed RNG seed (`20260702`) ensures identical output on every run.
- NCRB state totals are hardcoded constants anchored to published figures.
- Population weights are derived from Census 2011 (public domain).
- No external API calls are made during data generation.

To regenerate the entire dataset: restart the server. The `ensureDataset()` function in `crime-platform.server.ts` rebuilds all 10,000 crimes, 5,000 FIRs, and 651 CAW records deterministically.
