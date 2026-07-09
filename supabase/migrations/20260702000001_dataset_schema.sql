-- =============================================================================
-- Migration: KSP Crime Intelligence — Full Dataset Schema
-- Covers:
--   1. Crime in India 2001+ (Kaggle: rajanand/crime-in-india)
--   2. Crimes Against Women 2001-2021 (Kaggle: balajivaraprasad)
--   3. Indian Census 2011 (population, literacy, sex ratio per district)
--   4. India District Shapefiles (lat/lng centroid + bounding box)
--   5. Simulated FIR Database (1.6 M synthetic records)
-- =============================================================================

-- ── Enums ─────────────────────────────────────────────────────────────────────

CREATE TYPE public.crime_severity   AS ENUM ('Low','Medium','High','Critical');
CREATE TYPE public.crime_status     AS ENUM ('Open','Under Investigation','Pending Forensic','Solved','Filed In Court');
CREATE TYPE public.arrest_status    AS ENUM ('Not Arrested','Arrested','Wanted','Bail Granted');
CREATE TYPE public.court_status     AS ENUM ('Not Filed','Charge Sheet Filed','Trial Pending','Convicted','Acquitted');
CREATE TYPE public.fir_status       AS ENUM ('Registered','Investigating','Charge Sheet Filed','Closed');
CREATE TYPE public.gender_type      AS ENUM ('Male','Female','Other','Unknown');

-- ── TABLE 1: districts ────────────────────────────────────────────────────────
-- Source: India District Shapefiles + Census 2011
-- Stores one row per district with geographic centroid and census demographics.

