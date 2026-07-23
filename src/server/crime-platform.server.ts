export type CrimeStatus =
  "Open" | "Under Investigation" | "Solved" | "Pending Forensic" | "Filed In Court";
export type ArrestStatus = "Not Arrested" | "Arrested" | "Wanted" | "Bail Granted";
export type CourtStatus =
  "Not Filed" | "Charge Sheet Filed" | "Trial Pending" | "Convicted" | "Acquitted";

export interface DistrictRecord {
  id: string;
  name: string;
  code: string;
  population: number;
  areaSqKm: number;
  crimeCount: number;
  firCount: number;
  hotspotCount: number;
  policeStationCount: number;
  latitude: number;
  longitude: number;
  trend: number[];
  literacyRate: number;
  genderRatio: number;
  density: number;
  boundaryPolygon: Array<[number, number]>;
}

export interface PoliceStationRecord {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  officerInCharge: string;
  rank: string;
  latitude: number;
  longitude: number;
}

export interface VictimRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  districtId: string;
  stationId: string;
  vulnerabilityScore: number;
}

export interface AccusedRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  districtId: string;
  repeatOffender: boolean;
  modusOperandi: string;
  status: "Active" | "Arrested" | "Wanted" | "Charged";
}

export interface CrimeRecord {
  id: string;
  firId: string;
  caseNumber: string;
  title: string;
  districtId: string;
  districtName: string;
  policeStationId: string;
  policeStationName: string;
  category: string;
  crimeType: string;
  subcategory: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: CrimeStatus;
  crimeTime: string;
  latitude: number;
  longitude: number;
  weapon: string;
  investigationOfficer: string;
  arrestStatus: ArrestStatus;
  courtStatus: CourtStatus;
  repeatOffender: boolean;
  modusOperandi: string;
  victimId: string;
  accusedId: string;
  victimName: string;
  accusedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirRecord {
  id: string;
  firNumber: string;
  crimeId: string;
  districtId: string;
  districtName: string;
  policeStationId: string;
  policeStationName: string;
  officer: string;
  status: "Registered" | "Investigating" | "Charge Sheet Filed" | "Closed";
  dateFiled: string;
  caseDetails: string;
  section: string;
}

export interface CrimeQuery {
  search?: string;
  district?: string;
  category?: string;
  status?: string;
  severity?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof CrimeRecord;
  sortDir?: "asc" | "desc";
}

export interface FirQuery {
  search?: string;
  district?: string;
  status?: string;
  officer?: string;
  page?: number;
  pageSize?: number;
}

export interface DashboardSummary {
  totals: {
    crimes: number;
    activeCases: number;
    solvedCases: number;
    pendingCases: number;
    firs: number;
    repeatOffenders: number;
    policeStations: number;
    districts: number;
    victims: number;
    accused: number;
  };
  crimeRate: number;
  districtComparison: Array<{ name: string; crimes: number; firs: number; hotspots: number }>;
  monthlyTrends: Array<{ month: string; crimes: number; firs: number }>;
  crimeCategories: Array<{ name: string; value: number }>;
  recentFirs: FirRecord[];
  topCrimeDistricts: Array<{
    id: string;
    name: string;
    crimes: number;
    hotspots: number;
    policeStations: number;
    riskScore?: number;
    riskLevel?: "Low" | "Medium" | "High";
    riskReasons?: string[];
  }>;
  heatmapPoints: Array<{
    lat: number;
    lng: number;
    intensity: number;
    district: string;
    category: string;
  }>;
  kpis: Array<{ label: string; value: string; hint: string }>;
}

export interface AnalyticsSummary {
  barSeries: Array<{ label: string; crimes: number; firs: number }>;
  pieSeries: Array<{ name: string; value: number }>;
  lineSeries: Array<{
    month: string;
    crimeCount: number;
    solvedCount: number;
    pendingCount: number;
  }>;
  yearlyTrend: Array<{ year: number; crimes: number; solved: number }>;
  districtComparison: Array<{ name: string; crimes: number; solved: number; pending: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  ageDistribution: Array<{ band: string; value: number }>;
  genderDistribution: Array<{ name: string; value: number }>;
  predictionGraph: Array<{ month: string; observed: number; projected: number }>;
  riskScores: Array<{ districtId: string; district: string; score: number; trend: number }>;
  anomalyEvents: Array<{ title: string; district: string; severity: string; signal: string }>;
  hotspotPrediction: Array<{ district: string; score: number; reason: string }>;
}

export interface AssistantResponse {
  answer: string;
  confidence: number;
  citations: string[];
  suggestions: string[];
}

export interface NetworkGraphNode {
  id: string;
  label: string;
  type: "criminal" | "victim" | "station" | "fir" | "case" | "district" | "hotspot";
  district?: string;
  value: number;
}

export interface NetworkGraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface NetworkGraphSummary {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
  highlights: Array<{ label: string; value: string }>;
}

const DISTRICT_NAMES = [
  "Bagalkote",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapura",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Yadgir",
  "Vijayanagara",
];

const CRIME_CATEGORIES = [
  { name: "Property Crime", types: ["Theft", "Burglary", "Vehicle Theft", "Robbery"] },
  { name: "Violent Crime", types: ["Assault", "Murder", "Kidnapping", "Domestic Violence"] },
  { name: "Economic Offence", types: ["Fraud", "Forgery", "Cheating", "Extortion"] },
  {
    name: "Cyber Crime",
    types: ["Phishing", "Digital Fraud", "Identity Theft", "Online Harassment"],
  },
  { name: "Public Order", types: ["Rioting", "Arson", "Illegal Gathering", "Threats"] },
  {
    name: "Organized Crime",
    types: ["Narcotics", "Smuggling", "Gang Assault", "Human Trafficking"],
  },
];

const WEAPONS = [
  "Knife",
  "Firearm",
  "Blunt Object",
  "Vehicle",
  "Poison",
  "No Weapon",
  "Sharp Weapon",
  "Other",
];
const CRIME_STATUSES: CrimeStatus[] = [
  "Open",
  "Under Investigation",
  "Solved",
  "Pending Forensic",
  "Filed In Court",
];
const ARREST_STATUSES: ArrestStatus[] = ["Not Arrested", "Arrested", "Wanted", "Bail Granted"];
const COURT_STATUSES: CourtStatus[] = [
  "Not Filed",
  "Charge Sheet Filed",
  "Trial Pending",
  "Convicted",
  "Acquitted",
];
const FIR_STATUSES: FirRecord["status"][] = [
  "Registered",
  "Investigating",
  "Charge Sheet Filed",
  "Closed",
];
const GENDERS: Array<VictimRecord["gender"]> = ["Male", "Female", "Other"];
const FIRST_NAMES = [
  "Aakash",
  "Akash",
  "Ananya",
  "Arjun",
  "Bhavana",
  "Chetan",
  "Deepa",
  "Farhan",
  "Gowri",
  "Harish",
  "Iqbal",
  "Jayanth",
  "Keerthi",
  "Lakshmi",
  "Manjunath",
  "Nandini",
  "Omkar",
  "Pooja",
  "Pradeep",
  "Rashmi",
  "Sahana",
  "Sanjay",
  "Sneha",
  "Tejas",
  "Uma",
  "Varun",
  "Yash",
  "Zubair",
];
const LAST_NAMES = [
  "Acharya",
  "Bhat",
  "Gowda",
  "Hegde",
  "Iyer",
  "Joshi",
  "Kumar",
  "Nayak",
  "Patil",
  "Rao",
  "Sharma",
  "Shetty",
  "Singh",
  "Srinivas",
  "Yadav",
];
const OFFICER_RANKS = ["Constable", "Head Constable", "ASI", "SI", "Inspector", "DSP", "ACP"];
const MODUS_OPERANDI = [
  "Night-time burglary",
  "Social engineering",
  "Vehicle interception",
  "Crowd diversion",
  "Online impersonation",
  "Chain snatching from traffic",
  "False promise / coercion",
  "Pickup from isolated routes",
  "Coordinated gang attack",
  "Forged document trail",
];
const INVESTIGATION_OFFICERS = [
  "Inspector R. Kumar",
  "Inspector S. Patil",
  "SI M. Gowda",
  "SI A. Khan",
  "Inspector L. Rao",
  "DSP V. Shetty",
  "SI N. Kumar",
  "Inspector P. Naik",
];

type Dataset = {
  districts: DistrictRecord[];
  policeStations: PoliceStationRecord[];
  victims: VictimRecord[];
  accused: AccusedRecord[];
  crimes: CrimeRecord[];
  firs: FirRecord[];
};

let dataset: Dataset | undefined;

function seedRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function choice<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(date: Date) {
  return date.toISOString();
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildDistricts(random: () => number): DistrictRecord[] {
  const grid = [
    [15.0, 75.6],
    [15.6, 76.9],
    [15.2, 74.5],
    [13.3, 77.0],
    [12.98, 77.59],
    [16.9, 77.5],
    [11.8, 77.2],
    [13.5, 77.6],
    [13.2, 75.8],
    [13.8, 76.5],
    [12.9, 74.85],
    [14.45, 75.9],
    [15.46, 75.0],
    [15.42, 75.62],
    [13.0, 76.1],
    [14.79, 75.4],
    [17.33, 76.82],
    [12.42, 75.74],
    [13.14, 78.13],
    [15.35, 76.15],
    [12.52, 76.9],
    [12.3, 76.64],
    [16.2, 77.36],
    [12.72, 77.28],
    [13.93, 75.56],
    [13.34, 77.1],
    [13.34, 74.74],
    [14.8, 74.13],
    [16.83, 75.72],
    [16.77, 77.14],
    [15.33, 76.52],
  ];

  return DISTRICT_NAMES.map((name, index) => {
    const [latitude, longitude] = grid[index];
    const population = Math.round(700000 + random() * 1100000 + index * 22000);
    const crimeCount = Math.round(180 + random() * 220 + index * 4);
    const firCount = Math.round(crimeCount * 0.52);
    const hotspotCount = Math.max(4, Math.round(random() * 18));
    const policeStationCount = 2 + (index % 5);
    const trend = Array.from({ length: 12 }, (_, month) => {
      const base = crimeCount / 12;
      const seasonal = Math.sin((month / 12) * Math.PI * 2) * base * 0.28;
      return Math.max(5, Math.round(base + seasonal + random() * 12));
    });

    const literacyRate = Math.round((68 + (index % 7) * 2.5 + random() * 3) * 10) / 10;
    const genderRatio = Math.round(920 + (index % 9) * 12 + random() * 15);
    const areaSqKm = Math.round(1500 + random() * 6500);
    const density = Math.round(population / areaSqKm);

    // Simulated shapefile boundaries representing district borders
    const boundaryPolygon: Array<[number, number]> = [
      [latitude - 0.15, longitude - 0.15],
      [latitude - 0.15, longitude + 0.15],
      [latitude + 0.15, longitude + 0.15],
      [latitude + 0.15, longitude - 0.15],
      [latitude - 0.15, longitude - 0.15],
    ];

    return {
      id: `district-${String(index + 1).padStart(2, "0")}`,
      code: `K${String(index + 1).padStart(2, "00")}`,
      name,
      population,
      areaSqKm,
      crimeCount,
      firCount,
      hotspotCount,
      policeStationCount,
      latitude,
      longitude,
      trend,
      literacyRate,
      genderRatio,
      density,
      boundaryPolygon,
    };
  });
}

function buildPoliceStations(
  districts: DistrictRecord[],
  random: () => number,
): PoliceStationRecord[] {
  const stations: PoliceStationRecord[] = [];
  const total = 100;
  for (let index = 0; index < total; index += 1) {
    const district = districts[index % districts.length];
    const name = `${district.name} Police Station ${String(Math.floor(index / districts.length) + 1)}`;
    const officer = `${choice(FIRST_NAMES, random)} ${choice(LAST_NAMES, random)}`;
    stations.push({
      id: `ps-${String(index + 1).padStart(3, "0")}`,
      name,
      districtId: district.id,
      districtName: district.name,
      officerInCharge: officer,
      rank: choice(OFFICER_RANKS, random),
      latitude: district.latitude + (random() - 0.5) * 0.2,
      longitude: district.longitude + (random() - 0.5) * 0.2,
    });
  }
  return stations;
}

function buildVictims(
  districts: DistrictRecord[],
  stations: PoliceStationRecord[],
  random: () => number,
): VictimRecord[] {
  const victims: VictimRecord[] = [];
  for (let index = 0; index < 2400; index += 1) {
    const district = districts[index % districts.length];
    const station = stations[index % stations.length];
    victims.push({
      id: `vic-${String(index + 1).padStart(4, "0")}`,
      name: `${choice(FIRST_NAMES, random)} ${choice(LAST_NAMES, random)}`,
      age: Math.floor(11 + random() * 64),
      gender: choice(GENDERS, random),
      districtId: district.id,
      stationId: station.id,
      vulnerabilityScore: Math.floor(20 + random() * 80),
    });
  }
  return victims;
}

function buildAccused(districts: DistrictRecord[], random: () => number): AccusedRecord[] {
  const accused: AccusedRecord[] = [];
  for (let index = 0; index < 2000; index += 1) {
    const district = districts[(index * 3) % districts.length];
    const repeatOffender = random() > 0.68;
    accused.push({
      id: `acc-${String(index + 1).padStart(4, "0")}`,
      name: `${choice(FIRST_NAMES, random)} ${choice(LAST_NAMES, random)}`,
      age: Math.floor(18 + random() * 39),
      gender: choice(GENDERS, random),
      districtId: district.id,
      repeatOffender,
      modusOperandi: choice(MODUS_OPERANDI, random),
      status: repeatOffender
        ? choice(["Wanted", "Arrested", "Charged"], random)
        : choice(["Active", "Arrested", "Charged"], random),
    });
  }
  return accused;
}

function buildFirs(
  districts: DistrictRecord[],
  stations: PoliceStationRecord[],
  random: () => number,
): FirRecord[] {
  const firs: FirRecord[] = [];
  const now = new Date();
  for (let index = 0; index < 5000; index += 1) {
    const district = districts[(index * 7) % districts.length];
    const station = stations[(index * 5) % stations.length];
    const filedDate = addDays(now, -Math.floor(random() * 900));
    firs.push({
      id: `fir-${String(index + 1).padStart(5, "0")}`,
      firNumber: `FIR/${district.code}/${String(index + 1).padStart(6, "0")}`,
      crimeId: `crime-${String(index + 1).padStart(5, "0")}`,
      districtId: district.id,
      districtName: district.name,
      policeStationId: station.id,
      policeStationName: station.name,
      officer: `${choice(FIRST_NAMES, random)} ${choice(LAST_NAMES, random)}`,
      status: choice(FIR_STATUSES, random),
      dateFiled: formatDate(filedDate),
      caseDetails: `${choice(CRIME_CATEGORIES, random).name} related FIR with ${choice(MODUS_OPERANDI, random).toLowerCase()} pattern.`,
      section: choice(
        [
          "IPC 302",
          "IPC 376",
          "IPC 420",
          "IPC 379",
          "IT Act 66D",
          "NDPS 20(b)",
          "IPC 354",
          "IPC 307",
        ],
        random,
      ),
    });
  }
  return firs;
}

function buildCrimes(
  districts: DistrictRecord[],
  stations: PoliceStationRecord[],
  victims: VictimRecord[],
  accused: AccusedRecord[],
  firs: FirRecord[],
  random: () => number,
): CrimeRecord[] {
  const crimes: CrimeRecord[] = [];
  const now = new Date();
  for (let index = 0; index < 10000; index += 1) {
    const district = districts[(index * 11) % districts.length];
    const station = stations[(index * 13) % stations.length];
    const category = choice(CRIME_CATEGORIES, random);
    const type = choice(category.types, random);
    const victim = victims[(index * 17) % victims.length];
    const accusedPerson = accused[(index * 19) % accused.length];
    const fir = firs[index % firs.length];
    const severity = choice(
      ["Low", "Medium", "High", "Critical"] as CrimeRecord["severity"][],
      random,
    );
    const status = choice(CRIME_STATUSES, random);
    const crimeDate = addDays(now, -Math.floor(random() * 1000));
    const solved = status === "Solved" || status === "Filed In Court";

    crimes.push({
      id: `crime-${String(index + 1).padStart(5, "0")}`,
      firId: fir.id,
      caseNumber: `CASE/${district.code}/${String(index + 1).padStart(6, "0")}`,
      title: `${type} in ${district.name}`,
      districtId: district.id,
      districtName: district.name,
      policeStationId: station.id,
      policeStationName: station.name,
      category: category.name,
      crimeType: type,
      subcategory: choice(category.types, random),
      severity,
      status,
      crimeTime: formatDate(crimeDate),
      latitude: district.latitude + (random() - 0.5) * 0.3,
      longitude: district.longitude + (random() - 0.5) * 0.3,
      weapon: choice(WEAPONS, random),
      investigationOfficer: choice(INVESTIGATION_OFFICERS, random),
      arrestStatus: solved
        ? choice(["Arrested", "Bail Granted"], random)
        : choice(ARREST_STATUSES, random),
      courtStatus: solved
        ? choice(["Charge Sheet Filed", "Trial Pending", "Convicted"], random)
        : choice(COURT_STATUSES, random),
      repeatOffender: accusedPerson.repeatOffender || random() > 0.88,
      modusOperandi: accusedPerson.modusOperandi,
      victimId: victim.id,
      accusedId: accusedPerson.id,
      victimName: victim.name,
      accusedName: accusedPerson.name,
      createdAt: formatDate(crimeDate),
      updatedAt: formatDate(crimeDate),
    });
  }
  return crimes;
}

function ensureDataset(): Dataset {
  if (dataset) return dataset;
  const random = seedRng(20260702);
  const districts = buildDistricts(random);
  const policeStations = buildPoliceStations(districts, random);
  const victims = buildVictims(districts, policeStations, random);
  const accused = buildAccused(districts, random);
  const firs = buildFirs(districts, policeStations, random);
  const crimes = buildCrimes(districts, policeStations, victims, accused, firs, random);
  dataset = { districts, policeStations, victims, accused, crimes, firs };
  return dataset;
}

export function getData() {
  return ensureDataset();
}

function monthKey(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function sortRecords<T extends Record<string, unknown>>(
  records: T[],
  sortBy: keyof T | undefined,
  sortDir: "asc" | "desc" | undefined,
) {
  if (!sortBy) return records;
  const direction = sortDir === "asc" ? 1 : -1;
  return [...records].sort((left, right) => {
    const a = left[sortBy];
    const b = right[sortBy];
    if (typeof a === "number" && typeof b === "number") return (a - b) * direction;
    return String(a ?? "").localeCompare(String(b ?? "")) * direction;
  });
}

function matchesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

function paginate<T>(records: T[], page = 1, pageSize = 20) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const start = (safePage - 1) * safePageSize;
  const items = records.slice(start, start + safePageSize);
  return { items, page: safePage, pageSize: safePageSize, total, totalPages };
}

export function listCrimes(query: CrimeQuery = {}) {
  const { crimes } = getData();
  const search = query.search?.trim() ?? "";
  const filtered = crimes.filter((crime) => {
    if (
      query.district &&
      crime.districtId !== query.district &&
      crime.districtName !== query.district
    )
      return false;
    if (query.category && crime.category !== query.category) return false;
    if (query.status && crime.status !== query.status) return false;
    if (query.severity && crime.severity !== query.severity) return false;
    if (!search) return true;
    return [
      crime.caseNumber,
      crime.title,
      crime.districtName,
      crime.category,
      crime.crimeType,
      crime.policeStationName,
      crime.weapon,
      crime.investigationOfficer,
      crime.victimName,
      crime.accusedName,
      crime.modusOperandi,
      crime.status,
    ].some((value) => matchesSearch(value, search));
  });

  const sorted = sortRecords(
    filtered as unknown as Record<string, unknown>[],
    query.sortBy as string | undefined,
    query.sortDir,
  ) as unknown as CrimeRecord[];
  const pageSize = query.pageSize ?? 20;
  const page = query.page ?? 1;
  return {
    ...paginate(sorted, page, pageSize),
    facets: {
      categories: Array.from(new Set(crimes.map((crime) => crime.category))).sort(),
      statuses: Array.from(new Set(crimes.map((crime) => crime.status))).sort(),
      districts: getData().districts.map((district) => district.name),
      severities: ["Low", "Medium", "High", "Critical"],
    },
  };
}

export function getCrime(id: string) {
  return getData().crimes.find(
    (crime) => crime.id === id || crime.caseNumber === id || crime.firId === id,
  );
}

export function createCrime(input: Partial<CrimeRecord>) {
  const data = getData();
  const district =
    data.districts.find(
      (entry) => entry.id === input.districtId || entry.name === input.districtName,
    ) ?? data.districts[0];
  const station =
    data.policeStations.find((entry) => entry.id === input.policeStationId) ??
    data.policeStations[0];
  const victim = data.victims[0];
  const accused = data.accused[0];
  const fir = data.firs[0];
  const nextIndex = data.crimes.length + 1;
  const now = new Date();
  const crime: CrimeRecord = {
    id: `crime-${String(nextIndex).padStart(5, "0")}`,
    firId: fir.id,
    caseNumber: `CASE/${district.code}/${String(nextIndex).padStart(6, "0")}`,
    title: input.title ?? `${input.crimeType ?? "Crime"} in ${district.name}`,
    districtId: district.id,
    districtName: district.name,
    policeStationId: station.id,
    policeStationName: station.name,
    category: input.category ?? "Property Crime",
    crimeType: input.crimeType ?? "Theft",
    subcategory: input.subcategory ?? input.crimeType ?? "Theft",
    severity: (input.severity as CrimeRecord["severity"]) ?? "Medium",
    status: (input.status as CrimeStatus) ?? "Open",
    crimeTime: input.crimeTime ?? formatDate(now),
    latitude: input.latitude ?? district.latitude,
    longitude: input.longitude ?? district.longitude,
    weapon: input.weapon ?? "No Weapon",
    investigationOfficer: input.investigationOfficer ?? INVESTIGATION_OFFICERS[0],
    arrestStatus: (input.arrestStatus as ArrestStatus) ?? "Not Arrested",
    courtStatus: (input.courtStatus as CourtStatus) ?? "Not Filed",
    repeatOffender: Boolean(input.repeatOffender),
    modusOperandi: input.modusOperandi ?? MODUS_OPERANDI[0],
    victimId: victim.id,
    accusedId: accused.id,
    victimName: victim.name,
    accusedName: accused.name,
    createdAt: formatDate(now),
    updatedAt: formatDate(now),
  };
  data.crimes.unshift(crime);
  clearRagCache();
  return crime;
}

export function updateCrime(id: string, patch: Partial<CrimeRecord>) {
  const crime = getCrime(id);
  if (!crime) return undefined;
  Object.assign(crime, patch, { updatedAt: formatDate(new Date()) });
  clearRagCache();
  return crime;
}

export function deleteCrime(id: string) {
  const data = getData();
  const index = data.crimes.findIndex((crime) => crime.id === id || crime.caseNumber === id);
  if (index < 0) return false;
  data.crimes.splice(index, 1);
  clearRagCache();
  return true;
}

export function listFirs(query: FirQuery = {}) {
  const { firs } = getData();
  const search = query.search?.trim() ?? "";
  const filtered = firs.filter((fir) => {
    if (query.district && fir.districtId !== query.district && fir.districtName !== query.district)
      return false;
    if (query.status && fir.status !== query.status) return false;
    if (query.officer && !matchesSearch(fir.officer, query.officer)) return false;
    if (!search) return true;
    return [
      fir.firNumber,
      fir.caseDetails,
      fir.section,
      fir.policeStationName,
      fir.districtName,
      fir.officer,
      fir.status,
    ].some((value) => matchesSearch(value, search));
  });

  const sorted = [...filtered].sort((left, right) => right.dateFiled.localeCompare(left.dateFiled));
  return paginate(sorted, query.page ?? 1, query.pageSize ?? 20);
}

export function getFir(id: string) {
  return getData().firs.find((fir) => fir.id === id || fir.firNumber === id || fir.crimeId === id);
}

export function updateFir(id: string, patch: Partial<FirRecord>) {
  const fir = getFir(id);
  if (!fir) return undefined;
  Object.assign(fir, patch);
  clearRagCache();
  return fir;
}

export function deleteFir(id: string) {
  const data = getData();
  const index = data.firs.findIndex((fir) => fir.id === id || fir.firNumber === id);
  if (index < 0) return false;
  data.firs.splice(index, 1);
  clearRagCache();
  return true;
}

function districtCrimeStats() {
  const { crimes, districts, firs, policeStations } = getData();
  const mappedDistricts = districts.map((district) => {
    const districtCrimes = crimes.filter((crime) => crime.districtId === district.id);
    const districtFirs = firs.filter((fir) => fir.districtId === district.id);
    const hotspots = districtCrimes.filter(
      (crime) => crime.severity === "Critical" || crime.repeatOffender,
    ).length;
    return {
      ...district,
      crimeCount: districtCrimes.length,
      firCount: districtFirs.length,
      hotspotCount: Math.max(district.hotspotCount, hotspots),
      policeStationCount: policeStations.filter((station) => station.districtId === district.id)
        .length,
    };
  });

  const riskScores = calculateDistrictRiskScores(mappedDistricts, crimes);
  return mappedDistricts.map((d) => {
    const risk = riskScores.find((r) => r.districtId === d.id);
    return {
      ...d,
      riskScore: risk?.score ?? 50,
      riskLevel: risk?.level ?? "Medium",
      riskReasons: risk?.reasons ?? ["Stable risk profile"],
    };
  });
}

export function getDashboardSummary(): DashboardSummary {
  const { crimes, firs, victims, accused, policeStations } = getData();
  const districts = districtCrimeStats();
  const solvedCases = crimes.filter(
    (crime) => crime.status === "Solved" || crime.status === "Filed In Court",
  ).length;
  const activeCases = crimes.filter(
    (crime) =>
      crime.status === "Open" ||
      crime.status === "Under Investigation" ||
      crime.status === "Pending Forensic",
  ).length;
  const pendingCases = crimes.filter(
    (crime) => crime.status !== "Solved" && crime.status !== "Filed In Court",
  ).length;
  const repeatOffenders = crimes.filter((crime) => crime.repeatOffender).length;

  const monthlyBuckets = new Map<string, { crimes: number; firs: number }>();
  crimes.forEach((crime) => {
    const key = monthKey(crime.crimeTime);
    monthlyBuckets.set(key, {
      crimes: (monthlyBuckets.get(key)?.crimes ?? 0) + 1,
      firs: monthlyBuckets.get(key)?.firs ?? 0,
    });
  });
  firs.forEach((fir) => {
    const key = monthKey(fir.dateFiled);
    monthlyBuckets.set(key, {
      crimes: monthlyBuckets.get(key)?.crimes ?? 0,
      firs: (monthlyBuckets.get(key)?.firs ?? 0) + 1,
    });
  });
  const monthlyTrends = [...monthlyBuckets.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(-12)
    .map(([month, value]) => ({
      month: monthLabel(month),
      crimes: value.crimes,
      firs: value.firs,
    }));

  const categoryBuckets = new Map<string, number>();
  crimes.forEach((crime) => {
    categoryBuckets.set(crime.category, (categoryBuckets.get(crime.category) ?? 0) + 1);
  });

  const topDistricts = [...districts]
    .sort((left, right) => right.crimeCount - left.crimeCount)
    .slice(0, 10);
  const districtComparison = topDistricts.map((district) => ({
    name: district.name,
    crimes: district.crimeCount,
    firs: district.firCount,
    hotspots: district.hotspotCount,
  }));

  const heatmapPoints = crimes
    .filter(
      (crime) => crime.severity === "High" || crime.severity === "Critical" || crime.repeatOffender,
    )
    .slice(0, 200)
    .map((crime, index) => ({
      lat: crime.latitude,
      lng: crime.longitude,
      intensity: clamp(
        0.4 + (index % 12) * 0.05 + (crime.severity === "Critical" ? 0.3 : 0),
        0.35,
        1,
      ),
      district: crime.districtName,
      category: crime.category,
    }));

  return {
    totals: {
      crimes: crimes.length,
      activeCases,
      solvedCases,
      pendingCases,
      firs: firs.length,
      repeatOffenders,
      policeStations: policeStations.length,
      districts: districts.length,
      victims: victims.length,
      accused: accused.length,
    },
    crimeRate: Math.round((crimes.length / districts.length) * 10) / 10,
    districtComparison,
    monthlyTrends,
    crimeCategories: [...categoryBuckets.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value),
    recentFirs: [...firs]
      .sort((left, right) => right.dateFiled.localeCompare(left.dateFiled))
      .slice(0, 8),
    topCrimeDistricts: topDistricts.map((district: any) => ({
      id: district.id,
      name: district.name,
      crimes: district.crimeCount,
      hotspots: district.hotspotCount,
      policeStations: district.policeStationCount,
      riskScore: district.riskScore,
      riskLevel: district.riskLevel,
      riskReasons: district.riskReasons,
    })),
    heatmapPoints,
    kpis: [
      {
        label: "Total Crimes",
        value: crimes.length.toLocaleString(),
        hint: "All open and closed crime records",
      },
      {
        label: "Active Cases",
        value: activeCases.toLocaleString(),
        hint: "Open, investigation, and forensic cases",
      },
      {
        label: "Solved Cases",
        value: solvedCases.toLocaleString(),
        hint: "Solved and filed in court",
      },
      { label: "Pending Cases", value: pendingCases.toLocaleString(), hint: "Awaiting closure" },
      {
        label: "FIR Records",
        value: firs.length.toLocaleString(),
        hint: "Registered FIRs across Karnataka",
      },
      {
        label: "Repeat Offenders",
        value: repeatOffenders.toLocaleString(),
        hint: "Records flagged as repeat offenders",
      },
      {
        label: "Police Stations",
        value: policeStations.length.toLocaleString(),
        hint: "Active stations in the network",
      },
      {
        label: "Districts",
        value: districts.length.toLocaleString(),
        hint: "Karnataka districts covered",
      },
    ],
  };
}

export function getDistrictSummaries() {
  return districtCrimeStats();
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const { crimes } = getData();
  const districts = districtCrimeStats();
  const monthly = new Map<
    string,
    { crimes: number; firs: number; solved: number; pending: number }
  >();
  crimes.forEach((crime) => {
    const key = monthKey(crime.crimeTime);
    const existing = monthly.get(key) ?? { crimes: 0, firs: 0, solved: 0, pending: 0 };
    existing.crimes += 1;
    if (crime.status === "Solved" || crime.status === "Filed In Court") existing.solved += 1;
    else existing.pending += 1;
    monthly.set(key, existing);
  });

  const sortedMonths = [...monthly.entries()].sort((left, right) =>
    left[0].localeCompare(right[0]),
  );
  const lastTwelve = sortedMonths.slice(-12);
  const yearly = new Map<number, { crimes: number; solved: number }>();
  crimes.forEach((crime) => {
    const year = new Date(crime.crimeTime).getFullYear();
    const existing = yearly.get(year) ?? { crimes: 0, solved: 0 };
    existing.crimes += 1;
    if (crime.status === "Solved" || crime.status === "Filed In Court") existing.solved += 1;
    yearly.set(year, existing);
  });

  const categories = new Map<string, number>();
  const ageBands = new Map<string, number>([
    ["Below 18", 0],
    ["18-30", 0],
    ["31-45", 0],
    ["46-60", 0],
    ["60+", 0],
  ]);
  const genders = new Map<string, number>([
    ["Male", 0],
    ["Female", 0],
    ["Other", 0],
  ]);

  crimes.forEach((crime) => {
    categories.set(crime.category, (categories.get(crime.category) ?? 0) + 1);
  });

  const victims = getData().victims;
  victims.forEach((victim) => {
    if (victim.age < 18) ageBands.set("Below 18", (ageBands.get("Below 18") ?? 0) + 1);
    else if (victim.age <= 30) ageBands.set("18-30", (ageBands.get("18-30") ?? 0) + 1);
    else if (victim.age <= 45) ageBands.set("31-45", (ageBands.get("31-45") ?? 0) + 1);
    else if (victim.age <= 60) ageBands.set("46-60", (ageBands.get("46-60") ?? 0) + 1);
    else ageBands.set("60+", (ageBands.get("60+") ?? 0) + 1);
    genders.set(victim.gender, (genders.get(victim.gender) ?? 0) + 1);
  });

  const observed = lastTwelve.map(([month, value]) => ({
    month: monthLabel(month),
    observed: value.crimes,
    projected: Math.round(value.crimes * 1.08),
  }));
  const predictionGraph = observed.map((entry, index) => ({
    month: entry.month,
    observed: entry.observed,
    projected: Math.round(entry.observed * (1.04 + index * 0.01)),
  }));

  const calculatedRiskScores = calculateDistrictRiskScores(districts, crimes);
  const sortedRiskScores = [...calculatedRiskScores].sort(
    (left, right) => right.score - left.score,
  );

  const riskScores = sortedRiskScores
    .map((r) => ({
      districtId: r.districtId,
      district: r.district,
      score: r.score,
      level: r.level,
      reasons: r.reasons,
      trend: districts.find((d) => d.id === r.districtId)?.trend.slice(-1)[0] ?? 0,
    }))
    .slice(0, 10);

  const anomalies = districts
    .filter(
      (district) =>
        district.crimeCount >
        (districts.reduce((sum, item) => sum + item.crimeCount, 0) / districts.length) * 1.4,
    )
    .slice(0, 5)
    .map((district) => ({
      title: `${district.name} spike`,
      district: district.name,
      severity: "High",
      signal: `Crime activity is ${Math.round((district.crimeCount / districts.reduce((sum, item) => sum + item.crimeCount, 0)) * 100)}% of the state sample`,
    }));

  const hotspots = sortedRiskScores.slice(0, 5).map((r) => ({
    district: r.district,
    score: r.score,
    reason: r.reasons.join(", "),
  }));

  return {
    barSeries: lastTwelve.map(([month, value]) => ({
      label: monthLabel(month),
      crimes: value.crimes,
      firs: value.firs,
    })),
    pieSeries: [...categories.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value),
    lineSeries: lastTwelve.map(([month, value]) => ({
      month: monthLabel(month),
      crimeCount: value.crimes,
      solvedCount: value.solved,
      pendingCount: value.pending,
    })),
    yearlyTrend: [...yearly.entries()]
      .sort((left, right) => left[0] - right[0])
      .map(([year, value]) => ({ year, crimes: value.crimes, solved: value.solved })),
    districtComparison: districts.slice(0, 10).map((district) => ({
      name: district.name,
      crimes: district.crimeCount,
      solved: Math.round(district.crimeCount * 0.45),
      pending: Math.round(district.crimeCount * 0.55),
    })),
    categoryDistribution: [...categories.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value),
    ageDistribution: [...ageBands.entries()].map(([band, value]) => ({ band, value })),
    genderDistribution: [...genders.entries()].map(([name, value]) => ({ name, value })),
    predictionGraph,
    riskScores,
    anomalyEvents: anomalies,
    hotspotPrediction: hotspots,
  };
}

export function getNetworkGraphSummary(): NetworkGraphSummary {
  const { crimes, accused, victims, policeStations, districts } = getData();
  const topCriminals = accused
    .slice()
    .sort((left, right) => Number(right.repeatOffender) - Number(left.repeatOffender))
    .slice(0, 8);
  const topVictims = victims.slice(0, 8);
  const topStations = policeStations.slice(0, 8);
  const topDistricts = districts
    .slice()
    .sort((left, right) => right.crimeCount - left.crimeCount)
    .slice(0, 8);
  const topCases = crimes.slice(0, 8);

  const nodes: NetworkGraphNode[] = [
    ...topCriminals.map((item, index) => ({
      id: item.id,
      label: item.name,
      type: "criminal" as const,
      district: item.districtId,
      value: 8 - index,
    })),
    ...topVictims.map((item, index) => ({
      id: item.id,
      label: item.name,
      type: "victim" as const,
      district: item.districtId,
      value: 7 - index,
    })),
    ...topStations.map((item, index) => ({
      id: item.id,
      label: item.name,
      type: "station" as const,
      district: item.districtId,
      value: 6 - index,
    })),
    ...topDistricts.map((item, index) => ({
      id: item.id,
      label: item.name,
      type: "district" as const,
      district: item.id,
      value: 9 - index,
    })),
    ...topCases.map((item, index) => ({
      id: item.id,
      label: item.caseNumber,
      type: "case" as const,
      district: item.districtId,
      value: 5 - index,
    })),
  ];

  const edges: NetworkGraphEdge[] = [];
  topCases.forEach((crime, index) => {
    edges.push({
      source: crime.id,
      target: crime.accusedId,
      label: "accused",
      weight: 3 + (index % 2),
    });
    edges.push({
      source: crime.id,
      target: crime.victimId,
      label: "victim",
      weight: 2 + (index % 3),
    });
    edges.push({ source: crime.id, target: crime.policeStationId, label: "station", weight: 2 });
    edges.push({ source: crime.id, target: crime.districtId, label: "district", weight: 3 });
  });

  return {
    nodes,
    edges,
    highlights: [
      { label: "Active links", value: String(edges.length) },
      { label: "Core entities", value: String(nodes.length) },
      {
        label: "Repeat offenders",
        value: String(accused.filter((item) => item.repeatOffender).length),
      },
      { label: "Hot districts", value: String(topDistricts.length) },
    ],
  };
}

export interface CriminalTimelineEvent {
  id: string;
  date: string;
  type: "crime" | "fir" | "arrest" | "court" | "bail";
  title: string;
  description: string;
  firNumber: string;
  crimeType: string;
}

export interface CriminalProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  repeatOffender: boolean;
  status: string;
  modusOperandi: string;
  totalCrimes: number;
  timeline: CriminalTimelineEvent[];
}

export function getCriminalTimelineData(): CriminalProfile[] {
  const { crimes, accused, firs } = getData();

  return accused.map((acc) => {
    const accCrimes = crimes.filter((c) => c.accusedId === acc.id || c.accusedName === acc.name);
    const events: CriminalTimelineEvent[] = [];

    accCrimes.forEach((crime) => {
      const linkedFir = firs.find((f) => f.id === crime.firId || f.crimeId === crime.id);
      const firNum = linkedFir?.firNumber ?? "N/A";
      const crimeDate = new Date(crime.crimeTime);

      // 1. Crime committed event
      events.push({
        id: `event-${crime.id}-committed`,
        date: crime.crimeTime,
        type: "crime",
        title: "Crime Incident",
        description: `${crime.title} — Category: ${crime.category} using weapon: ${crime.weapon}. Modus Operandi: ${crime.modusOperandi}`,
        firNumber: firNum,
        crimeType: crime.crimeType,
      });

      // 2. FIR Registered event
      if (linkedFir) {
        events.push({
          id: `event-${crime.id}-fir`,
          date: linkedFir.dateFiled,
          type: "fir",
          title: "FIR Registered",
          description: `FIR ${linkedFir.firNumber} registered under section ${linkedFir.section} at ${linkedFir.policeStationName}. Officer: ${linkedFir.officer}. Status: ${linkedFir.status}.`,
          firNumber: firNum,
          crimeType: crime.crimeType,
        });
      }

      // 3. Arrest History event
      if (crime.arrestStatus && crime.arrestStatus !== "Not Arrested") {
        const arrestDate = new Date(crimeDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(); // Simulated 2 days later
        events.push({
          id: `event-${crime.id}-arrest`,
          date: arrestDate,
          type: crime.arrestStatus === "Bail Granted" ? "bail" : "arrest",
          title: crime.arrestStatus,
          description: `Arrest status updated to: ${crime.arrestStatus} under supervision of ${crime.investigationOfficer}.`,
          firNumber: firNum,
          crimeType: crime.crimeType,
        });
      }

      // 4. Court status event
      if (crime.courtStatus && crime.courtStatus !== "Not Filed") {
        const courtDate = new Date(crimeDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(); // Simulated 15 days later
        events.push({
          id: `event-${crime.id}-court`,
          date: courtDate,
          type: "court",
          title: crime.courtStatus,
          description: `Court trial status updated to: ${crime.courtStatus}. Case status is currently: ${crime.status}.`,
          firNumber: firNum,
          crimeType: crime.crimeType,
        });
      }
    });

    const sortedTimeline = events.sort((left, right) => left.date.localeCompare(right.date));

    return {
      id: acc.id,
      name: acc.name,
      age: acc.age,
      gender: acc.gender,
      repeatOffender: acc.repeatOffender,
      status: acc.status,
      modusOperandi: acc.modusOperandi,
      totalCrimes: accCrimes.length,
      timeline: sortedTimeline,
    };
  });
}

export function getAssistantResponse(question: string): AssistantResponse {
  const lower = question.toLowerCase();
  const dashboard = getDashboardSummary();
  const analytics = getAnalyticsSummary();
  const topDistrict = dashboard.topCrimeDistricts[0];
  const topHotspot = analytics.hotspotPrediction[0];

  if (lower.includes("highest crime") || lower.includes("top district")) {
    return {
      answer: `${topDistrict.name} currently leads the sample with ${topDistrict.crimes.toLocaleString()} crimes and ${topDistrict.hotspots} hotspots.`,
      confidence: 0.96,
      citations: [`/${topDistrict.name}`, "/api/dashboard"],
      suggestions: ["Show monthly trend", "Compare with second district", "List recent FIRs"],
    };
  }

  if (lower.includes("trend") || lower.includes("forecast")) {
    const latest = analytics.predictionGraph.slice(-3);
    return {
      answer: `Crime activity is trending upward in the latest sample, with projected values of ${latest.map((entry) => entry.projected).join(", ")} over the last three observed months.`,
      confidence: 0.89,
      citations: ["/api/analytics"],
      suggestions: ["Show yearly trend", "Show risk scores", "What are the hotspot districts?"],
    };
  }

  if (lower.includes("hotspot")) {
    return {
      answer: `The strongest hotspot signal is in ${topHotspot.district}, where the risk score is ${topHotspot.score}.`,
      confidence: 0.92,
      citations: ["/api/analytics", "/api/map"],
      suggestions: ["Show network graph", "Show crime map", "List repeat offenders"],
    };
  }

  if (lower.includes("fir")) {
    const recent = dashboard.recentFirs[0];
    return {
      answer: `There are ${dashboard.totals.firs.toLocaleString()} FIR records. The latest sample entry is ${recent.firNumber} from ${recent.districtName}.`,
      confidence: 0.91,
      citations: ["/api/firs", "/api/dashboard"],
      suggestions: ["Search FIR by district", "Filter by officer", "Download report"],
    };
  }

  return {
    answer: `The platform currently tracks ${dashboard.totals.crimes.toLocaleString()} crimes across ${dashboard.totals.districts} districts. Ask me about the highest crime district, hotspots, FIRs, trends, or predictions.`,
    confidence: 0.84,
    citations: ["/api/dashboard", "/api/analytics"],
    suggestions: ["Highest crime district", "Crime trends", "Recent FIRs", "Hotspots"],
  };
}

/**
 * HYBRID AI WORKFLOW ORCHESTRATOR (Workflow Steps 3–9)
 *
 * Wires together:
 *   IntentRouter → Text-to-SQL | RAG | AnalysisEngine → LLM Response Generator
 *
 * Called by /api/ai-assistant and returns a fully enriched response
 * including chart data, network data, heatmap points, and metrics.
 */
import { routeIntent } from "./modules/intent-router";
import { executeTextToSql } from "./modules/text-to-sql";
import { retrieveFromRag, clearRagCache } from "./modules/rag";
import { runAnalysis } from "./modules/analysis-engine";
import { calculateDistrictRiskScores } from "./modules/risk-scorer";
import { findSimilarCases } from "./modules/similar-finder";
import { enrichAssistantResponseWithRecommendations } from "./modules/investigation-assistant";
import {
  generateSqlResponse,
  generateRagResponse,
  generateAnalysisResponse,
  generateGeneralResponse,
  type HybridAssistantResponse,
} from "./modules/llm-response";

export type { HybridAssistantResponse };

export async function getHybridAssistantResponse(
  question: string,
): Promise<HybridAssistantResponse> {
  const response = await internalGetHybridAssistantResponse(question);
  return enrichAssistantResponseWithRecommendations(response, question);
}

async function internalGetHybridAssistantResponse(
  question: string,
): Promise<HybridAssistantResponse> {
  let cleanQuestion = question;
  let contextPage = "";
  let contextRows: any[] = [];

  const contextIndex = question.indexOf("\nContext:");
  if (contextIndex !== -1) {
    cleanQuestion = question.substring(0, contextIndex).trim();
    const contextStr = question.substring(contextIndex + 9).trim();
    try {
      const parsed = JSON.parse(contextStr);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed)) {
          contextRows = parsed;
        } else {
          contextPage = parsed.page ?? "";
          contextRows = parsed.rows ?? [];
        }
      }
    } catch (e) {
      // ignore
    }
  } else {
    const contextIndexNoNL = question.indexOf("Context:");
    if (contextIndexNoNL !== -1) {
      cleanQuestion = question.substring(0, contextIndexNoNL).trim();
      const contextStr = question.substring(contextIndexNoNL + 8).trim();
      try {
        const parsed = JSON.parse(contextStr);
        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed)) {
            contextRows = parsed;
          } else {
            contextPage = parsed.page ?? "";
            contextRows = parsed.rows ?? [];
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  // Similar Case Finder checking (Feature 1)
  const isSimilarCasesQuery =
    /similar|matching cases|case finder|compare fir|find similarity/i.test(cleanQuestion);
  if (isSimilarCasesQuery) {
    const caseMatch =
      cleanQuestion.match(/case\/[a-z0-9]+\/\d+/i) ||
      cleanQuestion.match(/fir\/[a-z0-9]+\/\d+/i) ||
      cleanQuestion.match(/crime-[a-z0-9]+/i) ||
      cleanQuestion.match(/fir-[a-z0-9]+/i);
    let targetKey = "";
    if (caseMatch) {
      targetKey = caseMatch[0].toUpperCase();
    } else if (contextRows.length > 0) {
      targetKey = contextRows[0].caseNumber ?? contextRows[0].firNumber ?? contextRows[0].id ?? "";
    } else {
      const firstCrime = getData().crimes[0];
      targetKey = firstCrime ? firstCrime.caseNumber : "";
    }

    if (targetKey) {
      const matches = findSimilarCases(targetKey, 5);
      if (matches.length > 0) {
        let answer = `### 🔍 Similar Case Finder Results\n\n`;
        answer += `Target case/FIR: **${targetKey}**\n\n`;
        answer += `We compared all records in the database based on crime type, location, suspects, modus operandi, and details. Here are the top matches:\n\n`;

        matches.forEach((m, idx) => {
          answer += `**${idx + 1}. Case ${m.caseNumber}** (${m.similarityPercentage}% Match)\n`;
          answer += `• **FIR Number**: ${m.firNumber}\n`;
          answer += `• **Crime Type**: ${m.crimeType} (${m.category})\n`;
          answer += `• **Location**: ${m.districtName}\n`;
          answer += `• **Accused**: ${m.accusedName}\n`;
          answer += `• **Modus Operandi**: ${m.modusOperandi}\n`;
          answer += `• **Reasons for Match**: ${m.matchReasons.join(", ")}\n\n`;
        });

        const finalResponse: HybridAssistantResponse = {
          answer,
          confidence: 0.98,
          citations: ["Similar Case Finder Module", "FIR Database"],
          suggestions: [
            `Show details for ${matches[0].caseNumber}`,
            `Investigate suspect ${matches[0].accusedName}`,
            "Show crime trends",
          ],
          handledBy: "analysis",
          tableRows: matches as any[],
          tableColumns: [
            "caseNumber",
            "firNumber",
            "crimeType",
            "districtName",
            "similarityPercentage",
            "modusOperandi",
          ],
        };

        return finalResponse;
      } else {
        return {
          answer: `Could not find any similar cases for record **${targetKey}**. Please check if the case/FIR number is correct.`,
          confidence: 0.85,
          citations: ["Similar Case Finder Module"],
          suggestions: ["List recent FIRs", "Show repeat offenders"],
          handledBy: "analysis",
        };
      }
    }
  }

  // Handle direct record lookups from page context
  if (contextRows.length > 0) {
    const caseMatch = cleanQuestion.match(/case\/[a-z0-9]+\/\d+/i);
    const firMatch = cleanQuestion.match(/fir\/[a-z0-9]+\/\d+/i);

    if (caseMatch) {
      const matchStr = caseMatch[0].toUpperCase();
      const matchedRow = contextRows.find((r) => r.caseNumber?.toUpperCase() === matchStr);
      if (matchedRow) {
        return {
          answer:
            `Found case **${matchedRow.caseNumber}** in the page records:\n\n` +
            `• **Title**: ${matchedRow.title ?? matchedRow.crimeType ?? "Crime Record"}\n` +
            `• **District**: ${matchedRow.districtName}\n` +
            `• **Severity**: ${matchedRow.severity}\n` +
            `• **Status**: ${matchedRow.status}\n` +
            `• **Officer**: ${matchedRow.investigationOfficer ?? matchedRow.officer}\n` +
            `• **Accused**: ${matchedRow.accusedName ?? "Unknown"}\n` +
            `• **Victim**: ${matchedRow.victimName ?? "Unknown"}\n` +
            `• **Modus Operandi**: ${matchedRow.modusOperandi ?? "N/A"}`,
          confidence: 0.99,
          citations: ["Visible page context"],
          suggestions: ["Show open cases", "Show critical crimes"],
          handledBy: "sql",
          tableRows: [matchedRow],
          tableColumns: [
            "caseNumber",
            "districtName",
            "crimeType",
            "severity",
            "status",
            "investigationOfficer",
          ],
        };
      }
    }

    if (firMatch) {
      const matchStr = firMatch[0].toUpperCase();
      const matchedRow = contextRows.find((r) => r.firNumber?.toUpperCase() === matchStr);
      if (matchedRow) {
        return {
          answer:
            `Found FIR **${matchedRow.firNumber}** in the page records:\n\n` +
            `• **District**: ${matchedRow.districtName}\n` +
            `• **Police Station**: ${matchedRow.policeStationName}\n` +
            `• **Officer**: ${matchedRow.officer}\n` +
            `• **Status**: ${matchedRow.status}\n` +
            `• **IPC Section**: ${matchedRow.section}\n` +
            `• **Date Filed**: ${matchedRow.dateFiled?.slice(0, 10) ?? "N/A"}\n` +
            `• **Details**: ${matchedRow.caseDetails}`,
          confidence: 0.99,
          citations: ["Visible page context"],
          suggestions: ["List recent FIRs", "Filter by officer"],
          handledBy: "sql",
          tableRows: [matchedRow],
          tableColumns: [
            "firNumber",
            "districtName",
            "policeStationName",
            "officer",
            "status",
            "section",
          ],
        };
      }
    }
  }

  // Handle summary queries specifically for page context
  const isContextSummaryQuery =
    /summarise|summarize|tell me about|explain|describe|what is shown|records shown|this page|these records|these cases|these fir/i.test(
      cleanQuestion,
    );
  if (contextRows.length > 0 && isContextSummaryQuery) {
    const isCrime = contextPage.toLowerCase().includes("crime") || "caseNumber" in contextRows[0];
    const isFir = contextPage.toLowerCase().includes("fir") || "firNumber" in contextRows[0];

    if (isCrime) {
      const total = contextRows.length;
      const categories: Record<string, number> = {};
      const severities: Record<string, number> = {};
      const statuses: Record<string, number> = {};

      contextRows.forEach((r) => {
        if (r.category) categories[r.category] = (categories[r.category] ?? 0) + 1;
        if (r.severity) severities[r.severity] = (severities[r.severity] ?? 0) + 1;
        if (r.status) statuses[r.status] = (statuses[r.status] ?? 0) + 1;
      });

      const catStr = Object.entries(categories)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");
      const sevStr = Object.entries(severities)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");
      const statStr = Object.entries(statuses)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");

      let answer =
        `Here is a summary of the ${total} crime records visible on this page:\n\n` +
        `• **Categories**: ${catStr || "None"}\n` +
        `• **Severities**: ${sevStr || "None"}\n` +
        `• **Statuses**: ${statStr || "None"}\n\n` +
        `You can search, filter, and drill down on these records using the platform controls.`;

      return {
        answer,
        confidence: 0.98,
        citations: ["Visible page context"],
        suggestions: ["Show open cases", "Show critical crimes", "Show crime trends"],
        handledBy: "sql",
        tableRows: contextRows,
        tableColumns: [
          "caseNumber",
          "districtName",
          "crimeType",
          "severity",
          "status",
          "investigationOfficer",
        ],
      };
    }

    if (isFir) {
      const total = contextRows.length;
      const statuses: Record<string, number> = {};
      const sections: Record<string, number> = {};

      contextRows.forEach((r) => {
        if (r.status) statuses[r.status] = (statuses[r.status] ?? 0) + 1;
        if (r.section) sections[r.section] = (sections[r.section] ?? 0) + 1;
      });

      const statStr = Object.entries(statuses)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");
      const secStr = Object.entries(sections)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");

      let answer =
        `Here is a summary of the ${total} FIR records visible on this page:\n\n` +
        `• **Statuses**: ${statStr || "None"}\n` +
        `• **Sections**: ${secStr || "None"}\n\n` +
        `You can inspect live case details or filter these FIRs using the page controls.`;

      return {
        answer,
        confidence: 0.98,
        citations: ["Visible page context"],
        suggestions: ["List recent FIRs", "Filter by officer", "Download report"],
        handledBy: "sql",
        tableRows: contextRows,
        tableColumns: [
          "firNumber",
          "districtName",
          "policeStationName",
          "officer",
          "status",
          "section",
        ],
      };
    }
  }

  // Step 3: Understand intent
  const { intent, normalisedQuery, analysisType } = await routeIntent(cleanQuestion);

  // Step 4 & 5: Route to the correct data retrieval module

  // CAW intent — Crimes Against Women dataset (dedicated path)
  if (intent === "caw") {
    // Try analysis engine first for rich chart + heatmap output
    const analysisResult = runAnalysis("caw", normalisedQuery); // Steps 6 & 7 – CAW analysis
    return generateAnalysisResponse(analysisResult, cleanQuestion); // Steps 8 & 9 – LLM response
  }

  if (intent === "sql") {
    const sqlResult = await executeTextToSql(normalisedQuery, "sql"); // Step 5 – execute query
    return await generateSqlResponse(sqlResult, cleanQuestion); // Steps 8 & 9 – LLM response
  }

  if (intent === "rag") {
    const ragResult = retrieveFromRag(normalisedQuery); // Step 5 – retrieve chunks
    return generateRagResponse(ragResult, cleanQuestion); // Steps 8 & 9 – LLM response
  }

  if (intent === "analysis") {
    const analysisResult = runAnalysis(analysisType ?? "trend", normalisedQuery); // Steps 6 & 7
    return generateAnalysisResponse(analysisResult, cleanQuestion); // Steps 8 & 9 – LLM response
  }

  // General fallback: check if we can retrieve relevant documents from RAG before returning the intro
  const ragResult = retrieveFromRag(normalisedQuery);
  if (ragResult.chunks.length > 0 && ragResult.chunks[0].score > 0.1) {
    return generateRagResponse(ragResult, cleanQuestion);
  }

  // General fallback
  const { totals } = getDashboardSummary();
  return generateGeneralResponse(cleanQuestion, totals.crimes, totals.districts);
}

export function getReportsSummary() {
  const dashboard = getDashboardSummary();
  const analytics = getAnalyticsSummary();
  return {
    generatedAt: new Date().toISOString(),
    reports: [
      {
        id: "rpt-dashboard",
        title: "State Crime Dashboard",
        format: "PDF/CSV/XLSX",
        rows: dashboard.totals.crimes,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "rpt-districts",
        title: "District Comparison",
        format: "CSV/XLSX",
        rows: dashboard.topCrimeDistricts.length,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "rpt-hotspots",
        title: "Hotspot Forecast",
        format: "PDF/CSV",
        rows: analytics.hotspotPrediction.length,
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function getSettingsSummary() {
  const dashboard = getDashboardSummary();
  return {
    roles: ["admin", "police_officer", "analyst", "scrb_officer", "investigator", "data_analyst"],
    modules: [
      "Crimes",
      "FIR Records",
      "Districts",
      "Crime Map",
      "Analytics",
      "AI Assistant",
      "Reports",
      "Network Analysis",
    ],
    dataStatus: "Connected",
    services: {
      postgres: "Ready for Supabase/PostgreSQL deployment",
      neo4j: "Graph model available via /api/network",
      leaflet: "Map markers and hotspots available via /api/map",
    },
    dashboard,
  };
}
