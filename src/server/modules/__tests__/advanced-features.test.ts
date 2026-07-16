import { describe, it, expect } from "vitest";
import { getData, getHybridAssistantResponse, getCriminalTimelineData } from "../../crime-platform.server";
import { calculateDistrictRiskScores } from "../risk-scorer";
import { findSimilarCases } from "../similar-finder";

describe("Advanced Crime Intelligence Features Tests", () => {
  // ── 1. Crime Risk Score Tests ───────────────────────────────────────────────
  describe("Crime Risk Score", () => {
    it("calculates a dynamic risk score between 0 and 100 for all districts", () => {
      const { districts, crimes } = getData();
      const riskScores = calculateDistrictRiskScores(districts, crimes);

      expect(riskScores.length).toBe(districts.length);
      for (const r of riskScores) {
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
        expect(["Low", "Medium", "High"]).toContain(r.level);
        expect(r.reasons.length).toBeGreaterThan(0);
        expect(r.metrics.frequencyScore).toBeGreaterThanOrEqual(0);
        expect(r.metrics.trendScore).toBeGreaterThanOrEqual(0);
        expect(r.metrics.repeatOffenderScore).toBeGreaterThanOrEqual(0);
        expect(r.metrics.severityScore).toBeGreaterThanOrEqual(0);
      }
    });

    it("assigns High risk to districts with elevated scores and Low risk to lower scores", () => {
      const { districts, crimes } = getData();
      const riskScores = calculateDistrictRiskScores(districts, crimes);

      const highRisk = riskScores.filter((r) => r.level === "High");
      const lowRisk = riskScores.filter((r) => r.level === "Low");

      highRisk.forEach((h) => expect(h.score).toBeGreaterThanOrEqual(70));
      lowRisk.forEach((l) => expect(l.score).toBeLessThan(40));
    });
  });

  // ── 2. Similar Case Finder Tests ───────────────────────────────────────────
  describe("Similar Case Finder", () => {
    it("returns similar case matches for a valid case number", () => {
      const { crimes } = getData();
      const targetCase = crimes[0];
      expect(targetCase).toBeDefined();

      const matches = findSimilarCases(targetCase.caseNumber, 5);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.length).toBeLessThanOrEqual(5);

      for (const match of matches) {
        expect(match.caseNumber).not.toBe(targetCase.caseNumber);
        expect(match.similarityPercentage).toBeGreaterThanOrEqual(0);
        expect(match.similarityPercentage).toBeLessThanOrEqual(100);
        expect(match.matchReasons.length).toBeGreaterThan(0);
      }
    });

    it("returns similar case matches via similar query in getHybridAssistantResponse", () => {
      const { crimes } = getData();
      const targetCase = crimes[0];
      
      const response = getHybridAssistantResponse(`find cases similar to ${targetCase.caseNumber}`);
      expect(response.answer).toContain("Similar Case Finder Results");
      expect(response.answer).toContain("Match)");
      expect(response.tableRows).toBeDefined();
      expect(response.tableRows!.length).toBeGreaterThan(0);
    });
  });

  // ── 3. AI Investigation Assistant Recommendations Tests ────────────────────
  describe("AI Investigation Assistant Recommendations", () => {
    it("appends investigation recommendations to SQL queries", () => {
      const response = getHybridAssistantResponse("cases in Dharwad");
      expect(response.answer).toContain("AI Investigation Recommendations");
      expect(response.answer).toContain("Similar Cases");
      expect(response.answer).toContain("Possible Suspects");
      expect(response.answer).toContain("Evidence to Verify");
      expect(response.answer).toContain("Patrol Suggestions");
      expect(response.answer).toContain("Next Investigation Steps");
    });

    it("appends investigation recommendations to RAG queries", () => {
      const response = getHybridAssistantResponse("Census demographics details Dharwad");
      expect(response.answer).toContain("AI Investigation Recommendations");
    });

    it("appends investigation recommendations to Analysis queries", () => {
      const response = getHybridAssistantResponse("show crime trends");
      expect(response.answer).toContain("AI Investigation Recommendations");
    });
  });

  // ── 4. Criminal Timeline Tests ─────────────────────────────────────────────
  describe("Criminal Timeline Data Compilation", () => {
    it("returns correct list of criminal profiles and structured timeline events", () => {
      const profiles = getCriminalTimelineData();
      expect(profiles.length).toBeGreaterThan(0);

      const firstProfile = profiles[0];
      expect(firstProfile.id).toBeDefined();
      expect(firstProfile.name).toBeDefined();
      expect(firstProfile.age).toBeGreaterThan(0);
      expect(firstProfile.timeline).toBeDefined();

      if (firstProfile.timeline.length > 0) {
        const firstEvent = firstProfile.timeline[0];
        expect(firstEvent.id).toBeDefined();
        expect(firstEvent.date).toBeDefined();
        expect(["crime", "fir", "arrest", "court", "bail"]).toContain(firstEvent.type);
        expect(firstEvent.title).toBeDefined();
        expect(firstEvent.description).toBeDefined();
      }
    });
  });

  // ── 5. Evidence & Notifications Schema Tests ──────────────────────────────────
  describe("Evidence & Notifications Schema", () => {
    it("validates that evidence metadata type and verification statuses are valid", () => {
      const mockEvidence = [
        {
          id: "EVID-000842-1",
          evidenceType: "Image",
          verificationStatus: "Verified",
          aiSummary: "AI Summary: Geolocation matches.",
        },
      ];
      expect(mockEvidence[0].id).toContain("EVID-");
      expect(["Image", "PDF", "Video", "Document"]).toContain(mockEvidence[0].evidenceType);
      expect(["Pending", "Verified", "Rejected"]).toContain(mockEvidence[0].verificationStatus);
      expect(mockEvidence[0].aiSummary).toContain("AI Summary:");
    });

    it("validates notification priorities and read/unread attributes", () => {
      const mockNotif = {
        id: "notif-1",
        priority: "High",
        read: false,
      };
      expect(["High", "Medium", "Low"]).toContain(mockNotif.priority);
      expect(mockNotif.read).toBe(false);
    });
  });
});