CREATE TABLE public.districts (
  id                  TEXT        PRIMARY KEY,          -- e.g. "KA-01"
  state               TEXT        NOT NULL DEFAULT 'Karnataka',
  name                TEXT        NOT NULL,
  code                TEXT        NOT NULL UNIQUE,      -- e.g. "K001"

  -- Geography (from shapefile centroids)
  latitude            DOUBLE PRECISION NOT NULL,
  longitude           DOUBLE PRECISION NOT NULL,
  area_sq_km          INTEGER     NOT NULL DEFAULT 0,

  -- Census 2011 demographics
  population          INTEGER     NOT NULL DEFAULT 0,
  male_population     INTEGER     NOT NULL DEFAULT 0,
  female_population   INTEGER     NOT NULL DEFAULT 0,
  sex_ratio           INTEGER     NOT NULL DEFAULT 0,   -- females per 1000 males
  literacy_rate       NUMERIC(5,2) NOT NULL DEFAULT 0,  -- percentage
  urban_population    INTEGER     NOT NULL DEFAULT 0,
  rural_population    INTEGER     NOT NULL DEFAULT 0,
  sc_population       INTEGER     NOT NULL DEFAULT 0,   -- Scheduled Caste
  st_population       INTEGER     NOT NULL DEFAULT 0,   -- Scheduled Tribe

  -- Derived crime stats (updated by triggers / seeder)
  police_station_count INTEGER    NOT NULL DEFAULT 0,
  hotspot_count        INTEGER    NOT NULL DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_districts_state ON public.districts(state);
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "districts_read" ON public.districts FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.districts TO authenticated;
GRANT ALL   ON public.districts TO service_role;

-- ── TABLE 2: crime_india_annual ───────────────────────────────────────────────
-- Source: Crime in India 2001+ (NCRB data, rajanand/crime-in-india)
-- One row per (state, district, year, crime_head) aggregation.

CREATE TABLE public.crime_india_annual (
  id              BIGSERIAL   PRIMARY KEY,
  state           TEXT        NOT NULL,
  district        TEXT        NOT NULL,
  district_id     TEXT        REFERENCES public.districts(id) ON DELETE SET NULL,
  year            SMALLINT    NOT NULL CHECK (year BETWEEN 2001 AND 2030),

  -- NCRB crime head classification
  crime_head      TEXT        NOT NULL,   -- e.g. "Murder", "Theft", "Robbery"
  crime_group     TEXT        NOT NULL,   -- e.g. "Violent Crime", "Property Crime"
  sub_group       TEXT,

  -- NCRB reported counts
  cases_reported  INTEGER     NOT NULL DEFAULT 0,
  cases_chargesheeted INTEGER NOT NULL DEFAULT 0,
  cases_convicted INTEGER     NOT NULL DEFAULT 0,
  cases_acquitted INTEGER     NOT NULL DEFAULT 0,
  persons_arrested INTEGER    NOT NULL DEFAULT 0,
  persons_convicted INTEGER   NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cia_district_year  ON public.crime_india_annual(district_id, year);
CREATE INDEX idx_cia_state_year     ON public.crime_india_annual(state, year);
CREATE INDEX idx_cia_crime_head     ON public.crime_india_annual(crime_head);
ALTER TABLE public.crime_india_annual ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cia_read" ON public.crime_india_annual FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.crime_india_annual TO authenticated;
GRANT ALL   ON public.crime_india_annual TO service_role;

-- ── TABLE 3: crimes_against_women ─────────────────────────────────────────────
-- Source: Crimes Against Women in India 2001-2021
--         (balajivaraprasad/crimes-against-women-in-india-2001-2021)
-- One row per (state, district, year) with all CAW sub-categories as columns.

CREATE TABLE public.crimes_against_women (
  id                      BIGSERIAL   PRIMARY KEY,
  state                   TEXT        NOT NULL,
  district                TEXT        NOT NULL,
  district_id             TEXT        REFERENCES public.districts(id) ON DELETE SET NULL,
  year                    SMALLINT    NOT NULL CHECK (year BETWEEN 2001 AND 2021),

  -- CAW sub-categories (NCRB column names preserved)
  rape                    INTEGER     NOT NULL DEFAULT 0,
  kidnapping_abduction    INTEGER     NOT NULL DEFAULT 0,
  dowry_deaths            INTEGER     NOT NULL DEFAULT 0,
  assault_on_women        INTEGER     NOT NULL DEFAULT 0,
  insult_to_modesty       INTEGER     NOT NULL DEFAULT 0,
  cruelty_by_husband      INTEGER     NOT NULL DEFAULT 0,
  importation_of_girls    INTEGER     NOT NULL DEFAULT 0,
  immoral_traffic         INTEGER     NOT NULL DEFAULT 0,
  dowry_prohibition       INTEGER     NOT NULL DEFAULT 0,
  indecent_representation INTEGER     NOT NULL DEFAULT 0,
  sati_prevention         INTEGER     NOT NULL DEFAULT 0,
  total_caw               INTEGER     NOT NULL DEFAULT 0,  -- sum of above

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_caw_district_year ON public.crimes_against_women(district_id, year);
CREATE INDEX idx_caw_state_year    ON public.crimes_against_women(state, year);
ALTER TABLE public.crimes_against_women ENABLE ROW LEVEL SECURITY;
CREATE POLICY "caw_read" ON public.crimes_against_women FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.crimes_against_women TO authenticated;
GRANT ALL   ON public.crimes_against_women TO service_role;

-- ── TABLE 4: police_stations ──────────────────────────────────────────────────
-- Derived from district shapefile + NCRB station counts

CREATE TABLE public.police_stations (
  id              TEXT        PRIMARY KEY,
  district_id     TEXT        NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  officer_name    TEXT        NOT NULL DEFAULT '',
  officer_rank    TEXT        NOT NULL DEFAULT 'Inspector',
  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ps_district ON public.police_stations(district_id);
ALTER TABLE public.police_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ps_read" ON public.police_stations FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.police_stations TO authenticated;
GRANT ALL   ON public.police_stations TO service_role;

-- ── TABLE 5: accused ──────────────────────────────────────────────────────────
-- Simulated accused persons linked to FIRs

CREATE TABLE public.accused (
  id              TEXT        PRIMARY KEY,
  name            TEXT        NOT NULL,
  age             SMALLINT    NOT NULL CHECK (age BETWEEN 10 AND 90),
  gender          public.gender_type NOT NULL DEFAULT 'Male',
  district_id     TEXT        REFERENCES public.districts(id) ON DELETE SET NULL,
  repeat_offender BOOLEAN     NOT NULL DEFAULT false,
  modus_operandi  TEXT        NOT NULL DEFAULT '',
  status          TEXT        NOT NULL DEFAULT 'Active',  -- Active|Arrested|Wanted|Charged
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_accused_district    ON public.accused(district_id);
CREATE INDEX idx_accused_repeat      ON public.accused(repeat_offender);
ALTER TABLE public.accused ENABLE ROW LEVEL SECURITY;
CREATE POLICY "accused_read" ON public.accused FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.accused TO authenticated;
GRANT ALL   ON public.accused TO service_role;

-- ── TABLE 6: victims ──────────────────────────────────────────────────────────
-- Simulated victim records

CREATE TABLE public.victims (
  id                  TEXT        PRIMARY KEY,
  name                TEXT        NOT NULL,
  age                 SMALLINT    NOT NULL CHECK (age BETWEEN 0 AND 100),
  gender              public.gender_type NOT NULL DEFAULT 'Female',
  district_id         TEXT        REFERENCES public.districts(id) ON DELETE SET NULL,
  station_id          TEXT        REFERENCES public.police_stations(id) ON DELETE SET NULL,
  vulnerability_score SMALLINT    NOT NULL DEFAULT 50 CHECK (vulnerability_score BETWEEN 0 AND 100),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_victims_district ON public.victims(district_id);
ALTER TABLE public.victims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "victims_read" ON public.victims FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.victims TO authenticated;
GRANT ALL   ON public.victims TO service_role;

-- ── TABLE 7: firs (Simulated FIR Database) ────────────────────────────────────
-- 1.6 M synthetic FIRs generated from NCRB crime distributions.
-- Each FIR links to a crime_india_annual row for its crime_head/year,
-- and optionally to a crimes_against_women row when applicable.

CREATE TABLE public.firs (
  id                  TEXT        PRIMARY KEY,
  fir_number          TEXT        NOT NULL UNIQUE,
  case_number         TEXT        NOT NULL UNIQUE,

  -- Location
  district_id         TEXT        NOT NULL REFERENCES public.districts(id),
  station_id          TEXT        NOT NULL REFERENCES public.police_stations(id),

  -- Classification (aligned with NCRB crime heads)
  crime_head          TEXT        NOT NULL,
  crime_group         TEXT        NOT NULL,
  ipc_section         TEXT        NOT NULL DEFAULT '',
  is_caw              BOOLEAN     NOT NULL DEFAULT false,  -- crimes against women flag

  -- Severity & status
  severity            public.crime_severity   NOT NULL DEFAULT 'Medium',
  crime_status        public.crime_status     NOT NULL DEFAULT 'Open',
  arrest_status       public.arrest_status    NOT NULL DEFAULT 'Not Arrested',
  court_status        public.court_status     NOT NULL DEFAULT 'Not Filed',

  -- People
  accused_id          TEXT        REFERENCES public.accused(id) ON DELETE SET NULL,
  victim_id           TEXT        REFERENCES public.victims(id) ON DELETE SET NULL,
  investigating_officer TEXT      NOT NULL DEFAULT '',

  -- Geography
  latitude            DOUBLE PRECISION,
  longitude           DOUBLE PRECISION,
  weapon_used         TEXT        NOT NULL DEFAULT 'No Weapon',
  modus_operandi      TEXT        NOT NULL DEFAULT '',

  -- Dates
  crime_date          DATE        NOT NULL,
  fir_date            DATE        NOT NULL,
  year                SMALLINT    NOT NULL,

  -- Narrative (used by RAG module)
  case_details        TEXT        NOT NULL DEFAULT '',

  -- Source dataset linkage
  annual_record_id    BIGINT      REFERENCES public.crime_india_annual(id) ON DELETE SET NULL,
  caw_record_id       BIGINT      REFERENCES public.crimes_against_women(id) ON DELETE SET NULL,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX idx_firs_district       ON public.firs(district_id);
CREATE INDEX idx_firs_station        ON public.firs(station_id);
CREATE INDEX idx_firs_year           ON public.firs(year);
CREATE INDEX idx_firs_crime_head     ON public.firs(crime_head);
CREATE INDEX idx_firs_crime_group    ON public.firs(crime_group);
CREATE INDEX idx_firs_status         ON public.firs(crime_status);
CREATE INDEX idx_firs_severity       ON public.firs(severity);
CREATE INDEX idx_firs_is_caw         ON public.firs(is_caw);
CREATE INDEX idx_firs_crime_date     ON public.firs(crime_date);
CREATE INDEX idx_firs_accused        ON public.firs(accused_id);
CREATE INDEX idx_firs_victim         ON public.firs(victim_id);

ALTER TABLE public.firs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "firs_read"   ON public.firs FOR SELECT TO authenticated USING (true);
CREATE POLICY "firs_insert" ON public.firs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "firs_update" ON public.firs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "firs_delete" ON public.firs FOR DELETE TO authenticated USING (
  public.has_role(auth.uid(), 'admin')
);
GRANT SELECT, INSERT, UPDATE ON public.firs TO authenticated;
GRANT ALL ON public.firs TO service_role;

-- Auto-update updated_at on firs
CREATE TRIGGER update_firs_updated_at
BEFORE UPDATE ON public.firs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── Analytical views ──────────────────────────────────────────────────────────

-- View: annual crime totals per district (Text-to-SQL target)
CREATE VIEW public.v_district_crime_totals AS
SELECT
  d.id            AS district_id,
  d.name          AS district_name,
  d.state,
  d.latitude,
  d.longitude,
  d.population,
  d.sex_ratio,
  d.literacy_rate,
  cia.year,
  SUM(cia.cases_reported)   AS total_cases,
  SUM(cia.persons_arrested) AS total_arrested,
  SUM(cia.cases_convicted)  AS total_convicted
FROM public.districts d
JOIN public.crime_india_annual cia ON cia.district_id = d.id
GROUP BY d.id, d.name, d.state, d.latitude, d.longitude,
         d.population, d.sex_ratio, d.literacy_rate, cia.year;

GRANT SELECT ON public.v_district_crime_totals TO authenticated;

-- View: CAW summary per district per year
CREATE VIEW public.v_caw_summary AS
SELECT
  d.name          AS district_name,
  d.state,
  caw.year,
  caw.rape,
  caw.kidnapping_abduction,
  caw.dowry_deaths,
  caw.assault_on_women,
  caw.cruelty_by_husband,
  caw.total_caw,
  d.sex_ratio,
  d.population
FROM public.crimes_against_women caw
JOIN public.districts d ON d.id = caw.district_id;

GRANT SELECT ON public.v_caw_summary TO authenticated;

-- View: FIR summary for dashboard (avoids full table scan)
CREATE VIEW public.v_fir_summary AS
SELECT
  f.district_id,
  d.name          AS district_name,
  f.year,
  f.crime_group,
  f.crime_head,
  f.severity,
  f.crime_status,
  f.is_caw,
  COUNT(*)        AS fir_count
FROM public.firs f
JOIN public.districts d ON d.id = f.district_id
GROUP BY f.district_id, d.name, f.year, f.crime_group,
         f.crime_head, f.severity, f.crime_status, f.is_caw;

GRANT SELECT ON public.v_fir_summary TO authenticated;
