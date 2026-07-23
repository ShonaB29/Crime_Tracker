/**
 * dataset-schema.ts
 *
 * TypeScript types that mirror every table and view in the Supabase migration.
 * These are the single source of truth for all modules — seeder, Text-to-SQL,
 * RAG, and Analysis Engine all import from here.
 *
 * Dataset sources:
 *   - districts          → India District Shapefiles + Census 2011
 *   - crime_india_annual → Crime in India 2001+ (NCRB / rajanand)
 *   - crimes_against_women → CAW 2001-2021 (balajivaraprasad)
 *   - police_stations    → Derived from NCRB station counts
 *   - accused / victims  → Simulated
 *   - firs               → Simulated FIR database (1.6 M records)
 */

// ── Enums ──────────────────────────────────────────────────────────────────────

export type CrimeSeverity = "Low" | "Medium" | "High" | "Critical";
export type CrimeStatus =
  "Open" | "Under Investigation" | "Pending Forensic" | "Solved" | "Filed In Court";
export type ArrestStatus = "Not Arrested" | "Arrested" | "Wanted" | "Bail Granted";
export type CourtStatus =
  "Not Filed" | "Charge Sheet Filed" | "Trial Pending" | "Convicted" | "Acquitted";
export type FirStatus = "Registered" | "Investigating" | "Charge Sheet Filed" | "Closed";
export type GenderType = "Male" | "Female" | "Other" | "Unknown";

// ── Table: districts ──────────────────────────────────────────────────────────
// Source: India District Shapefiles + Indian Census 2011

export interface District {
  id: string; // "KA-01"
  state: string;
  name: string;
  code: string; // "K001"
  latitude: number;
  longitude: number;
  area_sq_km: number;
  // Census 2011
  population: number;
  male_population: number;
  female_population: number;
  sex_ratio: number; // females per 1000 males
  literacy_rate: number; // percentage
  urban_population: number;
  rural_population: number;
  sc_population: number;
  st_population: number;
  // Derived
  police_station_count: number;
  hotspot_count: number;
}

// ── Table: crime_india_annual ─────────────────────────────────────────────────
// Source: Crime in India 2001+ (NCRB, rajanand/crime-in-india)

export interface CrimeIndiaAnnual {
  id: number;
  state: string;
  district: string;
  district_id: string | null;
  year: number;
  crime_head: string; // NCRB crime head e.g. "Murder", "Theft"
  crime_group: string; // e.g. "Violent Crime", "Property Crime"
  sub_group: string | null;
  cases_reported: number;
  cases_chargesheeted: number;
  cases_convicted: number;
  cases_acquitted: number;
  persons_arrested: number;
  persons_convicted: number;
}

// ── Table: crimes_against_women ───────────────────────────────────────────────
// Source: Crimes Against Women in India 2001-2021 (balajivaraprasad)

export interface CrimesAgainstWomen {
  id: number;
  state: string;
  district: string;
  district_id: string | null;
  year: number;
  rape: number;
  kidnapping_abduction: number;
  dowry_deaths: number;
  assault_on_women: number;
  insult_to_modesty: number;
  cruelty_by_husband: number;
  importation_of_girls: number;
  immoral_traffic: number;
  dowry_prohibition: number;
  indecent_representation: number;
  sati_prevention: number;
  total_caw: number;
}

// ── Table: police_stations ────────────────────────────────────────────────────

export interface PoliceStation {
  id: string;
  district_id: string;
  name: string;
  officer_name: string;
  officer_rank: string;
  latitude: number;
  longitude: number;
}

// ── Table: accused ────────────────────────────────────────────────────────────

export interface Accused {
  id: string;
  name: string;
  age: number;
  gender: GenderType;
  district_id: string | null;
  repeat_offender: boolean;
  modus_operandi: string;
  status: string;
}

// ── Table: victims ────────────────────────────────────────────────────────────

export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: GenderType;
  district_id: string | null;
  station_id: string | null;
  vulnerability_score: number;
}

// ── Table: firs ───────────────────────────────────────────────────────────────
// Simulated FIR database — 1.6 M records generated from NCRB distributions

export interface Fir {
  id: string;
  fir_number: string;
  case_number: string;
  district_id: string;
  station_id: string;
  crime_head: string;
  crime_group: string;
  ipc_section: string;
  is_caw: boolean;
  severity: CrimeSeverity;
  crime_status: CrimeStatus;
  arrest_status: ArrestStatus;
  court_status: CourtStatus;
  accused_id: string | null;
  victim_id: string | null;
  investigating_officer: string;
  latitude: number | null;
  longitude: number | null;
  weapon_used: string;
  modus_operandi: string;
  crime_date: string; // ISO date string
  fir_date: string;
  year: number;
  case_details: string; // narrative used by RAG
  annual_record_id: number | null;
  caw_record_id: number | null;
}

// ── View types ────────────────────────────────────────────────────────────────

export interface DistrictCrimeTotals {
  district_id: string;
  district_name: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  sex_ratio: number;
  literacy_rate: number;
  year: number;
  total_cases: number;
  total_arrested: number;
  total_convicted: number;
}

export interface CawSummary {
  district_name: string;
  state: string;
  year: number;
  rape: number;
  kidnapping_abduction: number;
  dowry_deaths: number;
  assault_on_women: number;
  cruelty_by_husband: number;
  total_caw: number;
  sex_ratio: number;
  population: number;
}

export interface FirSummary {
  district_id: string;
  district_name: string;
  year: number;
  crime_group: string;
  crime_head: string;
  severity: CrimeSeverity;
  crime_status: CrimeStatus;
  is_caw: boolean;
  fir_count: number;
}

// ── In-memory dataset container ───────────────────────────────────────────────

export interface CrimeDataset {
  districts: District[];
  policeStations: PoliceStation[];
  accused: Accused[];
  victims: Victim[];
  firs: Fir[];
  crimeIndiaAnnual: CrimeIndiaAnnual[];
  crimesAgainstWomen: CrimesAgainstWomen[];
}
