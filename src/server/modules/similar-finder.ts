import { getData, CrimeRecord, FirRecord } from "../crime-platform.server";

export interface CaseSimilarityResult {
  crimeId: string;
  caseNumber: string;
  firNumber: string;
  districtName: string;
  category: string;
  crimeType: string;
  accusedName: string;
  modusOperandi: string;
  similarityPercentage: number;
  matchReasons: string[];
}

/**
 * Computes Jaccard word similarity between two strings.
 */
function jaccardSimilarity(str1: string, str2: string): number {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "are",
    "was",
    "with",
    "from",
    "that",
    "this",
    "here",
    "they",
    "them",
    "about",
    "these",
    "related",
    "pattern",
  ]);
  const tokenize = (str: string) =>
    str
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

  const words1 = new Set(tokenize(str1));
  const words2 = new Set(tokenize(str2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersectionCount = 0;
  for (const w of words1) {
    if (words2.has(w)) intersectionCount++;
  }

  const unionSize = words1.size + words2.size - intersectionCount;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

/**
 * Finds similar cases for a given target case ID or case number.
 */
export function findSimilarCases(caseIdOrNumber: string, topK = 5): CaseSimilarityResult[] {
  const { crimes, firs } = getData();

  // Find the target case
  const targetCase = crimes.find(
    (c) =>
      c.id === caseIdOrNumber ||
      c.caseNumber.toUpperCase() === caseIdOrNumber.toUpperCase() ||
      c.firId === caseIdOrNumber,
  );
  if (!targetCase) {
    // If not found directly, try finding by FIR number
    const targetFir = firs.find(
      (f) => f.firNumber.toUpperCase() === caseIdOrNumber.toUpperCase() || f.id === caseIdOrNumber,
    );
    if (targetFir) {
      const match = crimes.find((c) => c.firId === targetFir.id || c.id === targetFir.crimeId);
      if (match) return findSimilarCases(match.id, topK);
    }
    return [];
  }

  const targetFir = firs.find((f) => f.id === targetCase.firId || f.crimeId === targetCase.id);
  const targetDetails = targetFir?.caseDetails ?? "";

  const results: CaseSimilarityResult[] = [];

  for (const candidate of crimes) {
    // Skip self
    if (candidate.id === targetCase.id) continue;

    const candidateFir = firs.find((f) => f.id === candidate.firId || f.crimeId === candidate.id);
    const candidateDetails = candidateFir?.caseDetails ?? "";

    const matchReasons: string[] = [];

    // 1. Crime Type / Category Match (30% weight)
    let typeScore = 0;
    if (candidate.crimeType.toLowerCase() === targetCase.crimeType.toLowerCase()) {
      typeScore = 30;
      matchReasons.push(`Same crime type (${candidate.crimeType})`);
    } else if (candidate.category.toLowerCase() === targetCase.category.toLowerCase()) {
      typeScore = 18;
      matchReasons.push(`Same category (${candidate.category})`);
    }

    // 2. Location proximity (20% weight)
    let locationScore = 0;
    if (candidate.policeStationId === targetCase.policeStationId) {
      locationScore = 20;
      matchReasons.push("Same Police Station jurisdiction");
    } else if (candidate.districtId === targetCase.districtId) {
      locationScore = 14;
      matchReasons.push(`Same district area (${candidate.districtName})`);
    } else {
      // Calculate geometric distance in lat/lng
      const dist = Math.sqrt(
        Math.pow(candidate.latitude - targetCase.latitude, 2) +
          Math.pow(candidate.longitude - targetCase.longitude, 2),
      );
      if (dist < 0.5) {
        locationScore = Math.round((1 - dist / 0.5) * 10);
        if (locationScore > 0) {
          matchReasons.push("Geographical proximity");
        }
      }
    }

    // 3. Modus Operandi Match (20% weight)
    let moScore = 0;
    const moJaccard = jaccardSimilarity(candidate.modusOperandi, targetCase.modusOperandi);
    if (candidate.modusOperandi.toLowerCase() === targetCase.modusOperandi.toLowerCase()) {
      moScore = 20;
      matchReasons.push("Identical modus operandi");
    } else if (moJaccard > 0.2) {
      moScore = Math.round(moJaccard * 20);
      matchReasons.push("Similar modus operandi keywords");
    }

    // 4. Suspect Similarity (15% weight)
    let suspectScore = 0;
    if (
      candidate.accusedId === targetCase.accusedId &&
      candidate.accusedName !== "Unknown" &&
      targetCase.accusedName !== "Unknown"
    ) {
      suspectScore = 15;
      matchReasons.push(`Same accused person (${candidate.accusedName})`);
    } else if (candidate.repeatOffender && targetCase.repeatOffender) {
      suspectScore = 8;
      matchReasons.push("Both involve repeat offenders");
    }

    // 5. Keyword Match in Case Details (15% weight)
    let keywordScore = 0;
    const detailsJaccard = jaccardSimilarity(candidateDetails, targetDetails);
    if (detailsJaccard > 0) {
      keywordScore = Math.min(15, Math.round(detailsJaccard * 30));
      if (keywordScore >= 5) {
        matchReasons.push("Matching case description keywords");
      }
    }

    const similarityPercentage = Math.min(
      100,
      Math.max(0, Math.round(typeScore + locationScore + moScore + suspectScore + keywordScore)),
    );

    if (similarityPercentage > 15) {
      results.push({
        crimeId: candidate.id,
        caseNumber: candidate.caseNumber,
        firNumber: candidateFir?.firNumber ?? "N/A",
        districtName: candidate.districtName,
        category: candidate.category,
        crimeType: candidate.crimeType,
        accusedName: candidate.accusedName,
        modusOperandi: candidate.modusOperandi,
        similarityPercentage,
        matchReasons,
      });
    }
  }

  // Sort by highest similarity percentage and return top K
  return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage).slice(0, topK);
}
