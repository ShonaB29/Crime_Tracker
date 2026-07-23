import fs from "node:fs";
import path from "node:path";

let isEnvLoaded = false;
let startupLogged = false;

export function loadEnvManual() {
  if (isEnvLoaded) return;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const index = trimmed.indexOf("=");
        if (index !== -1) {
          const key = trimmed.slice(0, index).trim();
          let val = trimmed.slice(index + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (key && process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (e) {
    console.error("[LLM Client] Failed to load .env manually:", e);
  } finally {
    isEnvLoaded = true;
  }
}

// Execute environment loading
loadEnvManual();

function isValidGeminiKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  // Valid Gemini keys from Google AI Studio start with AIzaSy
  return trimmed.startsWith("AIzaSy") && trimmed.length >= 30;
}

function isValidOpenAIKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.startsWith("sk-") && trimmed.length >= 20;
}

export function logLlmStartupStatus() {
  if (startupLogged) return;
  startupLogged = true;
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAIKey = process.env.OPENAI_API_KEY?.trim();

  let loadedCount = 0;
  if (isValidGeminiKey(geminiKey)) {
    console.log("✓ Gemini API Loaded");
    loadedCount++;
  } else if (geminiKey) {
    console.warn("⚠️ Invalid GEMINI_API_KEY format (expected key starting with AIzaSy). Offline Simulator fallback active.");
  }

  if (isValidOpenAIKey(openAIKey)) {
    console.log("✓ OpenAI API Loaded");
    loadedCount++;
  } else if (openAIKey) {
    console.warn("⚠️ Invalid OPENAI_API_KEY format (expected key starting with sk-). Offline Simulator fallback active.");
  }

  if (loadedCount === 0) {
    console.log("✓ Offline Simulator Enabled");
  }
}

// Run startup diagnostics on module import
logLlmStartupStatus();

export async function callLlm(prompt: string, timeoutMs = 2500): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAIKey = process.env.OPENAI_API_KEY?.trim();

  if (isValidGeminiKey(geminiKey)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = errorText;
        try {
          const jsonErr = JSON.parse(errorText);
          parsedMessage = jsonErr.error?.message || errorText;
        } catch (_) {}
        throw new Error(`Gemini API Error (${response.status}): ${parsedMessage}`);
      }

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (e: any) {
      clearTimeout(timeoutId);
      const isAbort = e.name === "AbortError";
      const errDetail = isAbort ? `Request timed out after ${timeoutMs}ms` : e.message || String(e);
      throw new Error(`Gemini LLM Call Failed: ${errDetail}`);
    }
  }

  if (isValidOpenAIKey(openAIKey)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const url = "https://api.openai.com/v1/chat/completions";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = errorText;
        try {
          const jsonErr = JSON.parse(errorText);
          parsedMessage = jsonErr.error?.message || errorText;
        } catch (_) {}
        throw new Error(`OpenAI API Error (${response.status}): ${parsedMessage}`);
      }

      const result = await response.json();
      return result.choices?.[0]?.message?.content ?? "";
    } catch (e: any) {
      clearTimeout(timeoutId);
      const isAbort = e.name === "AbortError";
      const errDetail = isAbort ? `Request timed out after ${timeoutMs}ms` : e.message || String(e);
      throw new Error(`OpenAI LLM Call Failed: ${errDetail}`);
    }
  }

  // Fallback: If no API keys are present in process.env, return empty string for offline simulator
  return "";
}

