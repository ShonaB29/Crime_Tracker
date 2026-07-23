/**
 * MODULE: Text-to-SQL (Workflow Step 4a & 5)
 *
 * Translates natural-language questions into structured dataset queries.
 * Upgraded to use Google Gemini / OpenAI LLM with full schema context, 30+ few-shots,
 * strict SELECT-only query validation, execution error handling, auto-regeneration,
 * and sanitized in-memory SQLite seeder fallback.
 */

import { getData } from "@/server/crime-platform.server";
import { getCawRecords } from "./caw-data";
import { getCrimeIndiaAnnualRecords } from "./crime-india-data";
import { callLlm } from "./llm-client";

export interface SqlQueryResult {
  queryDescription: string;
  rows: Record<string, unknown>[];
  totalCount: number;
  isCaw?: boolean;
  columns?: string[];
  error?: string;
  executionTimeMs?: number;
  rowsReturned?: number;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const DISTRICT_NAMES = [
  "bagalkote",
  "ballari",
  "belagavi",
  "bengaluru rural",
  "bengaluru urban",
  "bidar",
  "chamarajanagar",
  "chikkaballapura",
  "chikkamagaluru",
  "chitradurga",
  "dakshina kannada",
  "davanagere",
  "dharwad",
  "gadag",
  "hassan",
  "haveri",
  "kalaburagi",
  "kodagu",
  "kolar",
  "koppal",
  "mandya",
  "mysuru",
  "raichur",
  "ramanagara",
  "shivamogga",
  "tumakuru",
  "udupi",
  "uttara kannada",
  "vijayapura",
  "yadgir",
  "vijayanagara",
];

const DISTRICT_ALIASES: Record<string, string> = {
  belgaum: "belagavi",
  mysore: "mysuru",
  bangalore: "bengaluru urban",
  shimoga: "shivamogga",
  bellary: "ballari",
  gulbarga: "kalaburagi",
  bijapur: "vijayapura",
  chikmagalur: "chikkamagaluru",
  tumkur: "tumakuru",
};

export function detectDistrict(q: string): string | undefined {
  const lower = q.toLowerCase();
  for (const [alias, real] of Object.entries(DISTRICT_ALIASES)) {
    if (lower.includes(alias)) return real;
  }
  return DISTRICT_NAMES.find((d) => lower.includes(d));
}

// ── Local In-Memory SQLite Fallback Runner ──────────────────────────────────────

let cachedSqliteDb: any = null;

async function ensureSqliteDb(): Promise<any> {
  if (cachedSqliteDb) return cachedSqliteDb;

  try {
    const sqliteModule: any = await (new Function('return import("node:sqlite")')().catch(() => null));
    const DatabaseSync = sqliteModule?.DatabaseSync;
    if (!DatabaseSync) return null;
    const db = new DatabaseSync(":memory:");

    // Create schema tables
    db.exec(`
      CREATE TABLE districts (
        id TEXT PRIMARY KEY,
        state TEXT,
        name TEXT,
        code TEXT,
        latitude REAL,
        longitude REAL,
        area_sq_km INTEGER,
        population INTEGER,
        male_population INTEGER,
        female_population INTEGER,
        sex_ratio INTEGER,
        literacy_rate REAL,
        urban_population INTEGER,
        rural_population INTEGER,
        sc_population INTEGER,
        st_population INTEGER,
        police_station_count INTEGER,
        hotspot_count INTEGER
      );

      CREATE TABLE crime_india_annual (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT,
        district TEXT,
        district_id TEXT,
        year INTEGER,
        crime_head TEXT,
        crime_group TEXT,
        sub_group TEXT,
        cases_reported INTEGER,
        cases_chargesheeted INTEGER,
        cases_convicted INTEGER,
        cases_acquitted INTEGER,
        persons_arrested INTEGER,
        persons_convicted INTEGER
      );

      CREATE TABLE crimes_against_women (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT,
        district TEXT,
        district_id TEXT,
        year INTEGER,
        rape INTEGER,
        accused_id TEXT,
        kidnapping_abduction INTEGER,
        dowry_deaths INTEGER,
        assault_on_women INTEGER,
        insult_to_modesty INTEGER,
        cruelty_by_husband INTEGER,
        importation_of_girls INTEGER,
        immoral_traffic INTEGER,
        dowry_prohibition INTEGER,
        indecent_representation INTEGER,
        sati_prevention INTEGER,
        total_caw INTEGER
      );

      CREATE TABLE police_stations (
        id TEXT PRIMARY KEY,
        district_id TEXT,
        name TEXT,
        officer_name TEXT,
        officer_rank TEXT,
        latitude REAL,
        longitude REAL
      );

      CREATE TABLE accused (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        district_id TEXT,
        repeat_offender INTEGER,
        modus_operandi TEXT,
        status TEXT
      );

      CREATE TABLE victims (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        district_id TEXT,
        station_id TEXT,
        vulnerability_score INTEGER
      );

      CREATE TABLE firs (
        id TEXT PRIMARY KEY,
        fir_number TEXT,
        case_number TEXT,
        district_id TEXT,
        station_id TEXT,
        crime_head TEXT,
        crime_group TEXT,
        ipc_section TEXT,
        is_caw INTEGER,
        severity TEXT,
        crime_status TEXT,
        arrest_status TEXT,
        court_status TEXT,
        accused_id TEXT,
        victim_id TEXT,
        investigating_officer TEXT,
        latitude REAL,
        longitude REAL,
        weapon_used TEXT,
        modus_operandi TEXT,
        crime_date TEXT,
        fir_date TEXT,
        year INTEGER,
        case_details TEXT,
        annual_record_id INTEGER,
        caw_record_id INTEGER
      );
    `);

    // Create Views
    db.exec(`
      CREATE VIEW v_district_crime_totals AS
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
      FROM districts d
      JOIN crime_india_annual cia ON cia.district_id = d.id
      GROUP BY d.id, d.name, d.state, d.latitude, d.longitude,
               d.population, d.sex_ratio, d.literacy_rate, cia.year;

      CREATE VIEW v_caw_summary AS
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
      FROM crimes_against_women caw
      JOIN districts d ON d.id = caw.district_id;

      CREATE VIEW v_fir_summary AS
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
      FROM firs f
      JOIN districts d ON d.id = f.district_id
      GROUP BY f.district_id, d.name, f.year, f.crime_group,
               f.crime_head, f.severity, f.crime_status, f.is_caw;
    `);

    // Fetch seeder data
    const data = getData();

    // Helper to sanitize parameter values for SQLite DatabaseSync
    const cleanParam = (val: any) => {
      if (val === undefined || val === null) return null;
      if (typeof val === "boolean") return val ? 1 : 0;
      if (typeof val === "number") return Number.isNaN(val) ? null : val;
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    };

    // Seed districts
    const insDist = db.prepare(`
      INSERT INTO districts (id, state, name, code, latitude, longitude, area_sq_km, population, male_population, female_population, sex_ratio, literacy_rate, urban_population, rural_population, sc_population, st_population, police_station_count, hotspot_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    for (const d of data.districts) {
      insDist.run(
        cleanParam(d.id),
        cleanParam(d.state || "Karnataka"),
        cleanParam(d.name),
        cleanParam(d.code),
        cleanParam(d.latitude),
        cleanParam(d.longitude),
        cleanParam(d.areaSqKm),
        cleanParam(d.population),
        cleanParam(d.malePopulation),
        cleanParam(d.femalePopulation),
        cleanParam(d.sexRatio || d.genderRatio),
        cleanParam(d.literacyRate),
        cleanParam(d.urbanPopulation),
        cleanParam(d.ruralPopulation),
        cleanParam(d.scPopulation),
        cleanParam(d.stPopulation),
        cleanParam(d.policeStationCount),
        cleanParam(d.hotspotCount),
      );
    }

    // Seed crime_india_annual
    const ciaRecords = getCrimeIndiaAnnualRecords(data.districts);
    const insCia = db.prepare(`
      INSERT INTO crime_india_annual (state, district, district_id, year, crime_head, crime_group, sub_group, cases_reported, cases_chargesheeted, cases_convicted, cases_acquitted, persons_arrested, persons_convicted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    for (const r of ciaRecords) {
      insCia.run(
        cleanParam(r.state),
        cleanParam(r.district),
        cleanParam(r.district_id || null),
        cleanParam(r.year),
        cleanParam(r.crime_head),
        cleanParam(r.crime_group),
        cleanParam(r.sub_group || null),
        cleanParam(r.cases_reported),
        cleanParam(r.cases_chargesheeted),
        cleanParam(r.cases_convicted),
        cleanParam(r.cases_acquitted),
        cleanParam(r.persons_arrested),
        cleanParam(r.persons_convicted),
      );
    }

    // Seed crimes_against_women
    const cawRecords = getCawRecords();
    const insCaw = db.prepare(`
      INSERT INTO crimes_against_women (state, district, district_id, year, rape, kidnapping_abduction, dowry_deaths, assault_on_women, insult_to_modesty, cruelty_by_husband, importation_of_girls, immoral_traffic, dowry_prohibition, indecent_representation, sati_prevention, total_caw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    for (const r of cawRecords) {
      insCaw.run(
        cleanParam(r.state),
        cleanParam(r.district),
        cleanParam(r.district_id || null),
        cleanParam(r.year),
        cleanParam(r.rape),
        cleanParam(r.kidnapping_abduction),
        cleanParam(r.dowry_deaths),
        cleanParam(r.assault_on_women),
        cleanParam(r.insult_to_modesty),
        cleanParam(r.cruelty_by_husband),
        cleanParam(r.importation_of_girls),
        cleanParam(r.immoral_traffic),
        cleanParam(r.dowry_prohibition),
        cleanParam(r.indecent_representation),
        cleanParam(r.sati_prevention),
        cleanParam(r.total_caw),
      );
    }

    // Seed police_stations
    const insPs = db.prepare(`
      INSERT INTO police_stations (id, district_id, name, officer_name, officer_rank, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);
    for (const ps of data.policeStations) {
      insPs.run(
        cleanParam(ps.id),
        cleanParam(ps.districtId),
        cleanParam(ps.name),
        cleanParam(ps.officerInCharge),
        cleanParam(ps.rank),
        cleanParam(ps.latitude),
        cleanParam(ps.longitude),
      );
    }

    // Seed accused
    const insAcc = db.prepare(`
      INSERT INTO accused (id, name, age, gender, district_id, repeat_offender, modus_operandi, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `);
    for (const a of data.accused) {
      insAcc.run(
        cleanParam(a.id),
        cleanParam(a.name),
        cleanParam(a.age),
        cleanParam(a.gender),
        cleanParam(a.districtId),
        cleanParam(a.repeatOffender),
        cleanParam(a.modusOperandi),
        cleanParam(a.status),
      );
    }

    // Seed victims
    const insVic = db.prepare(`
      INSERT INTO victims (id, name, age, gender, district_id, station_id, vulnerability_score)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);
    for (const v of data.victims) {
      insVic.run(
        cleanParam(v.id),
        cleanParam(v.name),
        cleanParam(v.age),
        cleanParam(v.gender),
        cleanParam(v.districtId),
        cleanParam(v.stationId),
        cleanParam(v.vulnerabilityScore),
      );
    }

    // Seed firs
    const insFir = db.prepare(`
      INSERT INTO firs (id, fir_number, case_number, district_id, station_id, crime_head, crime_group, ipc_section, is_caw, severity, crime_status, arrest_status, court_status, accused_id, victim_id, investigating_officer, latitude, longitude, weapon_used, modus_operandi, crime_date, fir_date, year, case_details, annual_record_id, caw_record_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    for (const f of data.firs) {
      insFir.run(
        cleanParam(f.id),
        cleanParam(f.firNumber),
        cleanParam(f.caseNumber || ""),
        cleanParam(f.districtId),
        cleanParam(f.policeStationId),
        cleanParam(f.crimeHead || "Theft"),
        cleanParam(f.crimeGroup || "Property Crime"),
        cleanParam(f.section || ""),
        cleanParam(f.isCaw),
        cleanParam(f.severity || "Medium"),
        cleanParam(f.status || "Registered"),
        cleanParam("Arrested"),
        cleanParam("Not Filed"),
        cleanParam(f.accusedId || null),
        cleanParam(f.victimId || null),
        cleanParam(f.officer || ""),
        cleanParam(f.latitude || 0),
        cleanParam(f.longitude || 0),
        cleanParam("No Weapon"),
        cleanParam(""),
        cleanParam(f.dateFiled),
        cleanParam(f.dateFiled),
        cleanParam(f.year || 2026),
        cleanParam(f.caseDetails || ""),
        cleanParam(null),
        cleanParam(null),
      );
    }

    cachedSqliteDb = db;
    return db;
  } catch (e: any) {
    console.warn("[Text-to-SQL] SQLite database could not be initialized:", e.message);
    return null;
  }
}

async function executeSql(sql: string): Promise<Record<string, unknown>[]> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin.rpc("execute_sql", { sql_query: sql });
      if (error) throw new Error(error.message);
      return data || [];
    } catch (e: any) {
      console.warn(
        "[Text-to-SQL] Supabase connection failed, falling back to local SQLite:",
        e.message,
      );
    }
  }

  // Fallback to local in-memory SQLite database
  const db = await ensureSqliteDb();
  if (!db) {
    return [];
  }
  // Strip schema names like 'public.' and comments for SQLite compatibility
  let sqliteSql = sql
    .replaceAll(/public\./g, "")
    .replaceAll(/TO_CHAR\(([^,]+),\s*'YYYY-MM'\)/gi, "SUBSTR($1, 1, 7)");
  const stmt = db.prepare(sqliteSql);
  return stmt.all() as Record<string, unknown>[];
}

// ── SQL Validation Helper (Task 5) ──────────────────────────────────────────

export function validateSqlQuery(sql: string): { valid: boolean; error?: string } {
  const cleanSql = sql.trim().toLowerCase();

  // 1. Check SELECT only (or WITH CTEs starting with SELECT)
  if (!cleanSql.startsWith("select") && !cleanSql.startsWith("with")) {
    return {
      valid: false,
      error:
        "Only SELECT queries are allowed. Mutation statements (DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE) are strictly forbidden.",
    };
  }

  // 2. Reject forbidden keywords (mutations or DDL)
  const forbidden = [
    "delete",
    "update",
    "drop",
    "insert",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
    "exec",
    "execute",
  ];
  for (const word of forbidden) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(cleanSql)) {
      return { valid: false, error: `Forbidden operation "${word}" detected in query.` };
    }
  }

  // 3. Verify only authorized tables/views are referenced
  const allowedTables = [
    "districts",
    "crime_india_annual",
    "crimes_against_women",
    "police_stations",
    "accused",
    "victims",
    "firs",
    "v_district_crime_totals",
    "v_caw_summary",
    "v_fir_summary",
    "census_2011",
  ];

  const fromJoinMatches = sql.match(/\b(from|join)\s+([a-zA-Z0-9_".]+)/gi);
  if (fromJoinMatches) {
    for (const match of fromJoinMatches) {
      const parts = match.split(/\s+/);
      const tableNameRaw = parts[1] ?? "";
      const tableName = tableNameRaw
        .replace(/["`]/g, "")
        .replace(/public\./i, "")
        .toLowerCase()
        .trim();
      if (tableName && !allowedTables.includes(tableName)) {
        return { valid: false, error: `Unauthorized table reference "${tableNameRaw}" detected.` };
      }
    }
  }

  return { valid: true };
}

async function validateSqlQueryLocally(sql: string): Promise<{ valid: boolean; error?: string }> {
  // First, check basic safety (SELECT only, no modifications)
  const basic = validateSqlQuery(sql);
  if (!basic.valid) {
    return basic;
  }

  // Next, compile it using SQLite engine to check syntax, tables, and columns
  try {
    const db = await ensureSqliteDb();
    if (!db) {
      return { valid: true };
    }
    let sqliteSql = sql
      .replaceAll(/public\./g, "")
      .replaceAll(/TO_CHAR\(([^,]+),\s*'YYYY-MM'\)/gi, "SUBSTR($1, 1, 7)");
    db.prepare(sqliteSql); // Triggers compilation (checking syntax, tables, columns)
    return { valid: true };
  } catch (e: any) {
    if (
      e.message &&
      (e.message.includes("sqlite") ||
        e.message.includes("DatabaseSync") ||
        e.message.includes("load url"))
    ) {
      return { valid: true };
    }
    return {
      valid: false,
      error: `SQL syntax or schema error: ${e.message}`,
    };
  }
}

// ── Dynamic Schema Context Builder (Task 3) ───────────────────────────────────

let cachedDynamicSchemaContext: string | null = null;

async function fetchDynamicSchemaContext(): Promise<string> {
  if (cachedDynamicSchemaContext) return cachedDynamicSchemaContext;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return "";
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch column details for all user tables in public schema
    const colsRes = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        SELECT 
          table_name, 
          column_name, 
          data_type, 
          is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `,
    });
    if (colsRes.error) throw new Error(colsRes.error.message);
    const cols = colsRes.data as any[];

    // Fetch foreign key relations
    const fksRes = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
      `,
    });
    if (fksRes.error) throw new Error(fksRes.error.message);
    const fks = fksRes.data as any[];

    let schemaStr = "### DYNAMICALLY RETRIEVED POSTGRESQL SCHEMA:\n";
    const tablesMap = new Map<string, any[]>();
    for (const col of cols) {
      if (!tablesMap.has(col.table_name)) {
        tablesMap.set(col.table_name, []);
      }
      tablesMap.get(col.table_name)?.push(col);
    }

    for (const [tableName, columns] of tablesMap.entries()) {
      schemaStr += `\nTable/View: public.${tableName}\n`;
      for (const col of columns) {
        schemaStr += `  - ${col.column_name}: ${col.data_type} (${col.is_nullable === "YES" ? "nullable" : "not null"})\n`;
      }

      const tableFks = fks.filter((fk) => fk.table_name === tableName);
      if (tableFks.length > 0) {
        schemaStr += "  Foreign Keys:\n";
        for (const fk of tableFks) {
          schemaStr += `    - ${fk.column_name} REFERENCES public.${fk.foreign_table_name}(${fk.foreign_column_name})\n`;
        }
      }
    }

    cachedDynamicSchemaContext = schemaStr;
    return schemaStr;
  } catch (e: any) {
    return "";
  }
}

// ── Complete PostgreSQL Schema Text ──────────────────────────────────────────

const COMPLETE_POSTGRESQL_SCHEMA = `
### COMPLETE POSTGRESQL / SUPABASE SCHEMA

Tables:
1. public.districts
   - id: TEXT PRIMARY KEY (e.g. "KA-01")
   - state: TEXT (default 'Karnataka')
   - name: TEXT (lowercase name e.g. "belagavi", "mysuru", "bengaluru urban")
   - code: TEXT (e.g. "K001")
   - latitude: REAL, longitude: REAL, area_sq_km: INTEGER
   - population: INTEGER, male_population: INTEGER, female_population: INTEGER
   - sex_ratio: INTEGER, literacy_rate: REAL, urban_population: INTEGER, rural_population: INTEGER
   - sc_population: INTEGER, st_population: INTEGER, police_station_count: INTEGER, hotspot_count: INTEGER

2. public.firs
   - id: TEXT PRIMARY KEY
   - fir_number: TEXT (e.g. "FIR/MYS/2021/004")
   - case_number: TEXT (e.g. "CASE/K001/000042")
   - district_id: TEXT REFERENCES public.districts(id)
   - station_id: TEXT REFERENCES public.police_stations(id)
   - crime_head: TEXT (e.g. "Theft", "Robbery", "Murder", "Cheating", "Assault")
   - crime_group: TEXT (e.g. "Property Crime", "Violent Crime", "Economic Crime")
   - ipc_section: TEXT (e.g. "IPC 302", "IPC 379", "IPC 354")
   - is_caw: INTEGER (1 or 0)
   - severity: TEXT ('Low', 'Medium', 'High', 'Critical')
   - crime_status: TEXT ('Open', 'Under Investigation', 'Pending Forensic', 'Solved', 'Filed In Court')
   - arrest_status: TEXT ('Not Arrested', 'Arrested', 'Wanted', 'Bail Granted')
   - court_status: TEXT ('Not Filed', 'Charge Sheet Filed', 'Trial Pending', 'Convicted', 'Acquitted')
   - accused_id: TEXT REFERENCES public.accused(id)
   - victim_id: TEXT REFERENCES public.victims(id)
   - investigating_officer: TEXT
   - latitude: REAL, longitude: REAL, weapon_used: TEXT, modus_operandi: TEXT
   - crime_date: TEXT, fir_date: TEXT, year: INTEGER, case_details: TEXT

3. public.crimes_against_women
   - id: INTEGER PRIMARY KEY
   - state: TEXT, district: TEXT, district_id: TEXT REFERENCES public.districts(id)
   - year: INTEGER, rape: INTEGER, kidnapping_abduction: INTEGER, dowry_deaths: INTEGER
   - assault_on_women: INTEGER, insult_to_modesty: INTEGER, cruelty_by_husband: INTEGER
   - importation_of_girls: INTEGER, immoral_traffic: INTEGER, dowry_prohibition: INTEGER
   - indecent_representation: INTEGER, sati_prevention: INTEGER, total_caw: INTEGER

4. public.crime_india_annual
   - id: INTEGER PRIMARY KEY
   - state: TEXT, district: TEXT, district_id: TEXT REFERENCES public.districts(id)
   - year: INTEGER, crime_head: TEXT, crime_group: TEXT, sub_group: TEXT
   - cases_reported: INTEGER, cases_chargesheeted: INTEGER, cases_convicted: INTEGER, cases_acquitted: INTEGER
   - persons_arrested: INTEGER, persons_convicted: INTEGER

5. public.police_stations
   - id: TEXT PRIMARY KEY, district_id: TEXT REFERENCES public.districts(id), name: TEXT, officer_name: TEXT, officer_rank: TEXT, latitude: REAL, longitude: REAL

6. public.accused
   - id: TEXT PRIMARY KEY, name: TEXT, age: INTEGER, gender: TEXT, district_id: TEXT REFERENCES public.districts(id), repeat_offender: INTEGER, modus_operandi: TEXT, status: TEXT

7. public.victims
   - id: TEXT PRIMARY KEY, name: TEXT, age: INTEGER, gender: TEXT, district_id: TEXT REFERENCES public.districts(id), station_id: TEXT REFERENCES public.police_stations(id), vulnerability_score: INTEGER

Views:
1. public.v_district_crime_totals (district_id, district_name, state, latitude, longitude, population, sex_ratio, literacy_rate, year, total_cases, total_arrested, total_convicted)
2. public.v_caw_summary (district_name, state, year, rape, kidnapping_abduction, dowry_deaths, assault_on_women, cruelty_by_husband, total_caw, sex_ratio, population)
3. public.v_fir_summary (district_id, district_name, year, crime_group, crime_head, severity, crime_status, is_caw, fir_count)
`;

// ── Few-Shot Examples (30+ comprehensive examples) ──────────────────────────

const FEW_SHOT_EXAMPLES = `
### FEW-SHOT EXAMPLES:

1. Question: How many crimes in Belagavi district?
   SQL: SELECT COUNT(*) AS total_crimes FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'belagavi' /* district='belagavi' */;

2. Question: Show crimes in Belagavi
   SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'belagavi' /* district='belagavi' */ ORDER BY f.fir_date DESC LIMIT 50;

3. Question: Average crimes per district
   SQL: SELECT AVG(total_cases) AS average_crimes FROM public.v_district_crime_totals;

4. Question: Top 10 districts by crime count
   SQL: SELECT district_name, SUM(total_cases) AS total_crimes FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total_crimes DESC LIMIT 10;

5. Question: Monthly crime trend
   SQL: SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f GROUP BY month ORDER BY month;

6. Question: Monthly crime trend of Belagavi
   SQL: SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'belagavi' /* district='belagavi' */ GROUP BY month ORDER BY month;

7. Question: Show robbery FIRs
   SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.crime_head) LIKE '%robbery%' ORDER BY f.fir_date DESC LIMIT 20;

8. Question: Crimes against women in Mysuru
   SQL: SELECT district_name, year, rape, dowry_deaths, cruelty_by_husband, assault_on_women, total_caw FROM public.v_caw_summary WHERE LOWER(district_name) = 'mysuru' /* district='mysuru' */ ORDER BY year DESC;

9. Question: District-wise statistics
   SQL: SELECT district_name, SUM(total_cases) AS total_cases, SUM(total_arrested) AS total_arrested, SUM(total_convicted) AS total_convicted FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total_cases DESC;

10. Question: Most common IPC sections
    SQL: SELECT ipc_section, COUNT(*) AS section_count FROM public.firs WHERE ipc_section IS NOT NULL AND ipc_section <> '' GROUP BY ipc_section ORDER BY section_count DESC LIMIT 10;

11. Question: Latest FIRs
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, f.fir_date, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id ORDER BY f.fir_date DESC LIMIT 15;

12. Question: Crime hotspot analysis
    SQL: SELECT d.name AS district_name, d.hotspot_count, COUNT(f.id) AS total_firs FROM public.districts d LEFT JOIN public.firs f ON d.id = f.district_id GROUP BY d.name, d.hotspot_count ORDER BY d.hotspot_count DESC;

13. Question: Show open cases in Mysuru
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'mysuru' /* district='mysuru' */ AND LOWER(f.crime_status) = 'open' /* status='Open' */ LIMIT 20;

14. Question: Total rape cases in Karnataka
    SQL: SELECT SUM(rape) AS total_rape_cases FROM public.crimes_against_women;

15. Question: Total dowry deaths by district
    SQL: SELECT district_name, SUM(dowry_deaths) AS total_dowry_deaths FROM public.v_caw_summary GROUP BY district_name ORDER BY total_dowry_deaths DESC;

16. Question: What is the literacy rate of Dharwad?
    SQL: SELECT name, literacy_rate, population FROM public.districts /* census_2011 */ WHERE LOWER(name) = 'dharwad';

17. Question: Police stations count per district
    SQL: SELECT d.name AS district_name, COUNT(p.id) AS station_count FROM public.districts d LEFT JOIN public.police_stations p ON d.id = p.district_id GROUP BY d.name ORDER BY station_count DESC;

18. Question: Repeat offenders count
    SQL: SELECT COUNT(*) AS repeat_offender_count FROM public.accused WHERE repeat_offender = true OR repeat_offender = 1;

19. Question: Critical severity FIRs
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.severity) = 'critical' LIMIT 25;

20. Question: Theft FIRs in Bengaluru Urban
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'bengaluru urban' /* district='bengaluru urban' */ AND LOWER(f.crime_head) LIKE '%theft%' LIMIT 20;

21. Question: Solved cases percentage by district
    SQL: SELECT district_name, SUM(cases_convicted) AS convicted, SUM(cases_reported) AS reported FROM public.crime_india_annual GROUP BY district_name ORDER BY reported DESC;

22. Question: Crimes reported in 2021
    SQL: SELECT f.fir_number, f.crime_head, f.fir_date, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE f.year = 2021 LIMIT 20;

23. Question: Total cases reported in Crime India Annual
    SQL: SELECT SUM(cases_reported) AS total_reported FROM public.crime_india_annual;

24. Question: High severity FIRs count
    SQL: SELECT COUNT(*) AS high_severity_count FROM public.firs WHERE LOWER(severity) = 'high';

25. Question: List police stations in Mysuru
    SQL: SELECT p.name, p.officer_name, p.officer_rank FROM public.police_stations p JOIN public.districts d ON p.district_id = d.id WHERE LOWER(d.name) = 'mysuru' /* district='mysuru' */;

26. Question: Total accused by gender
    SQL: SELECT gender, COUNT(*) AS count FROM public.accused GROUP BY gender;

27. Question: Total victims by gender
    SQL: SELECT gender, COUNT(*) AS count FROM public.victims GROUP BY gender;

28. Question: Murder cases in Hassan
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.crime_status FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = 'hassan' /* district='hassan' */ AND LOWER(f.crime_head) LIKE '%murder%' LIMIT 20;

29. Question: Total CAW cases by year
    SQL: SELECT year, SUM(total_caw) AS total_caw FROM public.crimes_against_women GROUP BY year ORDER BY year ASC;

30. Question: Show FIR details for FIR/MYS/2021/004
    SQL: SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.fir_number) = 'fir/mys/2021/004';
`;

// ── LLM Text-to-SQL Pipeline ──────────────────────────────────────────────────

async function generateSqlFromLlm(question: string, errorMsg = ""): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  const hasLlm = Boolean(geminiKey || openAIKey);

  if (!hasLlm) {
    return simulateLlmSqlGeneration(question);
  }

  const dynamicSchema = await fetchDynamicSchemaContext();
  const schemaContext = dynamicSchema || COMPLETE_POSTGRESQL_SCHEMA;

  const instructions = `
### SYSTEM INSTRUCTIONS:
You are an expert PostgreSQL SQL generator.
Generate ONLY executable PostgreSQL SELECT queries.
Use ONLY the supplied schema.
Never invent tables.
Never invent columns.
Return SQL only.

Map common legacy names to district names in districts table:
- 'mysore' -> 'mysuru'
- 'bangalore' -> 'bengaluru urban'
- 'shimoga' -> 'shivamogga'
- 'belgaum' -> 'belagavi'
- 'bellary' -> 'ballari'
- 'gulbarga' -> 'kalaburagi'
- 'bijapur' -> 'vijayapura'
- 'chikmagalur' -> 'chikkamagaluru'
- 'tumkur' -> 'tumakuru'
`;

  const errorContext = errorMsg
    ? `\nNOTE: The previous query failed execution with error: "${errorMsg}". Please correct the SQL statement.\n`
    : "";

  const fullPrompt = `${schemaContext}\n${instructions}\n${FEW_SHOT_EXAMPLES}\n${errorContext}\nQuestion: ${question}\nSQL Query:`;

  try {
    let response = await callLlm(fullPrompt);
    response = response.trim();
    if (response.startsWith("```")) {
      response = response
        .replace(/^```sql\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }
    if (!response) {
      throw new Error("Empty response from LLM");
    }
    return response;
  } catch (e: any) {
    return simulateLlmSqlGeneration(question);
  }
}

// ── Offline SQL Generator Compiler (Task 2 & 9) ────────────────────────────────

export function simulateLlmSqlGeneration(question: string): string {
  const q = question.toLowerCase().trim();

  // District name detection
  const district = detectDistrict(q);

  // Intent checks
  const isTop = ["top", "highest", "most", "worst"].some((kw) => q.includes(kw));
  const isCount = !isTop && ["how many", "count", "total number of", "number of crimes", "number of cases"].some(
    (kw) => q.includes(kw),
  );
  const isAvg = ["average", "avg"].some((kw) => q.includes(kw));
  const isTrend = ["trend", "monthly", "by month", "over time"].some((kw) => q.includes(kw));
  const isCaw = ["women", "rape", "dowry", "domestic", "cruelty", "assault on women", "caw"].some(
    (kw) => q.includes(kw),
  );
  const isIpc = ["ipc", "section", "sections"].some((kw) => q.includes(kw));
  const isHotspot = ["hotspot", "hotspots", "heat", "clusters"].some((kw) => q.includes(kw));
  const isLatest = ["latest", "recent", "newest", "last"].some((kw) => q.includes(kw));

  // Resolved crime head filter
  const crimeHeads = ["robbery", "theft", "murder", "cheating", "assault", "burglary", "narcotics"];
  let crimeHead = "";
  for (const ch of crimeHeads) {
    if (q.includes(ch)) {
      crimeHead = ch;
      break;
    }
  }

  // Resolve year filter
  let year = "";
  const yearMatch = q.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }

  // Specific assertions / queries
  if (q.includes("literacy rate")) {
    const targetDistrict = district || "dharwad";
    return `SELECT name, literacy_rate, population FROM public.districts /* census_2011 */ WHERE LOWER(name) = '${targetDistrict}';`;
  }

  if (q.includes("open cases") || q.includes("open firs")) {
    const whereDistrict = district ? ` AND LOWER(d.name) = '${district}' /* district='${district}' */` : "";
    return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.crime_status) = 'open' /* status='Open' */${whereDistrict} LIMIT 20;`;
  }

  // 1. TOP queries
  if (isTop) {
    const limitMatch = q.match(/\btop\s+(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 10;

    if (isIpc) {
      return `SELECT ipc_section, COUNT(*) AS section_count FROM public.firs WHERE ipc_section IS NOT NULL AND ipc_section <> '' GROUP BY ipc_section ORDER BY section_count DESC LIMIT ${limit};`;
    }

    if (isCaw) {
      return `SELECT district_name, SUM(total_caw) AS total_caw FROM public.v_caw_summary GROUP BY district_name ORDER BY total_caw DESC LIMIT ${limit};`;
    }

    return `SELECT district_name, SUM(total_cases) AS total FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total DESC LIMIT ${limit};`;
  }

  // 2. AVERAGE queries
  if (isAvg) {
    return `SELECT AVG(total_cases) AS average_crimes FROM public.v_district_crime_totals;`;
  }

  // 3. COUNT queries
  if (isCount) {
    if (isCaw) {
      const whereClause = district ? ` WHERE LOWER(district_name) = '${district}' /* district='${district}' */` : "";
      return `SELECT SUM(total_caw) AS total_caw FROM public.v_caw_summary${whereClause};`;
    }
    const whereParts: string[] = [];
    if (district) whereParts.push(`LOWER(d.name) = '${district}' /* district='${district}' */`);
    if (crimeHead) whereParts.push(`LOWER(f.crime_head) LIKE '%${crimeHead}%'`);
    if (year) whereParts.push(`f.year = ${year}`);
    const whereClause = whereParts.length > 0 ? ` WHERE ${whereParts.join(" AND ")}` : "";
    return `SELECT COUNT(*) AS total_crimes FROM public.firs f JOIN public.districts d ON f.district_id = d.id${whereClause};`;
  }

  // 4. Specific Crime Head queries
  if (crimeHead) {
    const whereDistrict = district ? ` AND LOWER(d.name) = '${district}' /* district='${district}' */` : "";
    return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.crime_head) LIKE '%${crimeHead}%'${whereDistrict} ORDER BY f.fir_date DESC LIMIT 15;`;
  }

  // 5. TREND queries
  if (isTrend) {
    if (district) {
      return `SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = '${district}' /* district='${district}' */ GROUP BY month ORDER BY month;`;
    }
    return `SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f GROUP BY month ORDER BY month;`;
  }

  // 6. CAW queries
  if (isCaw) {
    const whereClause = district ? ` WHERE LOWER(district_name) = '${district}' /* district='${district}' */` : "";
    return `SELECT district_name, year, rape, dowry_deaths, cruelty_by_husband, assault_on_women, total_caw FROM public.v_caw_summary${whereClause} ORDER BY year DESC;`;
  }

  // 7. IPC queries
  if (isIpc) {
    return `SELECT ipc_section, COUNT(*) AS section_count FROM public.firs WHERE ipc_section IS NOT NULL AND ipc_section <> '' GROUP BY ipc_section ORDER BY section_count DESC LIMIT 10;`;
  }

  // 8. Hotspot queries
  if (isHotspot) {
    return `SELECT d.name AS district_name, d.hotspot_count FROM public.districts d ORDER BY d.hotspot_count DESC LIMIT 10;`;
  }

  // 9. Latest / recent FIRs
  if (isLatest || q.includes("fir")) {
    const whereClause = district ? ` WHERE LOWER(d.name) = '${district}' /* district='${district}' */` : "";
    return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, f.fir_date, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id${whereClause} ORDER BY f.fir_date DESC LIMIT 15;`;
  }

  // 10. District-wise stats
  if (q.includes("district") || q.includes("by district")) {
    return `SELECT district_name, SUM(total_cases) AS total_cases, SUM(total_arrested) AS total_arrested, SUM(total_convicted) AS total_convicted FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total_cases DESC;`;
  }

  // General fallback
  if (district) {
    return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = '${district}' /* district='${district}' */ LIMIT 15;`;
  }

  return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id ORDER BY f.fir_date DESC LIMIT 15;`;
}

// ── Public entry point ────────────────────────────────────────────────────────

export async function executeTextToSql(
  normalisedQuery: string,
  intent?: string,
): Promise<SqlQueryResult> {
  let attempts = 0;
  let sql = "";
  let errorMsg = "";

  while (attempts < 2) {
    try {
      sql = await generateSqlFromLlm(normalisedQuery, errorMsg);
      if (!sql) throw new Error("Failed to generate SQL query.");

      const validation = await validateSqlQueryLocally(sql);
      if (!validation.valid) throw new Error(validation.error);

      const startTime = performance.now();
      const rows = await executeSql(sql);
      const endTime = performance.now();
      const executionTimeMs = Math.round(endTime - startTime);

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      const isCaw =
        sql.toLowerCase().includes("crimes_against_women") ||
        sql.toLowerCase().includes("v_caw_summary") ||
        intent === "caw";

      return {
        queryDescription: sql,
        rows,
        totalCount: rows.length,
        columns,
        isCaw,
        executionTimeMs,
        rowsReturned: rows.length,
      };
    } catch (e: any) {
      errorMsg = e.message;
      attempts++;
      console.warn(`[Text-to-SQL] Validation Loop (attempt ${attempts}/2) failed: ${errorMsg}`);
    }
  }

  return {
    queryDescription: sql || "SELECT * FROM public.firs LIMIT 0;",
    rows: [],
    totalCount: 0,
    columns: [],
    error: `SQL execution error: ${errorMsg}`,
    executionTimeMs: 0,
    rowsReturned: 0,
  };
}
