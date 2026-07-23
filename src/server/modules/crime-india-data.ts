import { DistrictRecord } from "../crime-platform.server";

export interface CrimeIndiaAnnual {
  id: number;
  state: string;
  district: string;
  district_id: string | null;
  year: number;
  crime_head: string; // e.g. "Murder", "Theft", "Kidnapping", "Cheating"
  crime_group: string; // e.g. "Violent Crime", "Property Crime", "Economic Offence"
  sub_group: string | null;
  cases_reported: number;
  cases_chargesheeted: number;
  cases_convicted: number;
  cases_acquitted: number;
  persons_arrested: number;
  persons_convicted: number;
}

const CRIME_HEADS = [
  { head: "Murder", group: "Violent Crime", baseRate: 35 },
  { head: "Theft", group: "Property Crime", baseRate: 220 },
  { head: "Kidnapping", group: "Violent Crime", baseRate: 48 },
  { head: "Cheating", group: "Economic Offence", baseRate: 95 },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

let cachedRecords: CrimeIndiaAnnual[] | null = null;

export function getCrimeIndiaAnnualRecords(districts: DistrictRecord[]): CrimeIndiaAnnual[] {
  if (cachedRecords) return cachedRecords;

  const records: CrimeIndiaAnnual[] = [];
  const rand = rng(998877);
  let idCounter = 1;

  for (let year = 2001; year <= 2021; year++) {
    for (const d of districts) {
      // Use population ratio relative to a baseline to scale crime counts
      const popRatio = d.population / 1000000;

      for (const item of CRIME_HEADS) {
        const noise = 0.8 + rand() * 0.4; // ±20% noise

        // Crime rates have grown slightly year over year historically
        const yearGrowth = 1 + (year - 2001) * 0.025;

        const cases_reported = Math.round(item.baseRate * popRatio * yearGrowth * noise);
        const cases_chargesheeted = Math.round(cases_reported * (0.65 + rand() * 0.15));
        const cases_convicted = Math.round(cases_chargesheeted * (0.35 + rand() * 0.1));
        const cases_acquitted = Math.max(
          0,
          cases_chargesheeted - cases_convicted - Math.round(rand() * 5),
        );

        const persons_arrested = Math.round(cases_chargesheeted * (1.1 + rand() * 0.4));
        const persons_convicted = Math.round(cases_convicted * (1.0 + rand() * 0.2));

        records.push({
          id: idCounter++,
          state: "Karnataka",
          district: d.name,
          district_id: d.id,
          year,
          crime_head: item.head,
          crime_group: item.group,
          sub_group: null,
          cases_reported,
          cases_chargesheeted,
          cases_convicted,
          cases_acquitted,
          persons_arrested,
          persons_convicted,
        });
      }
    }
  }

  cachedRecords = records;
  return records;
}

export function getCrimeIndiaAnnualByDistrict(
  districts: DistrictRecord[],
  districtName: string,
): CrimeIndiaAnnual[] {
  return getCrimeIndiaAnnualRecords(districts).filter(
    (r) => r.district.toLowerCase() === districtName.toLowerCase(),
  );
}

export function getCrimeIndiaAnnualByYear(
  districts: DistrictRecord[],
  year: number,
): CrimeIndiaAnnual[] {
  return getCrimeIndiaAnnualRecords(districts).filter((r) => r.year === year);
}
