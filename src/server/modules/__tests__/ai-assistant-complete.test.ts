import { describe, it, expect } from "vitest";
import { getHybridAssistantResponse } from "../../crime-platform.server";
import { retrieveFromRag } from "../rag";

describe("AI Assistant Complete Tests", () => {
  it("should load all crimes and FIRs in RAG corpus (> 15,000 docs)", () => {
    const result = retrieveFromRag("ipc");
    expect(result.documentsSearched).toBeGreaterThan(15000);
  });

  it("should match mixed-case search terms in RAG", () => {
    const result = retrieveFromRag("Belagavi");
    expect(result.chunks.length).toBeGreaterThan(0);
    expect(result.chunks[0].score).toBeGreaterThan(0);
  });

  it("should preserve 3-letter IPC sections like 302", () => {
    const result = retrieveFromRag("IPC 302");
    expect(result.chunks.length).toBeGreaterThan(0);
    const hasIpc302 = result.chunks.some((c) => c.content.includes("IPC 302"));
    expect(hasIpc302).toBe(true);
  });

  it("should extract page context and clean queries", () => {
    const jsonContext = JSON.stringify({
      page: "Crimes",
      description: "Manage crimes",
      rows: [
        {
          caseNumber: "CASE/K001/000042",
          title: "Theft in Bengaluru Urban",
          districtName: "Bengaluru Urban",
          category: "Property Crime",
          severity: "Medium",
          status: "Open",
          investigationOfficer: "Inspector Kumar",
          accusedName: "John Doe",
          victimName: "Jane Smith",
          modusOperandi: "Lock breaking",
        },
      ],
    });

    const response = getHybridAssistantResponse(`open cases\nContext: ${jsonContext}`);
    expect(response.metrics?.query).toContain("status='Open'");

    const lookupResponse = getHybridAssistantResponse(`What is the status of CASE/K001/000042?\nContext: ${jsonContext}`);
    expect(lookupResponse.answer).toContain("CASE/K001/000042");
    expect(lookupResponse.answer).toContain("John Doe");

    const summaryResponse = getHybridAssistantResponse(`summarize these records\nContext: ${jsonContext}`);
    expect(summaryResponse.answer).toContain("summary of the 1 crime records");
    expect(summaryResponse.answer).toContain("Property Crime (1)");
  });

  it("should route general location queries (e.g. cases in mysore) to SQL correctly", () => {
    const response = getHybridAssistantResponse("cases in mysore");
    expect(response.handledBy).toBe("sql");
    expect(response.metrics?.query).toContain("district='mysuru'");
  });

  it("should fall back to RAG for unrecognised queries that contain database details", () => {
    const response = getHybridAssistantResponse("crimes involving poison");
    expect(response.handledBy).toBe("rag");
    expect(response.answer).toContain("Poison");
  });

  it("should query Census 2011 demographics via Text-to-SQL", () => {
    const response = getHybridAssistantResponse("what is the literacy rate of Dharwad");
    expect(response.handledBy).toBe("sql");
    expect(response.answer).toContain("Dharwad");
    expect(response.metrics?.query).toContain("census_2011");
  });

  it("should execute Pearson correlation analytics for literacy vs crime", () => {
    const response = getHybridAssistantResponse("literacy vs crime rate correlation");
    expect(response.handledBy).toBe("analysis");
    expect(response.answer).toContain("correlation");
    expect(response.metrics?.correlation).toBeDefined();
  });

  it("should retrieve Census data from RAG", () => {
    const response = getHybridAssistantResponse("Census 2011 demographics Dharwad");
    expect(response.handledBy).toBe("rag");
    expect(response.answer).toContain("Census 2011");
    expect(response.answer).toContain("Dharwad");
  });
});
