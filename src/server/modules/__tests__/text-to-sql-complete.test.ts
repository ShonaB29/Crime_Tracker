import { describe, it, expect } from "vitest";
import {
  executeTextToSql,
  simulateLlmSqlGeneration,
  validateSqlQuery,
  detectDistrict,
} from "../text-to-sql";
import { routeIntent } from "../intent-router";
import { generateSqlResponse } from "../llm-response";
import { callLlm, logLlmStartupStatus } from "../llm-client";

describe("CrimeSense AI Engine - Complete Text-to-SQL & LLM Tests", () => {
  describe("1. LLM Integration & Diagnostics", () => {
    it("should run startup status diagnostics without throwing", () => {
      expect(() => logLlmStartupStatus()).not.toThrow();
    });

    it("should return empty string when no valid API keys are present", async () => {
      const originalGemini = process.env.GEMINI_API_KEY;
      const originalOpenAI = process.env.OPENAI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const res = await callLlm("Test prompt");
      expect(res).toBe("");

      process.env.GEMINI_API_KEY = originalGemini;
      process.env.OPENAI_API_KEY = originalOpenAI;
    });
  });

  describe("2. District Detection & Name Normalisation", () => {
    it("should normalize legacy district names to official Karnataka district names", () => {
      expect(detectDistrict("crimes in belgaum")).toBe("belagavi");
      expect(detectDistrict("cases in mysore")).toBe("mysuru");
      expect(detectDistrict("theft in bangalore")).toBe("bengaluru urban");
      expect(detectDistrict("hotspots in shimoga")).toBe("shivamogga");
      expect(detectDistrict("crimes in bellary")).toBe("ballari");
    });
  });

  describe("3. SQL Generation (No Templates - Intent Driven)", () => {
    it("should generate COUNT query for 'How many crimes in Belagavi district?'", () => {
      const sql = simulateLlmSqlGeneration("How many crimes in Belagavi district?");
      expect(sql.toUpperCase()).toContain("COUNT");
      expect(sql.toLowerCase()).toContain("belagavi");
    });

    it("should generate GROUP BY + ORDER BY query for 'Top 10 districts by crime count'", () => {
      const sql = simulateLlmSqlGeneration("Top 10 districts by crime count");
      expect(sql.toUpperCase()).toContain("GROUP BY");
      expect(sql.toUpperCase()).toContain("ORDER BY");
      expect(sql.toUpperCase()).toContain("LIMIT 10");
    });

    it("should generate robbery filter query for 'Show robbery FIRs'", () => {
      const sql = simulateLlmSqlGeneration("Show robbery FIRs");
      expect(sql.toLowerCase()).toContain("robbery");
      expect(sql.toUpperCase()).toContain("SELECT");
    });

    it("should generate Crimes Against Women query for 'Crimes against women in Mysuru'", () => {
      const sql = simulateLlmSqlGeneration("Crimes against women in Mysuru");
      expect(sql.toLowerCase()).toContain("mysuru");
      expect(sql.toLowerCase()).toMatch(/caw|crimes_against_women/);
    });

    it("should generate monthly trend query for 'Monthly crime trend'", () => {
      const sql = simulateLlmSqlGeneration("Monthly crime trend");
      expect(sql.toLowerCase()).toMatch(/month|group by/);
    });

    it("should generate AVG query for 'Average crimes per district'", () => {
      const sql = simulateLlmSqlGeneration("Average crimes per district");
      expect(sql.toUpperCase()).toContain("AVG");
    });

    it("should generate IPC frequency query for 'Most common IPC sections'", () => {
      const sql = simulateLlmSqlGeneration("Most common IPC sections");
      expect(sql.toLowerCase()).toContain("ipc_section");
      expect(sql.toUpperCase()).toContain("GROUP BY");
    });

    it("should generate latest FIRs query for 'Latest FIRs'", () => {
      const sql = simulateLlmSqlGeneration("Latest FIRs");
      expect(sql.toUpperCase()).toContain("ORDER BY");
      expect(sql.toUpperCase()).toContain("LIMIT");
    });
  });

  describe("4. SQL Validation & Security Guardrails", () => {
    it("should validate and accept valid SELECT queries", () => {
      const v = validateSqlQuery("SELECT * FROM public.firs WHERE fir_number = '123';");
      expect(v.valid).toBe(true);
    });

    it("should reject non-SELECT mutation operations (DELETE, UPDATE, DROP, INSERT, ALTER)", () => {
      expect(validateSqlQuery("DELETE FROM public.firs;").valid).toBe(false);
      expect(validateSqlQuery("UPDATE public.firs SET severity = 'Low';").valid).toBe(false);
      expect(validateSqlQuery("DROP TABLE public.districts;").valid).toBe(false);
      expect(validateSqlQuery("INSERT INTO public.firs (id) VALUES ('1');").valid).toBe(false);
      expect(validateSqlQuery("ALTER TABLE public.firs ADD COLUMN secret TEXT;").valid).toBe(false);
    });

    it("should reject unauthorized table references", () => {
      const v = validateSqlQuery("SELECT * FROM public.user_passwords;");
      expect(v.valid).toBe(false);
      expect(v.error).toContain("Unauthorized table reference");
    });
  });

  describe("5. Intent Detection Routing", () => {
    it("should route database questions to 'sql' intent", async () => {
      const r1 = await routeIntent("How many crimes in Belagavi");
      expect(r1.intent).toBe("sql");

      const r2 = await routeIntent("Top 10 districts by crime count");
      expect(r2.intent).toBe("sql");
    });

    it("should route Crimes Against Women queries to 'caw' intent", async () => {
      const r = await routeIntent("Crimes against women in Mysuru");
      expect(r.intent).toBe("caw");
    });

    it("should route analytics and prediction queries to 'analysis' intent", async () => {
      const r1 = await routeIntent("Predict crimes next month");
      expect(r1.intent).toBe("analysis");
      expect(r1.analysisType).toBe("prediction");

      const r2 = await routeIntent("Show hotspot map of Karnataka");
      expect(r2.intent).toBe("analysis");
      expect(r2.analysisType).toBe("hotspot");
    });

    it("should route document/investigation queries to 'rag' intent", async () => {
      const r = await routeIntent("Summarize investigation notes for legal report");
      expect(r.intent).toBe("rag");
    });
  });

  describe("6. Database Execution & Response Synthesis", () => {
    it("should execute Text-to-SQL against database without parameter binding errors", async () => {
      const result = await executeTextToSql("how many crimes in belagavi", "sql");
      expect(result.error).toBeUndefined();
      expect(result.queryDescription).toBeDefined();
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rowsReturned).toBeGreaterThanOrEqual(0);
    });

    it("should synthesize a complete hybrid response containing SQL, rows, execution time, and confidence", async () => {
      const sqlResult = await executeTextToSql("top 10 districts by crime count", "sql");
      const response = await generateSqlResponse(sqlResult, "top 10 districts by crime count");

      expect(response.handledBy).toBe("sql");
      expect(response.queryDescription).toBe(sqlResult.queryDescription);
      expect(response.confidence).toBeGreaterThan(0.8);
      expect(response.executionTimeMs).toBeDefined();
      expect(Array.isArray(response.tableRows)).toBe(true);
      expect(response.answer).not.toContain("```sql");
    });
  });
});
