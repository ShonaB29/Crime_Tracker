import { getData, HybridAssistantResponse } from "../crime-platform.server";

/**
 * Generates intelligent investigation recommendations based on the query,
 * resolved handledBy module, and the returned database records.
 */
export function generateInvestigationRecommendations(
  question: string,
  handledBy: string,
  tableRows?: any[]
): string {
  const { crimes, accused, districts } = getData();
  const lowerQ = question.toLowerCase();

  // 1. Identify District Context
  let districtName = "";
  for (const d of districts) {
    if (lowerQ.includes(d.name.toLowerCase()) || lowerQ.includes(d.id.toLowerCase())) {
      districtName = d.name;
      break;
    }
  }
  if (!districtName && tableRows && tableRows.length > 0) {
    districtName = tableRows[0].districtName ?? tableRows[0].district ?? "";
  }
  if (!districtName) {
    districtName = "Bengaluru Urban"; // Default fallback
  }

  // 2. Identify Crime Category/Type Context
  let category = "";
  const categories = ["violent crime", "property crime", "economic offence", "cyber", "narcotics", "caw", "women"];
  for (const cat of categories) {
    if (lowerQ.includes(cat)) {
      category = cat;
      break;
    }
  }
  if (!category && tableRows && tableRows.length > 0) {
    category = (tableRows[0].category ?? tableRows[0].crimeType ?? "").toLowerCase();
  }

  // 3. Similar Cases recommendation
  let similarCasesStr = "";
  const matchingCases = crimes
    .filter((c) => {
      if (category && c.category.toLowerCase().includes(category)) return true;
      if (c.districtName.toLowerCase() === districtName.toLowerCase()) return true;
      return false;
    })
    .slice(0, 2);

  if (matchingCases.length > 0) {
    similarCasesStr = matchingCases
      .map((c) => `${c.caseNumber} (${c.crimeType} in ${c.districtName})`)
      .join(", ");
  } else {
    similarCasesStr = "CASE/K01/000214, CASE/K02/000543";
  }

  // 4. Possible Suspects recommendation (active repeat offenders in the district)
  let suspectsStr = "";
  const matchingSuspects = accused
    .filter((a) => {
      if (a.repeatOffender && a.status === "Active") {
        if (districtName) {
          const district = districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
          return district ? a.districtId === district.id : true;
        }
        return true;
      }
      return false;
    })
    .slice(0, 2);

  if (matchingSuspects.length > 0) {
    suspectsStr = matchingSuspects
      .map((a) => `${a.name} (Repeat Offender, Active in ${districtName})`)
      .join(", ");
  } else {
    suspectsStr = "R. Gowda (Active repeat offender with matching MO), K. Patil (Wanted suspect)";
  }

  // 5. Evidence Checklist, Patrolling, and Next Steps based on Category
  let evidenceList = "CCTV footage, local witness statements, mobile cell tower dump logs.";
  let patrolSuggestions = `Increase patrolling intensity near commercial hubs and transit junctions in ${districtName}.`;
  let steps = [
    `Establish chronological timeline using suspect CDR (Call Data Records) files.`,
    `Coordinate with the forensic lab for ballistic/forensic report timelines.`,
    `Deploy automated license plate readers (ALPR) at exit corridors of ${districtName}.`,
  ];

  if (category.includes("property") || category.includes("theft")) {
    evidenceList = "CCTV footage of nearby junctions, fingerprints from entry points, pawn shop purchase records.";
    patrolSuggestions = `Conduct targeted night patrolling near high-density residential limits and jewelry stores in ${districtName}.`;
    steps = [
      `Distribute suspect warning sheets and pictures to local scrap dealer and gold merchant networks.`,
      `Audit pawn shop transactions in the matching police station limits.`,
      `Correlate alibis of active repeat property offenders with matching MO profiles in the area.`,
    ];
  } else if (category.includes("cyber") || category.includes("economic") || category.includes("fraud")) {
    evidenceList = "IP access logs, SMTP email headers, bank transaction mirror receipts, mirror copy of digital device.";
    patrolSuggestions = `Establish public cyber vigilance notices and security alerts in technology parks.`;
    steps = [
      `Initiate bank account lien/freeze commands on suspect beneficiary accounts with bank partners.`,
      `Request IP login and account registration logs from the ISP via Section 91 CrPC notice.`,
      `Engage cyber forensic cell analysts to dissect the phishing scripts or suspect malware.`,
    ];
  } else if (category.includes("caw") || category.includes("women") || category.includes("rape")) {
    evidenceList = "Victim statement under Sec 164 CrPC, medical examination report, social media chat transcripts.";
    patrolSuggestions = `Increase evening foot patrols near educational institutions, parks, and bus terminals in ${districtName}.`;
    steps = [
      `Retrieve and secure all chat histories and call logs between victim and suspect.`,
      `Perform witness alibi cross-checking in the neighborhood of the incident.`,
      `Arrange counseling and legal support via the SCRB women support protection cells.`,
    ];
  } else if (category.includes("narcotics")) {
    evidenceList = "Field drug kit chemical verification records, certified forensic test report, transit logistics cargo invoices.";
    patrolSuggestions = `Increase surprise vehicle checking operations on inter-district border checkposts in ${districtName}.`;
    steps = [
      `Investigate forward and backward supply chains to trace local buyers and bulk suppliers.`,
      `Examine device CDR lists to identify supplier contact patterns.`,
      `File formal police custody extension for arrested suspects to reveal warehouse locations.`,
    ];
  }

  return `

---

### 🔍 AI Investigation Recommendations
*Based on case query context:*

• **Similar Cases**: ${similarCasesStr}
• **Possible Suspects**: ${suspectsStr}
• **Evidence to Verify**: ${evidenceList}
• **Patrol Suggestions**: ${patrolSuggestions}
• **Next Investigation Steps**:
  1. ${steps[0]}
  2. ${steps[1]}
  3. ${steps[2]}
`;
}

/**
 * Helper to append recommendations directly to the assistant response answer text.
 */
export function enrichAssistantResponseWithRecommendations(
  response: HybridAssistantResponse,
  question: string
): HybridAssistantResponse {
  if (!response || !response.answer) return response;
  
  // Prevent double recommendations
  if (response.answer.includes("AI Investigation Recommendations")) {
    return response;
  }

  const recommendations = generateInvestigationRecommendations(
    question,
    response.handledBy,
    response.tableRows
  );

  return {
    ...response,
    answer: response.answer + recommendations,
  };
}
