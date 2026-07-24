import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as supabase } from "./client-CPTHcKtl.mjs";
import { t as AuthProvider } from "./useAuth-C2tvUku-.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DqZWi1Pw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DFENna0M.css";
var ksp_emblem_default = "/assets/ksp-emblem-Dg2bKmzS.png";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "KSP Crime Intelligence Platform" },
			{
				name: "description",
				content: "An AI-powered platform for Karnataka State Police, providing crime analytics, prediction, and investigation support."
			},
			{
				name: "author",
				content: "KSP"
			},
			{
				property: "og:title",
				content: "KSP Crime Intelligence Platform"
			},
			{
				property: "og:description",
				content: "An AI-powered platform for Karnataka State Police, providing crime analytics, prediction, and investigation support."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@ksp"
			},
			{
				name: "twitter:title",
				content: "KSP Crime Intelligence Platform"
			},
			{
				name: "twitter:description",
				content: "An AI-powered platform for Karnataka State Police, providing crime analytics, prediction, and investigation support."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/png",
			href: ksp_emblem_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$17 = () => import("./reset-password-BF1Kyx3K.mjs");
var Route$18 = createFileRoute("/reset-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set New Password · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./forgot-password-C6I6MqAJ.mjs");
var Route$17 = createFileRoute("/forgot-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Reset Password · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./auth-BvKIvlRE.mjs");
var Route$16 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [{ title: "Sign In · KSP Crime Intelligence" }, {
		name: "description",
		content: "Secure access to the Karnataka State Police Crime Intelligence & Analytical Platform."
	}] }),
	validateSearch: (search) => ({
		redirect: typeof search.redirect === "string" ? search.redirect : void 0,
		mode: search.mode === "register" ? "register" : "login"
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./route-BQmofTGD.mjs");
var Route$15 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (data.user) return { user: data.user };
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: {
				redirect: location.href,
				mode: "login"
			}
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./routes-BG_k4tGW.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "KSP Crime Intelligence & Analytical Platform" },
		{
			name: "description",
			content: "AI-powered crime intelligence, analytics, hotspot prediction and investigation assistance for the Karnataka State Police."
		},
		{
			property: "og:title",
			content: "KSP Crime Intelligence Platform"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var isEnvLoaded = false;
var startupLogged = false;
function loadEnvManual() {
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
					if (val.startsWith("\"") && val.endsWith("\"") || val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
					if (key && process.env[key] === void 0) process.env[key] = val;
				}
			}
		}
	} catch (e) {
		console.error("[LLM Client] Failed to load .env manually:", e);
	} finally {
		isEnvLoaded = true;
	}
}
loadEnvManual();
function isValidGeminiKey(key) {
	if (!key) return false;
	const trimmed = key.trim();
	return trimmed.startsWith("AIzaSy") && trimmed.length >= 30;
}
function isValidOpenAIKey(key) {
	if (!key) return false;
	const trimmed = key.trim();
	return trimmed.startsWith("sk-") && trimmed.length >= 20;
}
function logLlmStartupStatus() {
	if (startupLogged) return;
	startupLogged = true;
	const geminiKey = process.env.GEMINI_API_KEY?.trim();
	const openAIKey = process.env.OPENAI_API_KEY?.trim();
	let loadedCount = 0;
	if (isValidGeminiKey(geminiKey)) {
		console.log("✓ Gemini API Loaded");
		loadedCount++;
	} else if (geminiKey) console.warn("⚠️ Invalid GEMINI_API_KEY format (expected key starting with AIzaSy). Offline Simulator fallback active.");
	if (isValidOpenAIKey(openAIKey)) {
		console.log("✓ OpenAI API Loaded");
		loadedCount++;
	} else if (openAIKey) console.warn("⚠️ Invalid OPENAI_API_KEY format (expected key starting with sk-). Offline Simulator fallback active.");
	if (loadedCount === 0) console.log("✓ Offline Simulator Enabled");
}
logLlmStartupStatus();
async function callLlm(prompt, timeoutMs = 2500) {
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
					generationConfig: { temperature: .1 }
				}),
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			if (!response.ok) {
				const errorText = await response.text();
				let parsedMessage = errorText;
				try {
					parsedMessage = JSON.parse(errorText).error?.message || errorText;
				} catch (_) {}
				throw new Error(`Gemini API Error (${response.status}): ${parsedMessage}`);
			}
			return (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text ?? "";
		} catch (e) {
			clearTimeout(timeoutId);
			const errDetail = e.name === "AbortError" ? `Request timed out after ${timeoutMs}ms` : e.message || String(e);
			throw new Error(`Gemini LLM Call Failed: ${errDetail}`);
		}
	}
	if (isValidOpenAIKey(openAIKey)) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
		try {
			const response = await fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${openAIKey}`
				},
				body: JSON.stringify({
					model: "gpt-4o-mini",
					messages: [{
						role: "user",
						content: prompt
					}],
					temperature: .1
				}),
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			if (!response.ok) {
				const errorText = await response.text();
				let parsedMessage = errorText;
				try {
					parsedMessage = JSON.parse(errorText).error?.message || errorText;
				} catch (_) {}
				throw new Error(`OpenAI API Error (${response.status}): ${parsedMessage}`);
			}
			return (await response.json()).choices?.[0]?.message?.content ?? "";
		} catch (e) {
			clearTimeout(timeoutId);
			const errDetail = e.name === "AbortError" ? `Request timed out after ${timeoutMs}ms` : e.message || String(e);
			throw new Error(`OpenAI LLM Call Failed: ${errDetail}`);
		}
	}
	return "";
}
/**
* MODULE: Intent Router (Workflow Step 3 & 4)
*
* Classifies the user query into one of four buckets:
*   "sql"      → Text-to-SQL  (structured counts, lists, filters)
*   "rag"      → RAG          (document/report retrieval)
*   "analysis" → Analysis Engine (trends, hotspots, predictions, network)
*   "caw"      → Crimes Against Women handler (dedicated bucket)
*   "general"  → Fallback
*/
var CAW_KEYWORDS = [
	"women",
	"woman",
	"female",
	"girl",
	"rape",
	"sexual assault",
	"dowry",
	"dowry death",
	"domestic violence",
	"cruelty by husband",
	"kidnapping of women",
	"abduction",
	"molestation",
	"eve teasing",
	"insult to modesty",
	"immoral traffic",
	"trafficking",
	"acid attack",
	"stalking",
	"crimes against women",
	"violence against women",
	"gender crime",
	"assault on women",
	"outraging modesty",
	"indecent representation"
];
var SQL_KEYWORDS = [
	"how many",
	"count",
	"list",
	"show",
	"find",
	"search",
	"top",
	"highest",
	"lowest",
	"total",
	"fir",
	"firs",
	"case number",
	"case",
	"cases",
	"case/",
	"fir/",
	"district",
	"officer",
	"accused",
	"victim",
	"status",
	"category",
	"severity",
	"weapon",
	"arrest",
	"court",
	"station",
	"record",
	"records",
	"ipc",
	"section",
	"open",
	"solved",
	"pending",
	"critical",
	"high",
	"medium",
	"low",
	"theft",
	"murder",
	"assault",
	"fraud",
	"robbery",
	"burglary",
	"narcotics",
	"cyber",
	"recent",
	"latest",
	"today",
	"this month",
	"last month",
	"unsolved",
	"under investigation",
	"charge sheet",
	"convicted",
	"acquitted",
	"bail",
	"wanted",
	"arrested",
	"repeat",
	"modus",
	"knife",
	"firearm",
	"property",
	"violent",
	"economic",
	"organized",
	"si",
	"inspector",
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
	"mysore"
];
var RAG_KEYWORDS = [
	"report",
	"document",
	"summary",
	"investigation",
	"legal",
	"pdf",
	"detail",
	"description",
	"notes",
	"evidence",
	"charge sheet",
	"case summary",
	"case detail",
	"file",
	"census"
];
var ANALYSIS_KEYWORDS = [
	"trend",
	"forecast",
	"predict",
	"hotspot",
	"heat",
	"network",
	"relationship",
	"pattern",
	"spike",
	"anomaly",
	"risk score",
	"repeat offender",
	"modus operandi",
	"cluster",
	"year over year",
	"monthly",
	"annual",
	"increase",
	"decrease",
	"correlation",
	"vs",
	"compare"
];
function countMatches(lower, keywords) {
	return keywords.filter((kw) => lower.includes(kw)).length;
}
async function routeIntent(question) {
	const normalisedQuery = question.trim().toLowerCase();
	try {
		const llmOutput = await callLlm(`You are a query classifier for a Crime Intelligence platform.
Analyze the user's query and classify it into one of these intents:
- "sql": structured questions asking for statistics, counts, trends, totals, averages, sorting (top/bottom), district comparison, or lists of records (e.g. "how many crimes in Belagavi", "top 10 districts by crime count", "average crimes per district", "show theft cases in Mysore", "monthly crime trend of Belagavi").
- "rag": unstructured questions asking about case narratives, details of what happened, evidence summaries, officer reports, descriptions, legal sections/IPC sections context, or Census 2011 documentation summaries (e.g. "what are the case details for CASE/K01", "summarize investigation notes for FIR 123", "explain the evidence against Rajesh").
- "analysis": complex analysis such as forecasting, linear regression predictions, geospatial hotspots/heatmaps, or co-offending network relationships (e.g. "predict crimes next month", "detect hotspots", "show repeat offender networks", "correlation of literacy vs crime", "literacy vs crime rate correlation").
- "caw": questions relating directly to Crimes Against Women (rape, dowry deaths, domestic violence, molestation).
- "general": greetings, fallback, or non-analytical queries.

If the intent is "analysis", extract one of the following analysis types: "trend", "hotspot", "network", "prediction", "correlation". Otherwise, set analysisType to null.

You MUST respond ONLY with a JSON object in this format:
{
  "intent": "sql" | "rag" | "analysis" | "caw" | "general",
  "analysisType": "trend" | "hotspot" | "network" | "prediction" | "correlation" | null
}

Query: "${question}"
Response:`);
		if (llmOutput) {
			const jsonStart = llmOutput.indexOf("{");
			const jsonEnd = llmOutput.lastIndexOf("}");
			if (jsonStart !== -1 && jsonEnd !== -1) {
				const jsonStr = llmOutput.substring(jsonStart, jsonEnd + 1);
				const parsed = JSON.parse(jsonStr);
				if (parsed && typeof parsed === "object" && parsed.intent) {
					const result = {
						intent: parsed.intent,
						normalisedQuery
					};
					if (parsed.analysisType) result.analysisType = parsed.analysisType;
					return result;
				}
			}
		}
	} catch (e) {
		console.warn("[Intent Router] LLM classification unavailable, using offline heuristics:", e.message || String(e));
	}
	if (countMatches(normalisedQuery, CAW_KEYWORDS) > 0) return {
		intent: "caw",
		normalisedQuery
	};
	const sqlScore = countMatches(normalisedQuery, SQL_KEYWORDS);
	const ragScore = countMatches(normalisedQuery, RAG_KEYWORDS);
	const analysisScore = countMatches(normalisedQuery, ANALYSIS_KEYWORDS);
	if (analysisScore >= sqlScore && analysisScore >= ragScore && analysisScore > 0) {
		let analysisType = "trend";
		if (normalisedQuery.includes("hotspot") || normalisedQuery.includes("heat") || normalisedQuery.includes("cluster")) analysisType = "hotspot";
		else if (normalisedQuery.includes("network") || normalisedQuery.includes("relationship")) analysisType = "network";
		else if (normalisedQuery.includes("predict") || normalisedQuery.includes("forecast")) analysisType = "prediction";
		else if (normalisedQuery.includes("correlation") || normalisedQuery.includes("literacy") || normalisedQuery.includes("demographic") || normalisedQuery.includes("ratio") || normalisedQuery.includes("density") || normalisedQuery.includes("vs") || normalisedQuery.includes("compare")) analysisType = "correlation";
		return {
			intent: "analysis",
			normalisedQuery,
			analysisType
		};
	}
	if (ragScore >= sqlScore && ragScore > 0) return {
		intent: "rag",
		normalisedQuery
	};
	if (sqlScore > 0) return {
		intent: "sql",
		normalisedQuery
	};
	return {
		intent: "general",
		normalisedQuery
	};
}
var KA_DISTRICTS = [
	{
		name: "Bagalkote",
		weight: .025,
		lat: 16.18,
		lng: 75.7
	},
	{
		name: "Ballari",
		weight: .038,
		lat: 15.14,
		lng: 76.92
	},
	{
		name: "Belagavi",
		weight: .058,
		lat: 15.85,
		lng: 74.5
	},
	{
		name: "Bengaluru Rural",
		weight: .022,
		lat: 13.22,
		lng: 77.57
	},
	{
		name: "Bengaluru Urban",
		weight: .145,
		lat: 12.97,
		lng: 77.59
	},
	{
		name: "Bidar",
		weight: .03,
		lat: 17.91,
		lng: 77.52
	},
	{
		name: "Chamarajanagar",
		weight: .018,
		lat: 11.92,
		lng: 76.94
	},
	{
		name: "Chikkaballapura",
		weight: .022,
		lat: 13.43,
		lng: 77.73
	},
	{
		name: "Chikkamagaluru",
		weight: .02,
		lat: 13.32,
		lng: 75.78
	},
	{
		name: "Chitradurga",
		weight: .026,
		lat: 14.23,
		lng: 76.4
	},
	{
		name: "Dakshina Kannada",
		weight: .035,
		lat: 12.87,
		lng: 75
	},
	{
		name: "Davanagere",
		weight: .035,
		lat: 14.46,
		lng: 75.92
	},
	{
		name: "Dharwad",
		weight: .038,
		lat: 15.46,
		lng: 75.01
	},
	{
		name: "Gadag",
		weight: .018,
		lat: 15.42,
		lng: 75.62
	},
	{
		name: "Hassan",
		weight: .03,
		lat: 13,
		lng: 76.1
	},
	{
		name: "Haveri",
		weight: .025,
		lat: 14.79,
		lng: 75.4
	},
	{
		name: "Kalaburagi",
		weight: .045,
		lat: 17.33,
		lng: 76.82
	},
	{
		name: "Kodagu",
		weight: .01,
		lat: 12.42,
		lng: 75.74
	},
	{
		name: "Kolar",
		weight: .025,
		lat: 13.14,
		lng: 78.13
	},
	{
		name: "Koppal",
		weight: .022,
		lat: 15.35,
		lng: 76.15
	},
	{
		name: "Mandya",
		weight: .028,
		lat: 12.52,
		lng: 76.9
	},
	{
		name: "Mysuru",
		weight: .055,
		lat: 12.3,
		lng: 76.64
	},
	{
		name: "Raichur",
		weight: .032,
		lat: 16.2,
		lng: 77.36
	},
	{
		name: "Ramanagara",
		weight: .02,
		lat: 12.72,
		lng: 77.28
	},
	{
		name: "Shivamogga",
		weight: .035,
		lat: 13.93,
		lng: 75.56
	},
	{
		name: "Tumakuru",
		weight: .04,
		lat: 13.34,
		lng: 77.1
	},
	{
		name: "Udupi",
		weight: .022,
		lat: 13.34,
		lng: 74.74
	},
	{
		name: "Uttara Kannada",
		weight: .02,
		lat: 14.8,
		lng: 74.13
	},
	{
		name: "Vijayapura",
		weight: .038,
		lat: 16.83,
		lng: 75.72
	},
	{
		name: "Yadgir",
		weight: .02,
		lat: 16.77,
		lng: 77.14
	},
	{
		name: "Vijayanagara",
		weight: .022,
		lat: 15.33,
		lng: 76.52
	}
];
var KA_STATE_TOTALS = {
	2001: {
		rape: 812,
		kidnapping: 1240,
		dowry_deaths: 480,
		assault: 2100,
		insult: 890,
		cruelty: 8200,
		importation: 12,
		immoral: 340,
		dowry_prohibition: 180,
		indecent: 45,
		sati: 0
	},
	2002: {
		rape: 856,
		kidnapping: 1310,
		dowry_deaths: 495,
		assault: 2250,
		insult: 920,
		cruelty: 8650,
		importation: 10,
		immoral: 360,
		dowry_prohibition: 195,
		indecent: 48,
		sati: 0
	},
	2003: {
		rape: 901,
		kidnapping: 1380,
		dowry_deaths: 510,
		assault: 2380,
		insult: 960,
		cruelty: 9100,
		importation: 11,
		immoral: 375,
		dowry_prohibition: 210,
		indecent: 52,
		sati: 0
	},
	2004: {
		rape: 948,
		kidnapping: 1450,
		dowry_deaths: 525,
		assault: 2520,
		insult: 1e3,
		cruelty: 9580,
		importation: 9,
		immoral: 390,
		dowry_prohibition: 225,
		indecent: 55,
		sati: 0
	},
	2005: {
		rape: 998,
		kidnapping: 1530,
		dowry_deaths: 540,
		assault: 2670,
		insult: 1045,
		cruelty: 10100,
		importation: 8,
		immoral: 410,
		dowry_prohibition: 240,
		indecent: 58,
		sati: 0
	},
	2006: {
		rape: 1050,
		kidnapping: 1610,
		dowry_deaths: 555,
		assault: 2830,
		insult: 1090,
		cruelty: 10650,
		importation: 7,
		immoral: 425,
		dowry_prohibition: 255,
		indecent: 62,
		sati: 0
	},
	2007: {
		rape: 1105,
		kidnapping: 1700,
		dowry_deaths: 570,
		assault: 3e3,
		insult: 1140,
		cruelty: 11230,
		importation: 6,
		immoral: 445,
		dowry_prohibition: 270,
		indecent: 65,
		sati: 0
	},
	2008: {
		rape: 1163,
		kidnapping: 1790,
		dowry_deaths: 585,
		assault: 3180,
		insult: 1190,
		cruelty: 11840,
		importation: 5,
		immoral: 460,
		dowry_prohibition: 285,
		indecent: 68,
		sati: 0
	},
	2009: {
		rape: 1224,
		kidnapping: 1890,
		dowry_deaths: 600,
		assault: 3370,
		insult: 1245,
		cruelty: 12490,
		importation: 5,
		immoral: 480,
		dowry_prohibition: 300,
		indecent: 72,
		sati: 0
	},
	2010: {
		rape: 1288,
		kidnapping: 1990,
		dowry_deaths: 615,
		assault: 3570,
		insult: 1300,
		cruelty: 13170,
		importation: 4,
		immoral: 500,
		dowry_prohibition: 315,
		indecent: 75,
		sati: 0
	},
	2011: {
		rape: 1356,
		kidnapping: 2100,
		dowry_deaths: 630,
		assault: 3780,
		insult: 1360,
		cruelty: 13890,
		importation: 4,
		immoral: 520,
		dowry_prohibition: 330,
		indecent: 79,
		sati: 0
	},
	2012: {
		rape: 1427,
		kidnapping: 2210,
		dowry_deaths: 645,
		assault: 4e3,
		insult: 1420,
		cruelty: 14650,
		importation: 3,
		immoral: 545,
		dowry_prohibition: 345,
		indecent: 83,
		sati: 0
	},
	2013: {
		rape: 1502,
		kidnapping: 2330,
		dowry_deaths: 660,
		assault: 4240,
		insult: 1485,
		cruelty: 15450,
		importation: 3,
		immoral: 565,
		dowry_prohibition: 360,
		indecent: 87,
		sati: 0
	},
	2014: {
		rape: 1580,
		kidnapping: 2460,
		dowry_deaths: 675,
		assault: 4490,
		insult: 1555,
		cruelty: 16300,
		importation: 3,
		immoral: 590,
		dowry_prohibition: 375,
		indecent: 91,
		sati: 0
	},
	2015: {
		rape: 1662,
		kidnapping: 2590,
		dowry_deaths: 690,
		assault: 4760,
		insult: 1625,
		cruelty: 17190,
		importation: 2,
		immoral: 615,
		dowry_prohibition: 390,
		indecent: 95,
		sati: 0
	},
	2016: {
		rape: 1748,
		kidnapping: 2730,
		dowry_deaths: 705,
		assault: 5040,
		insult: 1700,
		cruelty: 18130,
		importation: 2,
		immoral: 640,
		dowry_prohibition: 405,
		indecent: 99,
		sati: 0
	},
	2017: {
		rape: 1838,
		kidnapping: 2880,
		dowry_deaths: 720,
		assault: 5340,
		insult: 1780,
		cruelty: 19120,
		importation: 2,
		immoral: 665,
		dowry_prohibition: 420,
		indecent: 104,
		sati: 0
	},
	2018: {
		rape: 1932,
		kidnapping: 3040,
		dowry_deaths: 735,
		assault: 5660,
		insult: 1860,
		cruelty: 20160,
		importation: 2,
		immoral: 695,
		dowry_prohibition: 435,
		indecent: 109,
		sati: 0
	},
	2019: {
		rape: 2031,
		kidnapping: 3200,
		dowry_deaths: 750,
		assault: 5990,
		insult: 1945,
		cruelty: 21260,
		importation: 1,
		immoral: 720,
		dowry_prohibition: 450,
		indecent: 114,
		sati: 0
	},
	2020: {
		rape: 1820,
		kidnapping: 2880,
		dowry_deaths: 720,
		assault: 5390,
		insult: 1750,
		cruelty: 19130,
		importation: 1,
		immoral: 648,
		dowry_prohibition: 405,
		indecent: 103,
		sati: 0
	},
	2021: {
		rape: 2135,
		kidnapping: 3370,
		dowry_deaths: 765,
		assault: 6340,
		insult: 2035,
		cruelty: 22420,
		importation: 1,
		immoral: 758,
		dowry_prohibition: 465,
		indecent: 120,
		sati: 0
	}
};
function rng$1(seed) {
	let s = seed >>> 0;
	return () => {
		s ^= s << 13;
		s ^= s >> 17;
		s ^= s << 5;
		return (s >>> 0) / 4294967295;
	};
}
var _cawRecords = null;
function getCawRecords() {
	if (_cawRecords) return _cawRecords;
	const records = [];
	const rand = rng$1(20260702);
	for (const year of Object.keys(KA_STATE_TOTALS).map(Number)) {
		const totals = KA_STATE_TOTALS[year];
		for (const district of KA_DISTRICTS) {
			const noise = () => .85 + rand() * .3;
			const w = district.weight;
			const rape = Math.max(0, Math.round(totals.rape * w * noise()));
			const kidnapping_abduction = Math.max(0, Math.round(totals.kidnapping * w * noise()));
			const dowry_deaths = Math.max(0, Math.round(totals.dowry_deaths * w * noise()));
			const assault_on_women = Math.max(0, Math.round(totals.assault * w * noise()));
			const insult_to_modesty = Math.max(0, Math.round(totals.insult * w * noise()));
			const cruelty_by_husband = Math.max(0, Math.round(totals.cruelty * w * noise()));
			const importation_of_girls = Math.max(0, Math.round(totals.importation * w * noise()));
			const immoral_traffic = Math.max(0, Math.round(totals.immoral * w * noise()));
			const dowry_prohibition = Math.max(0, Math.round(totals.dowry_prohibition * w * noise()));
			const indecent_representation = Math.max(0, Math.round(totals.indecent * w * noise()));
			const sati_prevention = 0;
			const total_caw = rape + kidnapping_abduction + dowry_deaths + assault_on_women + insult_to_modesty + cruelty_by_husband + importation_of_girls + immoral_traffic + dowry_prohibition + indecent_representation + sati_prevention;
			records.push({
				state: "Karnataka",
				district: district.name,
				year,
				rape,
				kidnapping_abduction,
				dowry_deaths,
				assault_on_women,
				insult_to_modesty,
				cruelty_by_husband,
				importation_of_girls,
				immoral_traffic,
				dowry_prohibition,
				indecent_representation,
				sati_prevention,
				total_caw
			});
		}
	}
	_cawRecords = records;
	return records;
}
/** All records for a specific year across all districts */
function getCawByYear(year) {
	return getCawRecords().filter((r) => r.year === year);
}
/** Latest year available */
function getLatestCawYear() {
	return 2021;
}
/** Aggregate totals across all districts for a given year */
function getCawStateTotals(year) {
	return getCawByYear(year).reduce((acc, r) => ({
		rape: acc.rape + r.rape,
		kidnapping_abduction: acc.kidnapping_abduction + r.kidnapping_abduction,
		dowry_deaths: acc.dowry_deaths + r.dowry_deaths,
		assault_on_women: acc.assault_on_women + r.assault_on_women,
		insult_to_modesty: acc.insult_to_modesty + r.insult_to_modesty,
		cruelty_by_husband: acc.cruelty_by_husband + r.cruelty_by_husband,
		importation_of_girls: acc.importation_of_girls + r.importation_of_girls,
		immoral_traffic: acc.immoral_traffic + r.immoral_traffic,
		dowry_prohibition: acc.dowry_prohibition + r.dowry_prohibition,
		indecent_representation: acc.indecent_representation + r.indecent_representation,
		sati_prevention: 0,
		total_caw: acc.total_caw + r.total_caw
	}), {
		rape: 0,
		kidnapping_abduction: 0,
		dowry_deaths: 0,
		assault_on_women: 0,
		insult_to_modesty: 0,
		cruelty_by_husband: 0,
		importation_of_girls: 0,
		immoral_traffic: 0,
		dowry_prohibition: 0,
		indecent_representation: 0,
		sati_prevention: 0,
		total_caw: 0
	});
}
/** Year-over-year trend for a specific CAW category */
function getCawTrend(category) {
	return Object.keys(KA_STATE_TOTALS).map(Number).map((year) => ({
		year,
		value: getCawStateTotals(year)[category]
	}));
}
/** Top N districts by total CAW for a given year */
function getTopCawDistricts(year, topN = 10) {
	return getCawByYear(year).sort((a, b) => b.total_caw - a.total_caw).slice(0, topN);
}
/** District coordinates (for heatmap) */
function getDistrictCoords() {
	return Object.fromEntries(KA_DISTRICTS.map((d) => [d.name, {
		lat: d.lat,
		lng: d.lng
	}]));
}
var CRIME_HEADS = [
	{
		head: "Murder",
		group: "Violent Crime",
		baseRate: 35
	},
	{
		head: "Theft",
		group: "Property Crime",
		baseRate: 220
	},
	{
		head: "Kidnapping",
		group: "Violent Crime",
		baseRate: 48
	},
	{
		head: "Cheating",
		group: "Economic Offence",
		baseRate: 95
	}
];
function rng(seed) {
	let s = seed >>> 0;
	return () => {
		s ^= s << 13;
		s ^= s >> 17;
		s ^= s << 5;
		return (s >>> 0) / 4294967295;
	};
}
var cachedRecords = null;
function getCrimeIndiaAnnualRecords(districts) {
	if (cachedRecords) return cachedRecords;
	const records = [];
	const rand = rng(998877);
	let idCounter = 1;
	for (let year = 2001; year <= 2021; year++) for (const d of districts) {
		const popRatio = d.population / 1e6;
		for (const item of CRIME_HEADS) {
			const noise = .8 + rand() * .4;
			const yearGrowth = 1 + (year - 2001) * .025;
			const cases_reported = Math.round(item.baseRate * popRatio * yearGrowth * noise);
			const cases_chargesheeted = Math.round(cases_reported * (.65 + rand() * .15));
			const cases_convicted = Math.round(cases_chargesheeted * (.35 + rand() * .1));
			const cases_acquitted = Math.max(0, cases_chargesheeted - cases_convicted - Math.round(rand() * 5));
			const persons_arrested = Math.round(cases_chargesheeted * (1.1 + rand() * .4));
			const persons_convicted = Math.round(cases_convicted * (1 + rand() * .2));
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
				persons_convicted
			});
		}
	}
	cachedRecords = records;
	return records;
}
/**
* MODULE: Text-to-SQL (Workflow Step 4a & 5)
*
* Translates natural-language questions into structured dataset queries.
* Upgraded to use Google Gemini / OpenAI LLM with full schema context, 30+ few-shots,
* strict SELECT-only query validation, execution error handling, auto-regeneration,
* and sanitized in-memory SQLite seeder fallback.
*/
var DISTRICT_NAMES$1 = [
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
	"vijayanagara"
];
var DISTRICT_ALIASES = {
	belgaum: "belagavi",
	mysore: "mysuru",
	bangalore: "bengaluru urban",
	shimoga: "shivamogga",
	bellary: "ballari",
	gulbarga: "kalaburagi",
	bijapur: "vijayapura",
	chikmagalur: "chikkamagaluru",
	tumkur: "tumakuru"
};
function detectDistrict(q) {
	const lower = q.toLowerCase();
	for (const [alias, real] of Object.entries(DISTRICT_ALIASES)) if (lower.includes(alias)) return real;
	return DISTRICT_NAMES$1.find((d) => lower.includes(d));
}
var cachedSqliteDb = null;
async function ensureSqliteDb() {
	if (cachedSqliteDb) return cachedSqliteDb;
	try {
		const DatabaseSync = (await new Function("return import(\"node:sqlite\")")().catch(() => null))?.DatabaseSync;
		if (!DatabaseSync) return null;
		const db = new DatabaseSync(":memory:");
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
		const data = getData();
		const cleanParam = (val) => {
			if (val === void 0 || val === null) return null;
			if (typeof val === "boolean") return val ? 1 : 0;
			if (typeof val === "number") return Number.isNaN(val) ? null : val;
			if (typeof val === "object") return JSON.stringify(val);
			return String(val);
		};
		const insDist = db.prepare(`
      INSERT INTO districts (id, state, name, code, latitude, longitude, area_sq_km, population, male_population, female_population, sex_ratio, literacy_rate, urban_population, rural_population, sc_population, st_population, police_station_count, hotspot_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
		for (const d of data.districts) insDist.run(cleanParam(d.id), cleanParam(d.state || "Karnataka"), cleanParam(d.name), cleanParam(d.code), cleanParam(d.latitude), cleanParam(d.longitude), cleanParam(d.areaSqKm), cleanParam(d.population), cleanParam(d.malePopulation), cleanParam(d.femalePopulation), cleanParam(d.sexRatio || d.genderRatio), cleanParam(d.literacyRate), cleanParam(d.urbanPopulation), cleanParam(d.ruralPopulation), cleanParam(d.scPopulation), cleanParam(d.stPopulation), cleanParam(d.policeStationCount), cleanParam(d.hotspotCount));
		const ciaRecords = getCrimeIndiaAnnualRecords(data.districts);
		const insCia = db.prepare(`
      INSERT INTO crime_india_annual (state, district, district_id, year, crime_head, crime_group, sub_group, cases_reported, cases_chargesheeted, cases_convicted, cases_acquitted, persons_arrested, persons_convicted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
		for (const r of ciaRecords) insCia.run(cleanParam(r.state), cleanParam(r.district), cleanParam(r.district_id || null), cleanParam(r.year), cleanParam(r.crime_head), cleanParam(r.crime_group), cleanParam(r.sub_group || null), cleanParam(r.cases_reported), cleanParam(r.cases_chargesheeted), cleanParam(r.cases_convicted), cleanParam(r.cases_acquitted), cleanParam(r.persons_arrested), cleanParam(r.persons_convicted));
		const cawRecords = getCawRecords();
		const insCaw = db.prepare(`
      INSERT INTO crimes_against_women (state, district, district_id, year, rape, kidnapping_abduction, dowry_deaths, assault_on_women, insult_to_modesty, cruelty_by_husband, importation_of_girls, immoral_traffic, dowry_prohibition, indecent_representation, sati_prevention, total_caw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
		for (const r of cawRecords) insCaw.run(cleanParam(r.state), cleanParam(r.district), cleanParam(r.district_id || null), cleanParam(r.year), cleanParam(r.rape), cleanParam(r.kidnapping_abduction), cleanParam(r.dowry_deaths), cleanParam(r.assault_on_women), cleanParam(r.insult_to_modesty), cleanParam(r.cruelty_by_husband), cleanParam(r.importation_of_girls), cleanParam(r.immoral_traffic), cleanParam(r.dowry_prohibition), cleanParam(r.indecent_representation), cleanParam(r.sati_prevention), cleanParam(r.total_caw));
		const insPs = db.prepare(`
      INSERT INTO police_stations (id, district_id, name, officer_name, officer_rank, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);
		for (const ps of data.policeStations) insPs.run(cleanParam(ps.id), cleanParam(ps.districtId), cleanParam(ps.name), cleanParam(ps.officerInCharge), cleanParam(ps.rank), cleanParam(ps.latitude), cleanParam(ps.longitude));
		const insAcc = db.prepare(`
      INSERT INTO accused (id, name, age, gender, district_id, repeat_offender, modus_operandi, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `);
		for (const a of data.accused) insAcc.run(cleanParam(a.id), cleanParam(a.name), cleanParam(a.age), cleanParam(a.gender), cleanParam(a.districtId), cleanParam(a.repeatOffender), cleanParam(a.modusOperandi), cleanParam(a.status));
		const insVic = db.prepare(`
      INSERT INTO victims (id, name, age, gender, district_id, station_id, vulnerability_score)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);
		for (const v of data.victims) insVic.run(cleanParam(v.id), cleanParam(v.name), cleanParam(v.age), cleanParam(v.gender), cleanParam(v.districtId), cleanParam(v.stationId), cleanParam(v.vulnerabilityScore));
		const insFir = db.prepare(`
      INSERT INTO firs (id, fir_number, case_number, district_id, station_id, crime_head, crime_group, ipc_section, is_caw, severity, crime_status, arrest_status, court_status, accused_id, victim_id, investigating_officer, latitude, longitude, weapon_used, modus_operandi, crime_date, fir_date, year, case_details, annual_record_id, caw_record_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
		for (const f of data.firs) insFir.run(cleanParam(f.id), cleanParam(f.firNumber), cleanParam(f.caseNumber || ""), cleanParam(f.districtId), cleanParam(f.policeStationId), cleanParam(f.crimeHead || "Theft"), cleanParam(f.crimeGroup || "Property Crime"), cleanParam(f.section || ""), cleanParam(f.isCaw), cleanParam(f.severity || "Medium"), cleanParam(f.status || "Registered"), cleanParam("Arrested"), cleanParam("Not Filed"), cleanParam(f.accusedId || null), cleanParam(f.victimId || null), cleanParam(f.officer || ""), cleanParam(f.latitude || 0), cleanParam(f.longitude || 0), cleanParam("No Weapon"), cleanParam(""), cleanParam(f.dateFiled), cleanParam(f.dateFiled), cleanParam(f.year || 2026), cleanParam(f.caseDetails || ""), cleanParam(null), cleanParam(null));
		cachedSqliteDb = db;
		return db;
	} catch (e) {
		console.warn("[Text-to-SQL] SQLite database could not be initialized:", e.message);
		return null;
	}
}
async function executeSql(sql) {
	if (process.env.SUPABASE_SERVICE_ROLE_KEY) try {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const { data, error } = await supabaseAdmin.rpc("execute_sql", { sql_query: sql });
		if (error) throw new Error(error.message);
		return data || [];
	} catch (e) {
		console.warn("[Text-to-SQL] Supabase connection failed, falling back to local SQLite:", e.message);
	}
	const db = await ensureSqliteDb();
	if (!db) return [];
	let sqliteSql = sql.replaceAll(/public\./g, "").replaceAll(/TO_CHAR\(([^,]+),\s*'YYYY-MM'\)/gi, "SUBSTR($1, 1, 7)");
	return db.prepare(sqliteSql).all();
}
function validateSqlQuery(sql) {
	const cleanSql = sql.trim().toLowerCase();
	if (!cleanSql.startsWith("select") && !cleanSql.startsWith("with")) return {
		valid: false,
		error: "Only SELECT queries are allowed. Mutation statements (DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE) are strictly forbidden."
	};
	for (const word of [
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
		"execute"
	]) if (new RegExp(`\\b${word}\\b`, "i").test(cleanSql)) return {
		valid: false,
		error: `Forbidden operation "${word}" detected in query.`
	};
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
		"census_2011"
	];
	const fromJoinMatches = sql.match(/\b(from|join)\s+([a-zA-Z0-9_".]+)/gi);
	if (fromJoinMatches) for (const match of fromJoinMatches) {
		const tableNameRaw = match.split(/\s+/)[1] ?? "";
		const tableName = tableNameRaw.replace(/["`]/g, "").replace(/public\./i, "").toLowerCase().trim();
		if (tableName && !allowedTables.includes(tableName)) return {
			valid: false,
			error: `Unauthorized table reference "${tableNameRaw}" detected.`
		};
	}
	return { valid: true };
}
async function validateSqlQueryLocally(sql) {
	const basic = validateSqlQuery(sql);
	if (!basic.valid) return basic;
	try {
		const db = await ensureSqliteDb();
		if (!db) return { valid: true };
		let sqliteSql = sql.replaceAll(/public\./g, "").replaceAll(/TO_CHAR\(([^,]+),\s*'YYYY-MM'\)/gi, "SUBSTR($1, 1, 7)");
		db.prepare(sqliteSql);
		return { valid: true };
	} catch (e) {
		if (e.message && (e.message.includes("sqlite") || e.message.includes("DatabaseSync") || e.message.includes("load url"))) return { valid: true };
		return {
			valid: false,
			error: `SQL syntax or schema error: ${e.message}`
		};
	}
}
var cachedDynamicSchemaContext = null;
async function fetchDynamicSchemaContext() {
	if (cachedDynamicSchemaContext) return cachedDynamicSchemaContext;
	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return "";
	try {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const colsRes = await supabaseAdmin.rpc("execute_sql", { sql_query: `
        SELECT 
          table_name, 
          column_name, 
          data_type, 
          is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      ` });
		if (colsRes.error) throw new Error(colsRes.error.message);
		const cols = colsRes.data;
		const fksRes = await supabaseAdmin.rpc("execute_sql", { sql_query: `
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
      ` });
		if (fksRes.error) throw new Error(fksRes.error.message);
		const fks = fksRes.data;
		let schemaStr = "### DYNAMICALLY RETRIEVED POSTGRESQL SCHEMA:\n";
		const tablesMap = /* @__PURE__ */ new Map();
		for (const col of cols) {
			if (!tablesMap.has(col.table_name)) tablesMap.set(col.table_name, []);
			tablesMap.get(col.table_name)?.push(col);
		}
		for (const [tableName, columns] of tablesMap.entries()) {
			schemaStr += `\nTable/View: public.${tableName}\n`;
			for (const col of columns) schemaStr += `  - ${col.column_name}: ${col.data_type} (${col.is_nullable === "YES" ? "nullable" : "not null"})\n`;
			const tableFks = fks.filter((fk) => fk.table_name === tableName);
			if (tableFks.length > 0) {
				schemaStr += "  Foreign Keys:\n";
				for (const fk of tableFks) schemaStr += `    - ${fk.column_name} REFERENCES public.${fk.foreign_table_name}(${fk.foreign_column_name})\n`;
			}
		}
		cachedDynamicSchemaContext = schemaStr;
		return schemaStr;
	} catch (e) {
		return "";
	}
}
var COMPLETE_POSTGRESQL_SCHEMA = `
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
var FEW_SHOT_EXAMPLES = `
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
async function generateSqlFromLlm(question, errorMsg = "") {
	const geminiKey = process.env.GEMINI_API_KEY?.trim();
	const openAIKey = process.env.OPENAI_API_KEY?.trim();
	if (!Boolean(geminiKey || openAIKey)) return simulateLlmSqlGeneration(question);
	const fullPrompt = `${await fetchDynamicSchemaContext() || COMPLETE_POSTGRESQL_SCHEMA}\n
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
\n${FEW_SHOT_EXAMPLES}\n${errorMsg ? `\nNOTE: The previous query failed execution with error: "${errorMsg}". Please correct the SQL statement.\n` : ""}\nQuestion: ${question}\nSQL Query:`;
	try {
		let response = await callLlm(fullPrompt);
		response = response.trim();
		if (response.startsWith("```")) response = response.replace(/^```sql\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();
		if (!response) throw new Error("Empty response from LLM");
		return response;
	} catch (e) {
		return simulateLlmSqlGeneration(question);
	}
}
function simulateLlmSqlGeneration(question) {
	const q = question.toLowerCase().trim();
	const district = detectDistrict(q);
	const isTop = [
		"top",
		"highest",
		"most",
		"worst"
	].some((kw) => q.includes(kw));
	const isCount = !isTop && [
		"how many",
		"count",
		"total number of",
		"number of crimes",
		"number of cases"
	].some((kw) => q.includes(kw));
	const isAvg = ["average", "avg"].some((kw) => q.includes(kw));
	const isTrend = [
		"trend",
		"monthly",
		"by month",
		"over time"
	].some((kw) => q.includes(kw));
	const isCaw = [
		"women",
		"rape",
		"dowry",
		"domestic",
		"cruelty",
		"assault on women",
		"caw"
	].some((kw) => q.includes(kw));
	const isIpc = [
		"ipc",
		"section",
		"sections"
	].some((kw) => q.includes(kw));
	const isHotspot = [
		"hotspot",
		"hotspots",
		"heat",
		"clusters"
	].some((kw) => q.includes(kw));
	const isLatest = [
		"latest",
		"recent",
		"newest",
		"last"
	].some((kw) => q.includes(kw));
	const crimeHeads = [
		"robbery",
		"theft",
		"murder",
		"cheating",
		"assault",
		"burglary",
		"narcotics"
	];
	let crimeHead = "";
	for (const ch of crimeHeads) if (q.includes(ch)) {
		crimeHead = ch;
		break;
	}
	let year = "";
	const yearMatch = q.match(/\b(20\d{2})\b/);
	if (yearMatch) year = yearMatch[1];
	if (q.includes("literacy rate")) return `SELECT name, literacy_rate, population FROM public.districts /* census_2011 */ WHERE LOWER(name) = '${district || "dharwad"}';`;
	if (q.includes("open cases") || q.includes("open firs")) return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.crime_status) = 'open' /* status='Open' */${district ? ` AND LOWER(d.name) = '${district}' /* district='${district}' */` : ""} LIMIT 20;`;
	if (isTop) {
		const limitMatch = q.match(/\btop\s+(\d+)/);
		const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
		if (isIpc) return `SELECT ipc_section, COUNT(*) AS section_count FROM public.firs WHERE ipc_section IS NOT NULL AND ipc_section <> '' GROUP BY ipc_section ORDER BY section_count DESC LIMIT ${limit};`;
		if (isCaw) return `SELECT district_name, SUM(total_caw) AS total_caw FROM public.v_caw_summary GROUP BY district_name ORDER BY total_caw DESC LIMIT ${limit};`;
		return `SELECT district_name, SUM(total_cases) AS total FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total DESC LIMIT ${limit};`;
	}
	if (isAvg) return `SELECT AVG(total_cases) AS average_crimes FROM public.v_district_crime_totals;`;
	if (isCount) {
		if (isCaw) return `SELECT SUM(total_caw) AS total_caw FROM public.v_caw_summary${district ? ` WHERE LOWER(district_name) = '${district}' /* district='${district}' */` : ""};`;
		const whereParts = [];
		if (district) whereParts.push(`LOWER(d.name) = '${district}' /* district='${district}' */`);
		if (crimeHead) whereParts.push(`LOWER(f.crime_head) LIKE '%${crimeHead}%'`);
		if (year) whereParts.push(`f.year = ${year}`);
		return `SELECT COUNT(*) AS total_crimes FROM public.firs f JOIN public.districts d ON f.district_id = d.id${whereParts.length > 0 ? ` WHERE ${whereParts.join(" AND ")}` : ""};`;
	}
	if (crimeHead) {
		const whereDistrict = district ? ` AND LOWER(d.name) = '${district}' /* district='${district}' */` : "";
		return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(f.crime_head) LIKE '%${crimeHead}%'${whereDistrict} ORDER BY f.fir_date DESC LIMIT 15;`;
	}
	if (isTrend) {
		if (district) return `SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = '${district}' /* district='${district}' */ GROUP BY month ORDER BY month;`;
		return `SELECT TO_CHAR(f.crime_date, 'YYYY-MM') AS month, COUNT(*) AS crime_count FROM public.firs f GROUP BY month ORDER BY month;`;
	}
	if (isCaw) return `SELECT district_name, year, rape, dowry_deaths, cruelty_by_husband, assault_on_women, total_caw FROM public.v_caw_summary${district ? ` WHERE LOWER(district_name) = '${district}' /* district='${district}' */` : ""} ORDER BY year DESC;`;
	if (isIpc) return `SELECT ipc_section, COUNT(*) AS section_count FROM public.firs WHERE ipc_section IS NOT NULL AND ipc_section <> '' GROUP BY ipc_section ORDER BY section_count DESC LIMIT 10;`;
	if (isHotspot) return `SELECT d.name AS district_name, d.hotspot_count FROM public.districts d ORDER BY d.hotspot_count DESC LIMIT 10;`;
	if (isLatest || q.includes("fir")) return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, f.fir_date, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id${district ? ` WHERE LOWER(d.name) = '${district}' /* district='${district}' */` : ""} ORDER BY f.fir_date DESC LIMIT 15;`;
	if (q.includes("district") || q.includes("by district")) return `SELECT district_name, SUM(total_cases) AS total_cases, SUM(total_arrested) AS total_arrested, SUM(total_convicted) AS total_convicted FROM public.v_district_crime_totals GROUP BY district_name ORDER BY total_cases DESC;`;
	if (district) return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id WHERE LOWER(d.name) = '${district}' /* district='${district}' */ LIMIT 15;`;
	return `SELECT f.fir_number, f.crime_head, f.ipc_section, f.severity, f.crime_status, d.name AS district_name FROM public.firs f JOIN public.districts d ON f.district_id = d.id ORDER BY f.fir_date DESC LIMIT 15;`;
}
async function executeTextToSql(normalisedQuery, intent) {
	let attempts = 0;
	let sql = "";
	let errorMsg = "";
	while (attempts < 2) try {
		sql = await generateSqlFromLlm(normalisedQuery, errorMsg);
		if (!sql) throw new Error("Failed to generate SQL query.");
		const validation = await validateSqlQueryLocally(sql);
		if (!validation.valid) throw new Error(validation.error);
		const startTime = performance.now();
		const rows = await executeSql(sql);
		const endTime = performance.now();
		const executionTimeMs = Math.round(endTime - startTime);
		const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
		const isCaw = sql.toLowerCase().includes("crimes_against_women") || sql.toLowerCase().includes("v_caw_summary") || intent === "caw";
		return {
			queryDescription: sql,
			rows,
			totalCount: rows.length,
			columns,
			isCaw,
			executionTimeMs,
			rowsReturned: rows.length
		};
	} catch (e) {
		errorMsg = e.message;
		attempts++;
		console.warn(`[Text-to-SQL] Validation Loop (attempt ${attempts}/2) failed: ${errorMsg}`);
	}
	return {
		queryDescription: sql || "SELECT * FROM public.firs LIMIT 0;",
		rows: [],
		totalCount: 0,
		columns: [],
		error: `SQL execution error: ${errorMsg}`,
		executionTimeMs: 0,
		rowsReturned: 0
	};
}
/**
* MODULE: RAG — Retrieval-Augmented Generation (Workflow Step 4b & 5)
*
* Document corpus now includes:
*   1. FIR case narratives (general crimes)
*   2. CAW district summaries (Crimes Against Women 2001-2021)
*   3. NCRB-style annual report excerpts per district
*/
var cachedCorpus = null;
function clearRagCache() {
	cachedCorpus = null;
}
function buildCorpus() {
	if (cachedCorpus) return cachedCorpus;
	const docs = [];
	const { firs, crimes, districts } = getData();
	for (const fir of firs) docs.push({
		source: fir.firNumber,
		content: `FIR ${fir.firNumber} filed on ${fir.dateFiled.slice(0, 10)} at ${fir.policeStationName}, ${fir.districtName}. Officer: ${fir.officer}. Section: ${fir.section}. Status: ${fir.status}. Details: ${fir.caseDetails}`
	});
	for (const crime of crimes) docs.push({
		source: crime.caseNumber,
		content: `Case ${crime.caseNumber}: ${crime.title}. Category: ${crime.category} (${crime.crimeType}). Severity: ${crime.severity}. Status: ${crime.status}. Accused: ${crime.accusedName}. Victim: ${crime.victimName}. MO: ${crime.modusOperandi}. Officer: ${crime.investigationOfficer}. Weapon: ${crime.weapon}.`
	});
	const latestYear = getLatestCawYear();
	const cawRecords = getCawRecords().filter((r) => r.year >= 2015);
	for (const r of cawRecords) docs.push({
		source: `CAW-${r.district}-${r.year}`,
		content: `Crimes Against Women report for ${r.district} district, Karnataka, year ${r.year}. Total CAW cases: ${r.total_caw}. Rape: ${r.rape} cases. Kidnapping and abduction of women: ${r.kidnapping_abduction} cases. Dowry deaths: ${r.dowry_deaths} cases. Assault on women with intent to outrage modesty: ${r.assault_on_women} cases. Insult to modesty of women: ${r.insult_to_modesty} cases. Cruelty by husband or his relatives (domestic violence): ${r.cruelty_by_husband} cases. Immoral trafficking: ${r.immoral_traffic} cases. Dowry prohibition act violations: ${r.dowry_prohibition} cases. Source: NCRB Crimes Against Women dataset 2001-2021.`
	});
	const stateTotals = getCawStateTotals(latestYear);
	docs.push({
		source: `CAW-Karnataka-${latestYear}-StateSummary`,
		content: `Karnataka State Crimes Against Women Summary for ${latestYear}. Total CAW cases across all 31 districts: ${stateTotals.total_caw.toLocaleString()}. Rape cases: ${stateTotals.rape.toLocaleString()}. Dowry deaths: ${stateTotals.dowry_deaths.toLocaleString()}. Cruelty by husband (domestic violence): ${stateTotals.cruelty_by_husband.toLocaleString()}. Assault on women: ${stateTotals.assault_on_women.toLocaleString()}. Kidnapping and abduction: ${stateTotals.kidnapping_abduction.toLocaleString()}. Top affected districts: ${getTopCawDistricts(latestYear, 5).map((d) => d.district).join(", ")}. Source: NCRB Crimes Against Women in India 2001-2021 dataset.`
	});
	for (const dist of districts) docs.push({
		source: `Census-${dist.name}-2011`,
		content: `Census 2011 Demographic profile for ${dist.name} district, Karnataka. Total population: ${dist.population.toLocaleString()}. Area: ${dist.areaSqKm.toLocaleString()} sq km. Population density: ${dist.density} per sq km. Literacy rate: ${dist.literacyRate}%. Gender ratio (sex ratio): ${dist.genderRatio} females per 1,000 males. Total police stations: ${dist.policeStationCount}. Source: Indian Census 2011.`
	});
	const annualRecords = getCrimeIndiaAnnualRecords(districts).filter((r) => r.year >= 2017);
	for (const r of annualRecords) docs.push({
		source: `Annual-${r.district}-${r.year}-${r.crime_head}`,
		content: `NCRB Crime in India annual statistics for ${r.district} district, Karnataka, year ${r.year}. Crime head: ${r.crime_head} (${r.crime_group}). Cases reported: ${r.cases_reported}. Cases chargesheeted: ${r.cases_reported}. Cases convicted: ${r.cases_convicted}. Cases acquitted: ${r.cases_acquitted}. Persons arrested: ${r.persons_arrested}. Persons convicted: ${r.persons_convicted}. Source: NCRB Crime in India (2001 onwards) dataset.`
	});
	cachedCorpus = docs;
	return docs;
}
function similarityScore(content, query) {
	const stopWords = /* @__PURE__ */ new Set([
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
		"these"
	]);
	const queryWords = query.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !stopWords.has(w));
	if (queryWords.length === 0) return 0;
	const contentLower = content.toLowerCase();
	return queryWords.filter((w) => contentLower.includes(w)).length / queryWords.length;
}
function retrieveFromRag(normalisedQuery, topK = 5) {
	const corpus = buildCorpus();
	const scored = corpus.map((doc) => ({
		source: doc.source,
		content: doc.content,
		score: similarityScore(doc.content, normalisedQuery)
	})).filter((doc) => doc.score > 0).sort((a, b) => b.score - a.score).slice(0, topK);
	if (scored.length === 0) return {
		chunks: corpus.filter((d) => d.source.includes("StateSummary") || d.source.startsWith("FIR")).slice(0, topK).map((doc) => ({
			source: doc.source,
			content: doc.content,
			score: .1
		})),
		documentsSearched: corpus.length
	};
	return {
		chunks: scored,
		documentsSearched: corpus.length
	};
}
/**
* MODULE: Analysis Engine (Workflow Step 6 & 7)
*
* Supports five analysis types:
*   - trend      : Monthly crime trend + year-over-year
*   - hotspot    : Geographic crime cluster detection
*   - network    : Criminal relationship / co-offending network
*   - prediction : Linear-regression-based forecast
*   - caw        : Crimes Against Women deep analysis (NEW)
*/
function analyseCaw(normalisedQuery) {
	const latestYear = getLatestCawYear();
	const stateTotals = getCawStateTotals(latestYear);
	const topDistricts = getTopCawDistricts(latestYear, 10);
	const coords = getDistrictCoords();
	getCawTrend("total_caw");
	let focusCategory = "total_caw";
	let focusLabel = "Total Crimes Against Women";
	if (normalisedQuery.includes("rape")) {
		focusCategory = "rape";
		focusLabel = "Rape";
	} else if (normalisedQuery.includes("dowry")) {
		focusCategory = "dowry_deaths";
		focusLabel = "Dowry Deaths";
	} else if (normalisedQuery.includes("cruelty") || normalisedQuery.includes("domestic") || normalisedQuery.includes("husband")) {
		focusCategory = "cruelty_by_husband";
		focusLabel = "Cruelty by Husband / Domestic Violence";
	} else if (normalisedQuery.includes("kidnap") || normalisedQuery.includes("abduction") || normalisedQuery.includes("trafficking")) {
		focusCategory = "kidnapping_abduction";
		focusLabel = "Kidnapping & Abduction";
	} else if (normalisedQuery.includes("assault") || normalisedQuery.includes("molestation")) {
		focusCategory = "assault_on_women";
		focusLabel = "Assault on Women";
	}
	const focusTrend = getCawTrend(focusCategory);
	const cawBreakdown = [
		{
			category: "Rape",
			count: stateTotals.rape
		},
		{
			category: "Kidnapping & Abduction",
			count: stateTotals.kidnapping_abduction
		},
		{
			category: "Dowry Deaths",
			count: stateTotals.dowry_deaths
		},
		{
			category: "Assault on Women",
			count: stateTotals.assault_on_women
		},
		{
			category: "Insult to Modesty",
			count: stateTotals.insult_to_modesty
		},
		{
			category: "Cruelty by Husband",
			count: stateTotals.cruelty_by_husband
		},
		{
			category: "Immoral Trafficking",
			count: stateTotals.immoral_traffic
		},
		{
			category: "Dowry Prohibition",
			count: stateTotals.dowry_prohibition
		}
	].sort((a, b) => b.count - a.count);
	const cawHotspots = topDistricts.map((d) => ({
		district: d.district,
		lat: coords[d.district]?.lat ?? 15,
		lng: coords[d.district]?.lng ?? 75.5,
		total_caw: d.total_caw,
		score: Math.min(99, Math.round(d.total_caw / stateTotals.total_caw * 100 * topDistricts.length * .8))
	}));
	const prev = getCawStateTotals(latestYear - 1);
	const yoyChange = stateTotals.total_caw - prev.total_caw;
	const yoyPct = Math.round(yoyChange / prev.total_caw * 100);
	const direction = yoyChange > 0 ? "increased" : "decreased";
	const topDistrict = topDistricts[0];
	const focusValue = stateTotals[focusCategory] ?? stateTotals.total_caw;
	return {
		type: "caw",
		insight: `Crimes Against Women in Karnataka (${latestYear}): Total ${stateTotals.total_caw.toLocaleString()} cases reported across 31 districts. ${focusLabel}: ${focusValue.toLocaleString()} cases. Cruelty by husband / domestic violence is the highest category with ${stateTotals.cruelty_by_husband.toLocaleString()} cases. Rape cases: ${stateTotals.rape.toLocaleString()}. Dowry deaths: ${stateTotals.dowry_deaths.toLocaleString()}. Assault on women: ${stateTotals.assault_on_women.toLocaleString()}. Top affected district: ${topDistrict.district} with ${topDistrict.total_caw.toLocaleString()} total CAW cases. Year-over-year: CAW cases ${direction} by ${Math.abs(yoyPct)}% compared to ${latestYear - 1}. Source: NCRB Crimes Against Women in India 2001–2021 dataset.`,
		chartData: focusTrend,
		cawBreakdown,
		cawHotspots,
		metrics: {
			totalCaw: stateTotals.total_caw.toLocaleString(),
			rape: stateTotals.rape.toLocaleString(),
			dowryDeaths: stateTotals.dowry_deaths.toLocaleString(),
			crueltyByHusband: stateTotals.cruelty_by_husband.toLocaleString(),
			assaultOnWomen: stateTotals.assault_on_women.toLocaleString(),
			kidnapping: stateTotals.kidnapping_abduction.toLocaleString(),
			topDistrict: topDistrict.district,
			year: latestYear,
			yoyChange: `${yoyChange > 0 ? "+" : ""}${yoyPct}%`
		}
	};
}
function analyseTrend() {
	const analytics = getAnalyticsSummary();
	const latest = analytics.predictionGraph.slice(-3);
	const avgObserved = Math.round(latest.reduce((s, p) => s + p.observed, 0) / latest.length);
	const avgProjected = Math.round(latest.reduce((s, p) => s + p.projected, 0) / latest.length);
	return {
		type: "trend",
		insight: `Crime activity is trending ${avgProjected > avgObserved ? "upward" : "downward"}. Average observed crimes over the last 3 months: ${avgObserved}. Projected average: ${avgProjected}. Top category: ${analytics.pieSeries[0]?.name ?? "N/A"} with ${analytics.pieSeries[0]?.value ?? 0} incidents.`,
		chartData: analytics.predictionGraph,
		metrics: {
			avgObserved,
			avgProjected,
			topCategory: analytics.pieSeries[0]?.name ?? "N/A",
			yearlyGrowth: `${analytics.yearlyTrend.length > 1 ? Math.round((analytics.yearlyTrend.at(-1).crimes - analytics.yearlyTrend.at(-2).crimes) / analytics.yearlyTrend.at(-2).crimes * 100) : 0}%`
		}
	};
}
function analyseHotspots() {
	const districts = getDistrictSummaries();
	const dashboard = getDashboardSummary();
	const totalCrimes = districts.reduce((s, d) => s + d.crimeCount, 0);
	const hotspots = districts.map((d) => ({
		district: d.name,
		lat: d.latitude,
		lng: d.longitude,
		crimeCount: d.crimeCount,
		score: Math.min(99, Math.round(d.crimeCount / totalCrimes * 100 * districts.length * .6 + d.hotspotCount * 1.5))
	})).sort((a, b) => b.score - a.score).slice(0, 10);
	const top = hotspots[0];
	return {
		type: "hotspot",
		insight: `Hotspot analysis identified ${hotspots.length} high-risk zones. Highest-risk district: ${top.district} (score: ${top.score}) with ${top.crimeCount} crimes. Heatmap covers ${dashboard.heatmapPoints.length} geo-tagged incidents.`,
		chartData: hotspots,
		metrics: {
			topDistrict: top.district,
			topScore: top.score,
			hotspotsCovered: hotspots.length,
			heatmapPoints: dashboard.heatmapPoints.length
		}
	};
}
function analyseNetwork() {
	const network = getNetworkGraphSummary();
	const topCriminal = network.nodes.filter((n) => n.type === "criminal")[0];
	return {
		type: "network",
		insight: `Criminal network analysis found ${network.nodes.length} entities and ${network.edges.length} relationships. Top connected entity: ${topCriminal?.label ?? "N/A"}. Repeat offenders: ${network.highlights.find((h) => h.label === "Repeat offenders")?.value ?? 0}.`,
		networkData: {
			nodes: network.nodes,
			edges: network.edges
		},
		metrics: {
			totalNodes: network.nodes.length,
			totalEdges: network.edges.length,
			repeatOffenders: network.highlights.find((h) => h.label === "Repeat offenders")?.value ?? 0,
			topEntity: topCriminal?.label ?? "N/A"
		}
	};
}
/**
* Fits a simple linear regression (OLS) on the given (x, y) pairs.
* Returns intercept and slope.
*/
function fitLinearRegression(y) {
	const n = y.length;
	if (n < 2) return {
		slope: 0,
		intercept: y[0] ?? 0
	};
	const xMean = (n - 1) / 2;
	const yMean = y.reduce((s, v) => s + v, 0) / n;
	const slope = y.reduce((s, v, i) => s + (i - xMean) * (v - yMean), 0) / y.reduce((s, _, i) => s + (i - xMean) ** 2, 0);
	return {
		slope,
		intercept: yMean - slope * xMean
	};
}
/**
* Evaluates a fitted model on test data and returns MAE, RMSE, R², MAPE.
* predicted[i] = intercept + slope * (trainSize + i)
*/
function evaluateModel(testY, slope, intercept, trainSize) {
	const n = testY.length;
	const predicted = testY.map((_, i) => intercept + slope * (trainSize + i));
	const mae = predicted.reduce((s, p, i) => s + Math.abs(p - testY[i]), 0) / n;
	const mse = predicted.reduce((s, p, i) => s + (p - testY[i]) ** 2, 0) / n;
	const rmse = Math.sqrt(mse);
	const yMean = testY.reduce((s, v) => s + v, 0) / n;
	const ssTot = testY.reduce((s, v) => s + (v - yMean) ** 2, 0);
	const ssRes = predicted.reduce((s, p, i) => s + (p - testY[i]) ** 2, 0);
	const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
	const mape = predicted.reduce((s, p, i) => s + (testY[i] === 0 ? 0 : Math.abs((p - testY[i]) / testY[i])), 0) / n * 100;
	return {
		trainSize,
		testSize: n,
		mae: Math.round(mae * 100) / 100,
		rmse: Math.round(rmse * 100) / 100,
		r2: Math.round(r2 * 1e3) / 1e3,
		mape: Math.round(mape * 100) / 100
	};
}
function analysePrediction() {
	const analytics = getAnalyticsSummary();
	const series = analytics.predictionGraph;
	const splitIdx = Math.floor(series.length * .8);
	const trainY = series.slice(0, splitIdx).map((p) => p.observed);
	const testY = series.slice(splitIdx).map((p) => p.observed);
	const { slope, intercept } = fitLinearRegression(trainY);
	const validation = evaluateModel(testY, slope, intercept, splitIdx);
	const nextMonthProjection = Math.round(intercept + slope * series.length);
	const direction = slope > 0 ? "increasing" : "decreasing";
	const extended = [
		...series,
		{
			month: "M+1",
			observed: 0,
			projected: nextMonthProjection
		},
		{
			month: "M+2",
			observed: 0,
			projected: Math.round(intercept + slope * (series.length + 1))
		},
		{
			month: "M+3",
			observed: 0,
			projected: Math.round(intercept + slope * (series.length + 2))
		}
	];
	return {
		type: "prediction",
		insight: `Predictive model (linear regression, 80/20 split) shows crime counts are ${direction} at ${Math.abs(Math.round(slope))} crimes/month. Next month projection: ${nextMonthProjection} crimes. Model accuracy — MAE: ${validation.mae}, RMSE: ${validation.rmse}, R²: ${validation.r2}. Top risk districts: ${analytics.riskScores.slice(0, 3).map((r) => r.district).join(", ")}.`,
		chartData: extended,
		validation,
		metrics: {
			slope: Math.round(slope),
			intercept: Math.round(intercept),
			nextMonthProjection,
			direction,
			trainSamples: validation.trainSize,
			testSamples: validation.testSize,
			mae: validation.mae,
			rmse: validation.rmse,
			r2: validation.r2,
			mape: `${validation.mape}%`,
			topRiskDistrict: analytics.riskScores[0]?.district ?? "N/A"
		}
	};
}
function analyseCorrelation(normalisedQuery) {
	const districts = getData().districts;
	let xLabel = "Population Density (per sq km)";
	let yLabel = "Hotspot Count";
	let xVal = (d) => d.density;
	let yVal = (d) => d.hotspotCount;
	if (normalisedQuery.includes("literacy")) {
		xLabel = "Literacy Rate (%)";
		yLabel = "Crime Rate (per 1,000 population)";
		xVal = (d) => d.literacyRate;
		yVal = (d) => Math.round(d.crimeCount / d.population * 1e3 * 10) / 10;
	} else if (normalisedQuery.includes("gender") || normalisedQuery.includes("sex") || normalisedQuery.includes("women") || normalisedQuery.includes("ratio")) {
		xLabel = "Gender Ratio (Females per 1,000 Males)";
		yLabel = "Crimes Against Women (CAW)";
		xVal = (d) => d.genderRatio;
		const cawRecords = getCawRecords();
		yVal = (d) => {
			const rec = cawRecords.find((r) => r.district.toLowerCase() === d.name.toLowerCase() && r.year === 2021);
			return rec ? rec.total_caw : 0;
		};
	}
	const correlation = pearsonCorrelation(districts.map(xVal), districts.map(yVal));
	const chartData = districts.map((d) => ({
		district: d.name,
		xValue: xVal(d),
		yValue: yVal(d)
	}));
	const direction = correlation > 0 ? "positive" : "negative";
	const strength = Math.abs(correlation) > .7 ? "strong" : Math.abs(correlation) > .4 ? "moderate" : "weak";
	return {
		type: "correlation",
		insight: `Demographic correlation analysis reveals a ${strength} ${direction} correlation (Pearson r = ${correlation.toFixed(3)}) between ${xLabel} and ${yLabel} across the 31 districts of Karnataka.`,
		chartData,
		metrics: {
			correlation: correlation.toFixed(3),
			strength,
			direction,
			xLabel,
			yLabel
		}
	};
}
function pearsonCorrelation(X, Y) {
	const n = X.length;
	if (n === 0) return 0;
	const xMean = X.reduce((s, v) => s + v, 0) / n;
	const yMean = Y.reduce((s, v) => s + v, 0) / n;
	const num = X.reduce((s, x, i) => s + (x - xMean) * (Y[i] - yMean), 0);
	const denX = X.reduce((s, x) => s + (x - xMean) ** 2, 0);
	const denY = Y.reduce((s, y) => s + (y - yMean) ** 2, 0);
	if (denX === 0 || denY === 0) return 0;
	return num / Math.sqrt(denX * denY);
}
function runAnalysis(type, normalisedQuery = "") {
	switch (type) {
		case "caw": return analyseCaw(normalisedQuery);
		case "hotspot": return analyseHotspots();
		case "network": return analyseNetwork();
		case "prediction": return analysePrediction();
		case "correlation": return analyseCorrelation(normalisedQuery);
		default: return analyseTrend();
	}
}
/**
* Calculates dynamic risk scores (0-100) for all districts.
* Based on crime frequency, monthly trends, repeat offender presence, and case severity.
*/
function calculateDistrictRiskScores(districts, crimes) {
	const maxCrimes = Math.max(...districts.map((d) => d.crimeCount), 1);
	return districts.map((district) => {
		const districtCrimes = crimes.filter((c) => c.districtId === district.id);
		const totalCrimes = districtCrimes.length;
		const freqScore = district.crimeCount / maxCrimes * 40;
		const trend = district.trend ?? [];
		let trendScore = 10;
		let trendPctChange = 0;
		if (trend.length >= 6) {
			const last3 = trend.slice(-3);
			const prev3 = trend.slice(-6, -3);
			const avgLast3 = last3.reduce((s, v) => s + v, 0) / 3;
			const avgPrev3 = prev3.reduce((s, v) => s + v, 0) / 3;
			trendPctChange = avgPrev3 > 0 ? (avgLast3 - avgPrev3) / avgPrev3 : 0;
			trendScore = Math.max(0, Math.min(20, (trendPctChange + .5) * 20));
		}
		const repeatOffendersCount = districtCrimes.filter((c) => c.repeatOffender).length;
		const repeatRatio = totalCrimes > 0 ? repeatOffendersCount / totalCrimes : 0;
		const repeatScore = Math.max(0, Math.min(20, repeatRatio * 60));
		const criticalOrHighCount = districtCrimes.filter((c) => c.severity === "Critical" || c.severity === "High").length;
		const severityRatio = totalCrimes > 0 ? criticalOrHighCount / totalCrimes : 0;
		const severityScore = Math.max(0, Math.min(20, severityRatio * 40));
		const score = Math.max(0, Math.min(100, Math.round(freqScore + trendScore + repeatScore + severityScore)));
		let level = "Medium";
		if (score >= 70) level = "High";
		else if (score < 40) level = "Low";
		const reasons = [];
		if (freqScore >= 25) reasons.push("High baseline crime frequency");
		if (trendPctChange >= .15) reasons.push(`Recent crime spike (+${Math.round(trendPctChange * 100)}%)`);
		if (repeatScore >= 14) reasons.push("Elevated volume of active repeat offenders");
		if (severityScore >= 14) reasons.push("High proportion of critical/high-severity cases");
		if (reasons.length === 0) reasons.push("Stable crime frequency and severity profiles");
		return {
			districtId: district.id,
			district: district.name,
			score,
			level,
			reasons,
			metrics: {
				frequencyScore: Math.round(freqScore * 10) / 10,
				trendScore: Math.round(trendScore * 10) / 10,
				repeatOffenderScore: Math.round(repeatScore * 10) / 10,
				severityScore: Math.round(severityScore * 10) / 10
			}
		};
	});
}
/**
* Computes Jaccard word similarity between two strings.
*/
function jaccardSimilarity(str1, str2) {
	const stopWords = /* @__PURE__ */ new Set([
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
		"pattern"
	]);
	const tokenize = (str) => str.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !stopWords.has(w));
	const words1 = new Set(tokenize(str1));
	const words2 = new Set(tokenize(str2));
	if (words1.size === 0 || words2.size === 0) return 0;
	let intersectionCount = 0;
	for (const w of words1) if (words2.has(w)) intersectionCount++;
	const unionSize = words1.size + words2.size - intersectionCount;
	return unionSize > 0 ? intersectionCount / unionSize : 0;
}
/**
* Finds similar cases for a given target case ID or case number.
*/
function findSimilarCases(caseIdOrNumber, topK = 5) {
	const { crimes, firs } = getData();
	const targetCase = crimes.find((c) => c.id === caseIdOrNumber || c.caseNumber.toUpperCase() === caseIdOrNumber.toUpperCase() || c.firId === caseIdOrNumber);
	if (!targetCase) {
		const targetFir = firs.find((f) => f.firNumber.toUpperCase() === caseIdOrNumber.toUpperCase() || f.id === caseIdOrNumber);
		if (targetFir) {
			const match = crimes.find((c) => c.firId === targetFir.id || c.id === targetFir.crimeId);
			if (match) return findSimilarCases(match.id, topK);
		}
		return [];
	}
	const targetDetails = firs.find((f) => f.id === targetCase.firId || f.crimeId === targetCase.id)?.caseDetails ?? "";
	const results = [];
	for (const candidate of crimes) {
		if (candidate.id === targetCase.id) continue;
		const candidateFir = firs.find((f) => f.id === candidate.firId || f.crimeId === candidate.id);
		const candidateDetails = candidateFir?.caseDetails ?? "";
		const matchReasons = [];
		let typeScore = 0;
		if (candidate.crimeType.toLowerCase() === targetCase.crimeType.toLowerCase()) {
			typeScore = 30;
			matchReasons.push(`Same crime type (${candidate.crimeType})`);
		} else if (candidate.category.toLowerCase() === targetCase.category.toLowerCase()) {
			typeScore = 18;
			matchReasons.push(`Same category (${candidate.category})`);
		}
		let locationScore = 0;
		if (candidate.policeStationId === targetCase.policeStationId) {
			locationScore = 20;
			matchReasons.push("Same Police Station jurisdiction");
		} else if (candidate.districtId === targetCase.districtId) {
			locationScore = 14;
			matchReasons.push(`Same district area (${candidate.districtName})`);
		} else {
			const dist = Math.sqrt(Math.pow(candidate.latitude - targetCase.latitude, 2) + Math.pow(candidate.longitude - targetCase.longitude, 2));
			if (dist < .5) {
				locationScore = Math.round((1 - dist / .5) * 10);
				if (locationScore > 0) matchReasons.push("Geographical proximity");
			}
		}
		let moScore = 0;
		const moJaccard = jaccardSimilarity(candidate.modusOperandi, targetCase.modusOperandi);
		if (candidate.modusOperandi.toLowerCase() === targetCase.modusOperandi.toLowerCase()) {
			moScore = 20;
			matchReasons.push("Identical modus operandi");
		} else if (moJaccard > .2) {
			moScore = Math.round(moJaccard * 20);
			matchReasons.push("Similar modus operandi keywords");
		}
		let suspectScore = 0;
		if (candidate.accusedId === targetCase.accusedId && candidate.accusedName !== "Unknown" && targetCase.accusedName !== "Unknown") {
			suspectScore = 15;
			matchReasons.push(`Same accused person (${candidate.accusedName})`);
		} else if (candidate.repeatOffender && targetCase.repeatOffender) {
			suspectScore = 8;
			matchReasons.push("Both involve repeat offenders");
		}
		let keywordScore = 0;
		const detailsJaccard = jaccardSimilarity(candidateDetails, targetDetails);
		if (detailsJaccard > 0) {
			keywordScore = Math.min(15, Math.round(detailsJaccard * 30));
			if (keywordScore >= 5) matchReasons.push("Matching case description keywords");
		}
		const similarityPercentage = Math.min(100, Math.max(0, Math.round(typeScore + locationScore + moScore + suspectScore + keywordScore)));
		if (similarityPercentage > 15) results.push({
			crimeId: candidate.id,
			caseNumber: candidate.caseNumber,
			firNumber: candidateFir?.firNumber ?? "N/A",
			districtName: candidate.districtName,
			category: candidate.category,
			crimeType: candidate.crimeType,
			accusedName: candidate.accusedName,
			modusOperandi: candidate.modusOperandi,
			similarityPercentage,
			matchReasons
		});
	}
	return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage).slice(0, topK);
}
/**
* Generates intelligent investigation recommendations based on the query,
* resolved handledBy module, and the returned database records.
*/
function generateInvestigationRecommendations(question, handledBy, tableRows) {
	const { crimes, accused, districts } = getData();
	const lowerQ = question.toLowerCase();
	let districtName = "";
	for (const d of districts) if (lowerQ.includes(d.name.toLowerCase()) || lowerQ.includes(d.id.toLowerCase())) {
		districtName = d.name;
		break;
	}
	if (!districtName && tableRows && tableRows.length > 0) districtName = tableRows[0].districtName ?? tableRows[0].district ?? "";
	if (!districtName) districtName = "Bengaluru Urban";
	let category = "";
	for (const cat of [
		"violent crime",
		"property crime",
		"economic offence",
		"cyber",
		"narcotics",
		"caw",
		"women"
	]) if (lowerQ.includes(cat)) {
		category = cat;
		break;
	}
	if (!category && tableRows && tableRows.length > 0) category = (tableRows[0].category ?? tableRows[0].crimeType ?? "").toLowerCase();
	let similarCasesStr = "";
	const matchingCases = crimes.filter((c) => {
		if (category && c.category.toLowerCase().includes(category)) return true;
		if (c.districtName.toLowerCase() === districtName.toLowerCase()) return true;
		return false;
	}).slice(0, 2);
	if (matchingCases.length > 0) similarCasesStr = matchingCases.map((c) => `${c.caseNumber} (${c.crimeType} in ${c.districtName})`).join(", ");
	else similarCasesStr = "CASE/K01/000214, CASE/K02/000543";
	let suspectsStr = "";
	const matchingSuspects = accused.filter((a) => {
		if (a.repeatOffender && a.status === "Active") {
			if (districtName) {
				const district = districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
				return district ? a.districtId === district.id : true;
			}
			return true;
		}
		return false;
	}).slice(0, 2);
	if (matchingSuspects.length > 0) suspectsStr = matchingSuspects.map((a) => `${a.name} (Repeat Offender, Active in ${districtName})`).join(", ");
	else suspectsStr = "R. Gowda (Active repeat offender with matching MO), K. Patil (Wanted suspect)";
	let evidenceList = "CCTV footage, local witness statements, mobile cell tower dump logs.";
	let patrolSuggestions = `Increase patrolling intensity near commercial hubs and transit junctions in ${districtName}.`;
	let steps = [
		`Establish chronological timeline using suspect CDR (Call Data Records) files.`,
		`Coordinate with the forensic lab for ballistic/forensic report timelines.`,
		`Deploy automated license plate readers (ALPR) at exit corridors of ${districtName}.`
	];
	if (category.includes("property") || category.includes("theft")) {
		evidenceList = "CCTV footage of nearby junctions, fingerprints from entry points, pawn shop purchase records.";
		patrolSuggestions = `Conduct targeted night patrolling near high-density residential limits and jewelry stores in ${districtName}.`;
		steps = [
			`Distribute suspect warning sheets and pictures to local scrap dealer and gold merchant networks.`,
			`Audit pawn shop transactions in the matching police station limits.`,
			`Correlate alibis of active repeat property offenders with matching MO profiles in the area.`
		];
	} else if (category.includes("cyber") || category.includes("economic") || category.includes("fraud")) {
		evidenceList = "IP access logs, SMTP email headers, bank transaction mirror receipts, mirror copy of digital device.";
		patrolSuggestions = `Establish public cyber vigilance notices and security alerts in technology parks.`;
		steps = [
			`Initiate bank account lien/freeze commands on suspect beneficiary accounts with bank partners.`,
			`Request IP login and account registration logs from the ISP via Section 91 CrPC notice.`,
			`Engage cyber forensic cell analysts to dissect the phishing scripts or suspect malware.`
		];
	} else if (category.includes("caw") || category.includes("women") || category.includes("rape")) {
		evidenceList = "Victim statement under Sec 164 CrPC, medical examination report, social media chat transcripts.";
		patrolSuggestions = `Increase evening foot patrols near educational institutions, parks, and bus terminals in ${districtName}.`;
		steps = [
			`Retrieve and secure all chat histories and call logs between victim and suspect.`,
			`Perform witness alibi cross-checking in the neighborhood of the incident.`,
			`Arrange counseling and legal support via the SCRB women support protection cells.`
		];
	} else if (category.includes("narcotics")) {
		evidenceList = "Field drug kit chemical verification records, certified forensic test report, transit logistics cargo invoices.";
		patrolSuggestions = `Increase surprise vehicle checking operations on inter-district border checkposts in ${districtName}.`;
		steps = [
			`Investigate forward and backward supply chains to trace local buyers and bulk suppliers.`,
			`Examine device CDR lists to identify supplier contact patterns.`,
			`File formal police custody extension for arrested suspects to reveal warehouse locations.`
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
function enrichAssistantResponseWithRecommendations(response, question) {
	if (!response || !response.answer) return response;
	if (response.answer.includes("AI Investigation Recommendations")) return response;
	const recommendations = generateInvestigationRecommendations(question, response.handledBy, response.tableRows);
	return {
		...response,
		answer: response.answer + recommendations
	};
}
function isSqlDebugEnabled() {
	return process.env.SHOW_SQL_DEBUG === "true" || process.env.VITE_SHOW_SQL_DEBUG === "true";
}
function formatDatabaseResult(rows, columns) {
	if (!rows || rows.length === 0) return "*No records found (empty result set).*";
	const cols = columns && columns.length > 0 ? columns : Object.keys(rows[0]);
	if (rows.length > 10) {
		const preview = rows.slice(0, 10);
		return `*Showing first 10 of ${rows.length} rows:*\n\n| ${cols.join(" | ")} |\n| ${cols.map(() => "---").join(" | ")} |\n` + preview.map((row) => {
			return `| ${cols.map((col) => {
				const val = row[col];
				if (val === null || val === void 0) return "NULL";
				if (typeof val === "boolean") return val ? "true" : "false";
				if (typeof val === "object") return JSON.stringify(val);
				return String(val);
			}).join(" | ")} |`;
		}).join("\n");
	}
	let table = `| ${cols.join(" | ")} |\n`;
	table += `| ${cols.map(() => "---").join(" | ")} |\n`;
	for (const row of rows) {
		const rowValues = cols.map((col) => {
			const val = row[col];
			if (val === null || val === void 0) return "NULL";
			if (typeof val === "boolean") return val ? "true" : "false";
			if (typeof val === "object") return JSON.stringify(val);
			return String(val);
		});
		table += `| ${rowValues.join(" | ")} |\n`;
	}
	return table.trim();
}
async function generateExplanation(question, sql, rows) {
	if (!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY)) {
		if (sql.toLowerCase().includes("count")) return "This query counts the records matching your criteria across official police records.";
		if (sql.toLowerCase().includes("group by")) return "This summary aggregates data across categories and districts to compare counts and statistical distribution.";
		if (sql.toLowerCase().includes("join")) return "This result combines information across cases, police stations, and incident ledgers for complete visibility.";
		return "This result lists records matching the requested filters.";
	}
	try {
		const explanation = await callLlm(`You are a Crime Intelligence Assistant.
The user asked: "${question}"
The database returned this result:
${JSON.stringify(rows.slice(0, 5))}

Write a simple, concise natural-language explanation (1-2 sentences max) summarizing what the results mean for an investigator. Do not reference SQL syntax, database queries, code, or internal database table names.
Response:`);
		if (!explanation) return "This summary aggregates incident records matching your search parameters.";
		return explanation.trim();
	} catch (e) {
		return "This query retrieves records matching the specified filters.";
	}
}
async function generateSqlResponse(result, question) {
	const debugMode = isSqlDebugEnabled();
	if (result.error) {
		let finalAnswer = `I encountered an issue retrieving data for your inquiry.`;
		if (debugMode) finalAnswer += `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n**[Developer Mode] Error**\n\`${result.error}\``;
		return {
			answer: finalAnswer,
			confidence: .5,
			citations: ["Database system error handler"],
			suggestions: ["Show open cases", "Show crime trends"],
			handledBy: "sql",
			queryDescription: result.queryDescription,
			executionTimeMs: result.executionTimeMs,
			rowsReturned: result.rowsReturned,
			showSqlDebug: debugMode
		};
	}
	if (result.isCaw) {
		const stateRow = result.rows[0] ?? {};
		const topDistricts = result.rows.slice(1, 4);
		const answer = `Crimes Against Women data (Karnataka, ${stateRow.year ?? "latest year"}): Total CAW cases: ${Number(stateRow.total_caw ?? 0).toLocaleString()}. ` + (stateRow.rape ? `Rape: ${Number(stateRow.rape).toLocaleString()}. ` : "") + (stateRow.dowry_deaths ? `Dowry deaths: ${Number(stateRow.dowry_deaths).toLocaleString()}. ` : "") + (stateRow.cruelty_by_husband ? `Cruelty by husband (domestic violence): ${Number(stateRow.cruelty_by_husband).toLocaleString()}. ` : "") + (stateRow.assault_on_women ? `Assault on women: ${Number(stateRow.assault_on_women).toLocaleString()}. ` : "") + (stateRow.kidnapping_abduction ? `Kidnapping & abduction: ${Number(stateRow.kidnapping_abduction).toLocaleString()}. ` : "") + (topDistricts.length > 0 ? `Top affected districts: ${topDistricts.map((r) => `${r.district} (${Number(r.total_caw ?? 0).toLocaleString()} cases)`).join(", ")}.` : "");
		const explanation = await generateExplanation(question, result.queryDescription, result.rows);
		let finalAnswer = answer;
		if (explanation) finalAnswer += `\n\n${explanation}`;
		if (debugMode) {
			const formattedResult = formatDatabaseResult(result.rows, result.columns);
			finalAnswer += `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n**[Developer Mode] Execution Result**\n${formattedResult}`;
		}
		return {
			answer: finalAnswer,
			confidence: .95,
			citations: ["NCRB Crimes Against Women 2001-2021", "Crimes Against Women Ledger"],
			suggestions: [
				"Show CAW trend over years",
				"Which district has highest rape cases?",
				"Show dowry death statistics",
				"Compare domestic violence by district",
				"Show CAW hotspot map"
			],
			handledBy: "caw",
			metrics: {
				totalCaw: Number(stateRow.total_caw ?? 0).toLocaleString(),
				rape: Number(stateRow.rape ?? 0).toLocaleString(),
				dowryDeaths: Number(stateRow.dowry_deaths ?? 0).toLocaleString(),
				cruelty: Number(stateRow.cruelty_by_husband ?? 0).toLocaleString(),
				assault: Number(stateRow.assault_on_women ?? 0).toLocaleString(),
				source: "NCRB CAW Dataset 2001-2021",
				explanation
			},
			tableRows: result.rows,
			tableColumns: result.columns,
			queryDescription: result.queryDescription,
			executionTimeMs: result.executionTimeMs,
			rowsReturned: result.rowsReturned,
			showSqlDebug: debugMode
		};
	}
	const n = result.totalCount;
	const shown = result.rows.length;
	const firstRow = result.rows[0] ?? {};
	let answer = "";
	if ("totalCrimes" in firstRow || "total_crimes" in firstRow) answer = `Found ${Number(firstRow.totalCrimes ?? firstRow.total_crimes ?? 0).toLocaleString()} matching crime record(s).`;
	else if ("totalFirs" in firstRow) answer = `There are ${Number(firstRow.totalFirs).toLocaleString()} FIR records across ${firstRow.districts} districts.`;
	else if ("crimes" in firstRow && "district" in firstRow) answer = `Found ${n} districts. Top 3 by crime count: ${result.rows.slice(0, 3).map((r) => `${r.district} (${r.crimes} crimes)`).join(", ")}.`;
	else if ("name" in firstRow && "value" in firstRow) answer = `Crime category breakdown — ${result.rows.slice(0, 3).map((r) => `${r.name}: ${r.value}`).join(", ")}. Total ${n} categories.`;
	else if ("caseNumber" in firstRow) {
		const top = firstRow;
		answer = `Found ${n.toLocaleString()} matching crime record(s). Top match: ${top.caseNumber} — ${top.title ?? top.category ?? "Incident"} in ${top.districtName ?? top.district}. Status: ${top.status}, Severity: ${top.severity}.`;
		if (shown > 1) answer += ` See the results table below for complete details.`;
	} else if ("fir_number" in firstRow || "firNumber" in firstRow) {
		const top = firstRow;
		const firNum = top.fir_number ?? top.firNumber;
		const distName = top.district_name ?? top.districtName ?? top.district ?? "";
		answer = `Found ${n.toLocaleString()} matching FIR record(s). Latest record: ${firNum}${distName ? ` in ${distName}` : ""}. Status: ${top.crime_status ?? top.status ?? "Registered"}, Section: ${top.ipc_section ?? top.section ?? "N/A"}.`;
		if (shown > 1) answer += ` See the results table below for matching records.`;
	} else answer = `Found ${n.toLocaleString()} matching record(s).`;
	const explanation = await generateExplanation(question, result.queryDescription, result.rows);
	let finalAnswer = answer;
	if (explanation) finalAnswer += `\n\n${explanation}`;
	if (debugMode) {
		const formattedResult = formatDatabaseResult(result.rows, result.columns);
		finalAnswer += `\n\n**[Developer Mode] Generated SQL**\n\`\`\`sql\n${result.queryDescription}\n\`\`\`\n\n**[Developer Mode] Execution Result**\n${formattedResult}`;
	}
	return {
		answer: finalAnswer,
		confidence: .92,
		citations: ["Karnataka Police Crime Database"],
		suggestions: [
			"Show open cases",
			"Show critical crimes",
			"Show repeat offenders",
			"List recent FIRs",
			"Show crimes in Bengaluru Urban",
			"Show crime trends"
		],
		handledBy: "sql",
		metrics: {
			totalRecords: n,
			showing: shown,
			query: result.queryDescription,
			explanation
		},
		tableRows: result.rows,
		tableColumns: result.columns,
		queryDescription: result.queryDescription,
		executionTimeMs: result.executionTimeMs,
		rowsReturned: result.rowsReturned,
		showSqlDebug: debugMode
	};
}
function generateRagResponse(result, question) {
	const topChunk = result.chunks[0];
	const excerpt = topChunk ? topChunk.content.slice(0, 300) + "…" : "No relevant documents found.";
	return {
		answer: `Retrieved ${result.chunks.length} relevant document(s) from ${result.documentsSearched} indexed records.\n\n${excerpt}`,
		confidence: topChunk ? Math.min(.95, topChunk.score + .5) : .4,
		citations: result.chunks.slice(0, 3).map((c) => c.source),
		suggestions: [
			"Show CAW trends",
			"Show crime trends",
			"List recent FIRs",
			"Show hotspots"
		],
		handledBy: "rag",
		metrics: {
			documentsSearched: result.documentsSearched,
			chunksRetrieved: result.chunks.length,
			topSource: topChunk?.source ?? "N/A"
		}
	};
}
function generateAnalysisResponse(result, question) {
	const heatmapPoints = result.type === "caw" && result.cawHotspots ? result.cawHotspots.map((p) => ({
		lat: p.lat,
		lng: p.lng,
		intensity: Math.min(1, p.score / 100),
		district: p.district,
		category: "Crimes Against Women"
	})) : result.type === "hotspot" ? result.chartData?.map((p) => ({
		lat: p.lat,
		lng: p.lng,
		intensity: Math.min(1, p.score / 100),
		district: p.district,
		category: "Hotspot"
	})) : void 0;
	return {
		answer: result.insight,
		confidence: .94,
		citations: result.type === "caw" ? [
			"NCRB Crimes Against Women 2001-2021",
			"Analysis Engine",
			"crimes_against_women table"
		] : [
			"Analysis Engine",
			"/api/analytics",
			"/api/network"
		],
		suggestions: {
			caw: [
				"Show CAW trend over years",
				"Which district has highest rape cases?",
				"Show dowry death statistics",
				"Compare domestic violence by district"
			],
			trend: [
				"Detect hotspots",
				"Predict next month",
				"Show criminal network",
				"Show CAW trends"
			],
			hotspot: [
				"Show crime trends",
				"Predict next month",
				"Show criminal network",
				"Show CAW hotspot map"
			],
			network: [
				"Show crime trends",
				"Detect hotspots",
				"Predict next month",
				"List repeat offenders"
			],
			prediction: [
				"Show crime trends",
				"Detect hotspots",
				"Show criminal network",
				"Show CAW trends"
			]
		}[result.type] ?? [],
		handledBy: result.type === "caw" ? "caw" : "analysis",
		chartData: result.chartData,
		networkData: result.networkData,
		metrics: result.metrics,
		heatmapPoints,
		cawBreakdown: result.cawBreakdown
	};
}
function generateGeneralResponse(question, totalCrimes, totalDistricts) {
	return {
		answer: `The KSP Crime Intelligence platform tracks ${totalCrimes.toLocaleString()} crimes across ${totalDistricts} Karnataka districts. You can ask about: crime trends, hotspot detection, criminal networks, FIR records, predictive insights, or Crimes Against Women (rape, dowry deaths, domestic violence, kidnapping, assault on women).`,
		confidence: .82,
		citations: ["/api/dashboard"],
		suggestions: [
			"Show crimes against women",
			"Which district has highest rape cases?",
			"Show crime trends",
			"Detect hotspots",
			"Predict next month"
		],
		handledBy: "general"
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
var DISTRICT_NAMES = [
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
	"Vijayanagara"
];
var CRIME_CATEGORIES = [
	{
		name: "Property Crime",
		types: [
			"Theft",
			"Burglary",
			"Vehicle Theft",
			"Robbery"
		]
	},
	{
		name: "Violent Crime",
		types: [
			"Assault",
			"Murder",
			"Kidnapping",
			"Domestic Violence"
		]
	},
	{
		name: "Economic Offence",
		types: [
			"Fraud",
			"Forgery",
			"Cheating",
			"Extortion"
		]
	},
	{
		name: "Cyber Crime",
		types: [
			"Phishing",
			"Digital Fraud",
			"Identity Theft",
			"Online Harassment"
		]
	},
	{
		name: "Public Order",
		types: [
			"Rioting",
			"Arson",
			"Illegal Gathering",
			"Threats"
		]
	},
	{
		name: "Organized Crime",
		types: [
			"Narcotics",
			"Smuggling",
			"Gang Assault",
			"Human Trafficking"
		]
	}
];
var WEAPONS = [
	"Knife",
	"Firearm",
	"Blunt Object",
	"Vehicle",
	"Poison",
	"No Weapon",
	"Sharp Weapon",
	"Other"
];
var CRIME_STATUSES = [
	"Open",
	"Under Investigation",
	"Solved",
	"Pending Forensic",
	"Filed In Court"
];
var ARREST_STATUSES = [
	"Not Arrested",
	"Arrested",
	"Wanted",
	"Bail Granted"
];
var COURT_STATUSES = [
	"Not Filed",
	"Charge Sheet Filed",
	"Trial Pending",
	"Convicted",
	"Acquitted"
];
var FIR_STATUSES = [
	"Registered",
	"Investigating",
	"Charge Sheet Filed",
	"Closed"
];
var GENDERS = [
	"Male",
	"Female",
	"Other"
];
var FIRST_NAMES = [
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
	"Zubair"
];
var LAST_NAMES = [
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
	"Yadav"
];
var OFFICER_RANKS = [
	"Constable",
	"Head Constable",
	"ASI",
	"SI",
	"Inspector",
	"DSP",
	"ACP"
];
var MODUS_OPERANDI = [
	"Night-time burglary",
	"Social engineering",
	"Vehicle interception",
	"Crowd diversion",
	"Online impersonation",
	"Chain snatching from traffic",
	"False promise / coercion",
	"Pickup from isolated routes",
	"Coordinated gang attack",
	"Forged document trail"
];
var INVESTIGATION_OFFICERS = [
	"Inspector R. Kumar",
	"Inspector S. Patil",
	"SI M. Gowda",
	"SI A. Khan",
	"Inspector L. Rao",
	"DSP V. Shetty",
	"SI N. Kumar",
	"Inspector P. Naik"
];
var dataset;
function seedRng(seed) {
	let t = seed >>> 0;
	return () => {
		t += 1831565813;
		let r = Math.imul(t ^ t >>> 15, 1 | t);
		r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
		return ((r ^ r >>> 14) >>> 0) / 4294967296;
	};
}
function choice(items, random) {
	return items[Math.floor(random() * items.length)];
}
function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
function formatDate(date) {
	return date.toISOString();
}
function addDays(date, days) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}
function buildDistricts(random) {
	const grid = [
		[15, 75.6],
		[15.6, 76.9],
		[15.2, 74.5],
		[13.3, 77],
		[12.98, 77.59],
		[16.9, 77.5],
		[11.8, 77.2],
		[13.5, 77.6],
		[13.2, 75.8],
		[13.8, 76.5],
		[12.9, 74.85],
		[14.45, 75.9],
		[15.46, 75],
		[15.42, 75.62],
		[13, 76.1],
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
		[15.33, 76.52]
	];
	return DISTRICT_NAMES.map((name, index) => {
		const [latitude, longitude] = grid[index];
		const population = Math.round(7e5 + random() * 11e5 + index * 22e3);
		const crimeCount = Math.round(180 + random() * 220 + index * 4);
		const firCount = Math.round(crimeCount * .52);
		const hotspotCount = Math.max(4, Math.round(random() * 18));
		const policeStationCount = 2 + index % 5;
		const trend = Array.from({ length: 12 }, (_, month) => {
			const base = crimeCount / 12;
			const seasonal = Math.sin(month / 12 * Math.PI * 2) * base * .28;
			return Math.max(5, Math.round(base + seasonal + random() * 12));
		});
		const literacyRate = Math.round((68 + index % 7 * 2.5 + random() * 3) * 10) / 10;
		const genderRatio = Math.round(920 + index % 9 * 12 + random() * 15);
		const areaSqKm = Math.round(1500 + random() * 6500);
		const density = Math.round(population / areaSqKm);
		const boundaryPolygon = [
			[latitude - .15, longitude - .15],
			[latitude - .15, longitude + .15],
			[latitude + .15, longitude + .15],
			[latitude + .15, longitude - .15],
			[latitude - .15, longitude - .15]
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
			boundaryPolygon
		};
	});
}
function buildPoliceStations(districts, random) {
	const stations = [];
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
			latitude: district.latitude + (random() - .5) * .2,
			longitude: district.longitude + (random() - .5) * .2
		});
	}
	return stations;
}
function buildVictims(districts, stations, random) {
	const victims = [];
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
			vulnerabilityScore: Math.floor(20 + random() * 80)
		});
	}
	return victims;
}
function buildAccused(districts, random) {
	const accused = [];
	for (let index = 0; index < 2e3; index += 1) {
		const district = districts[index * 3 % districts.length];
		const repeatOffender = random() > .68;
		accused.push({
			id: `acc-${String(index + 1).padStart(4, "0")}`,
			name: `${choice(FIRST_NAMES, random)} ${choice(LAST_NAMES, random)}`,
			age: Math.floor(18 + random() * 39),
			gender: choice(GENDERS, random),
			districtId: district.id,
			repeatOffender,
			modusOperandi: choice(MODUS_OPERANDI, random),
			status: repeatOffender ? choice([
				"Wanted",
				"Arrested",
				"Charged"
			], random) : choice([
				"Active",
				"Arrested",
				"Charged"
			], random)
		});
	}
	return accused;
}
function buildFirs(districts, stations, random) {
	const firs = [];
	const now = /* @__PURE__ */ new Date();
	for (let index = 0; index < 5e3; index += 1) {
		const district = districts[index * 7 % districts.length];
		const station = stations[index * 5 % stations.length];
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
			section: choice([
				"IPC 302",
				"IPC 376",
				"IPC 420",
				"IPC 379",
				"IT Act 66D",
				"NDPS 20(b)",
				"IPC 354",
				"IPC 307"
			], random)
		});
	}
	return firs;
}
function buildCrimes(districts, stations, victims, accused, firs, random) {
	const crimes = [];
	const now = /* @__PURE__ */ new Date();
	for (let index = 0; index < 1e4; index += 1) {
		const district = districts[index * 11 % districts.length];
		const station = stations[index * 13 % stations.length];
		const category = choice(CRIME_CATEGORIES, random);
		const type = choice(category.types, random);
		const victim = victims[index * 17 % victims.length];
		const accusedPerson = accused[index * 19 % accused.length];
		const fir = firs[index % firs.length];
		const severity = choice([
			"Low",
			"Medium",
			"High",
			"Critical"
		], random);
		const status = choice(CRIME_STATUSES, random);
		const crimeDate = addDays(now, -Math.floor(random() * 1e3));
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
			latitude: district.latitude + (random() - .5) * .3,
			longitude: district.longitude + (random() - .5) * .3,
			weapon: choice(WEAPONS, random),
			investigationOfficer: choice(INVESTIGATION_OFFICERS, random),
			arrestStatus: solved ? choice(["Arrested", "Bail Granted"], random) : choice(ARREST_STATUSES, random),
			courtStatus: solved ? choice([
				"Charge Sheet Filed",
				"Trial Pending",
				"Convicted"
			], random) : choice(COURT_STATUSES, random),
			repeatOffender: accusedPerson.repeatOffender || random() > .88,
			modusOperandi: accusedPerson.modusOperandi,
			victimId: victim.id,
			accusedId: accusedPerson.id,
			victimName: victim.name,
			accusedName: accusedPerson.name,
			createdAt: formatDate(crimeDate),
			updatedAt: formatDate(crimeDate)
		});
	}
	return crimes;
}
function ensureDataset() {
	if (dataset) return dataset;
	const random = seedRng(20260702);
	const districts = buildDistricts(random);
	const policeStations = buildPoliceStations(districts, random);
	const victims = buildVictims(districts, policeStations, random);
	const accused = buildAccused(districts, random);
	const firs = buildFirs(districts, policeStations, random);
	dataset = {
		districts,
		policeStations,
		victims,
		accused,
		crimes: buildCrimes(districts, policeStations, victims, accused, firs, random),
		firs
	};
	return dataset;
}
function getData() {
	return ensureDataset();
}
function monthKey(isoDate) {
	const date = new Date(isoDate);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
	const [year, month] = key.split("-").map(Number);
	return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
		month: "short",
		year: "2-digit"
	});
}
function sortRecords(records, sortBy, sortDir) {
	if (!sortBy) return records;
	const direction = sortDir === "asc" ? 1 : -1;
	return [...records].sort((left, right) => {
		const a = left[sortBy];
		const b = right[sortBy];
		if (typeof a === "number" && typeof b === "number") return (a - b) * direction;
		return String(a ?? "").localeCompare(String(b ?? "")) * direction;
	});
}
function matchesSearch(value, search) {
	return value.toLowerCase().includes(search.toLowerCase());
}
function paginate(records, page = 1, pageSize = 20) {
	const safePage = Math.max(1, page);
	const safePageSize = Math.max(1, pageSize);
	const total = records.length;
	const totalPages = Math.max(1, Math.ceil(total / safePageSize));
	const start = (safePage - 1) * safePageSize;
	return {
		items: records.slice(start, start + safePageSize),
		page: safePage,
		pageSize: safePageSize,
		total,
		totalPages
	};
}
function listCrimes(query = {}) {
	const { crimes } = getData();
	const search = query.search?.trim() ?? "";
	const sorted = sortRecords(crimes.filter((crime) => {
		if (query.district && crime.districtId !== query.district && crime.districtName !== query.district) return false;
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
			crime.status
		].some((value) => matchesSearch(value, search));
	}), query.sortBy, query.sortDir);
	const pageSize = query.pageSize ?? 20;
	return {
		...paginate(sorted, query.page ?? 1, pageSize),
		facets: {
			categories: Array.from(new Set(crimes.map((crime) => crime.category))).sort(),
			statuses: Array.from(new Set(crimes.map((crime) => crime.status))).sort(),
			districts: getData().districts.map((district) => district.name),
			severities: [
				"Low",
				"Medium",
				"High",
				"Critical"
			]
		}
	};
}
function getCrime(id) {
	return getData().crimes.find((crime) => crime.id === id || crime.caseNumber === id || crime.firId === id);
}
function createCrime(input) {
	const data = getData();
	const district = data.districts.find((entry) => entry.id === input.districtId || entry.name === input.districtName) ?? data.districts[0];
	const station = data.policeStations.find((entry) => entry.id === input.policeStationId) ?? data.policeStations[0];
	const victim = data.victims[0];
	const accused = data.accused[0];
	const fir = data.firs[0];
	const nextIndex = data.crimes.length + 1;
	const now = /* @__PURE__ */ new Date();
	const crime = {
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
		severity: input.severity ?? "Medium",
		status: input.status ?? "Open",
		crimeTime: input.crimeTime ?? formatDate(now),
		latitude: input.latitude ?? district.latitude,
		longitude: input.longitude ?? district.longitude,
		weapon: input.weapon ?? "No Weapon",
		investigationOfficer: input.investigationOfficer ?? INVESTIGATION_OFFICERS[0],
		arrestStatus: input.arrestStatus ?? "Not Arrested",
		courtStatus: input.courtStatus ?? "Not Filed",
		repeatOffender: Boolean(input.repeatOffender),
		modusOperandi: input.modusOperandi ?? MODUS_OPERANDI[0],
		victimId: victim.id,
		accusedId: accused.id,
		victimName: victim.name,
		accusedName: accused.name,
		createdAt: formatDate(now),
		updatedAt: formatDate(now)
	};
	data.crimes.unshift(crime);
	clearRagCache();
	return crime;
}
function updateCrime(id, patch) {
	const crime = getCrime(id);
	if (!crime) return void 0;
	Object.assign(crime, patch, { updatedAt: formatDate(/* @__PURE__ */ new Date()) });
	clearRagCache();
	return crime;
}
function deleteCrime(id) {
	const data = getData();
	const index = data.crimes.findIndex((crime) => crime.id === id || crime.caseNumber === id);
	if (index < 0) return false;
	data.crimes.splice(index, 1);
	clearRagCache();
	return true;
}
function listFirs(query = {}) {
	const { firs } = getData();
	const search = query.search?.trim() ?? "";
	return paginate([...firs.filter((fir) => {
		if (query.district && fir.districtId !== query.district && fir.districtName !== query.district) return false;
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
			fir.status
		].some((value) => matchesSearch(value, search));
	})].sort((left, right) => right.dateFiled.localeCompare(left.dateFiled)), query.page ?? 1, query.pageSize ?? 20);
}
function getFir(id) {
	return getData().firs.find((fir) => fir.id === id || fir.firNumber === id || fir.crimeId === id);
}
function updateFir(id, patch) {
	const fir = getFir(id);
	if (!fir) return void 0;
	Object.assign(fir, patch);
	clearRagCache();
	return fir;
}
function deleteFir(id) {
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
		const hotspots = districtCrimes.filter((crime) => crime.severity === "Critical" || crime.repeatOffender).length;
		return {
			...district,
			crimeCount: districtCrimes.length,
			firCount: districtFirs.length,
			hotspotCount: Math.max(district.hotspotCount, hotspots),
			policeStationCount: policeStations.filter((station) => station.districtId === district.id).length
		};
	});
	const riskScores = calculateDistrictRiskScores(mappedDistricts, crimes);
	return mappedDistricts.map((d) => {
		const risk = riskScores.find((r) => r.districtId === d.id);
		return {
			...d,
			riskScore: risk?.score ?? 50,
			riskLevel: risk?.level ?? "Medium",
			riskReasons: risk?.reasons ?? ["Stable risk profile"]
		};
	});
}
function getDashboardSummary() {
	const { crimes, firs, victims, accused, policeStations } = getData();
	const districts = districtCrimeStats();
	const solvedCases = crimes.filter((crime) => crime.status === "Solved" || crime.status === "Filed In Court").length;
	const activeCases = crimes.filter((crime) => crime.status === "Open" || crime.status === "Under Investigation" || crime.status === "Pending Forensic").length;
	const pendingCases = crimes.filter((crime) => crime.status !== "Solved" && crime.status !== "Filed In Court").length;
	const repeatOffenders = crimes.filter((crime) => crime.repeatOffender).length;
	const monthlyBuckets = /* @__PURE__ */ new Map();
	crimes.forEach((crime) => {
		const key = monthKey(crime.crimeTime);
		monthlyBuckets.set(key, {
			crimes: (monthlyBuckets.get(key)?.crimes ?? 0) + 1,
			firs: monthlyBuckets.get(key)?.firs ?? 0
		});
	});
	firs.forEach((fir) => {
		const key = monthKey(fir.dateFiled);
		monthlyBuckets.set(key, {
			crimes: monthlyBuckets.get(key)?.crimes ?? 0,
			firs: (monthlyBuckets.get(key)?.firs ?? 0) + 1
		});
	});
	const monthlyTrends = [...monthlyBuckets.entries()].sort((left, right) => left[0].localeCompare(right[0])).slice(-12).map(([month, value]) => ({
		month: monthLabel(month),
		crimes: value.crimes,
		firs: value.firs
	}));
	const categoryBuckets = /* @__PURE__ */ new Map();
	crimes.forEach((crime) => {
		categoryBuckets.set(crime.category, (categoryBuckets.get(crime.category) ?? 0) + 1);
	});
	const topDistricts = [...districts].sort((left, right) => right.crimeCount - left.crimeCount).slice(0, 10);
	const districtComparison = topDistricts.map((district) => ({
		name: district.name,
		crimes: district.crimeCount,
		firs: district.firCount,
		hotspots: district.hotspotCount
	}));
	const heatmapPoints = crimes.filter((crime) => crime.severity === "High" || crime.severity === "Critical" || crime.repeatOffender).slice(0, 200).map((crime, index) => ({
		lat: crime.latitude,
		lng: crime.longitude,
		intensity: clamp(.4 + index % 12 * .05 + (crime.severity === "Critical" ? .3 : 0), .35, 1),
		district: crime.districtName,
		category: crime.category
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
			accused: accused.length
		},
		crimeRate: Math.round(crimes.length / districts.length * 10) / 10,
		districtComparison,
		monthlyTrends,
		crimeCategories: [...categoryBuckets.entries()].map(([name, value]) => ({
			name,
			value
		})).sort((left, right) => right.value - left.value),
		recentFirs: [...firs].sort((left, right) => right.dateFiled.localeCompare(left.dateFiled)).slice(0, 8),
		topCrimeDistricts: topDistricts.map((district) => ({
			id: district.id,
			name: district.name,
			crimes: district.crimeCount,
			hotspots: district.hotspotCount,
			policeStations: district.policeStationCount,
			riskScore: district.riskScore,
			riskLevel: district.riskLevel,
			riskReasons: district.riskReasons
		})),
		heatmapPoints,
		kpis: [
			{
				label: "Total Crimes",
				value: crimes.length.toLocaleString(),
				hint: "All open and closed crime records"
			},
			{
				label: "Active Cases",
				value: activeCases.toLocaleString(),
				hint: "Open, investigation, and forensic cases"
			},
			{
				label: "Solved Cases",
				value: solvedCases.toLocaleString(),
				hint: "Solved and filed in court"
			},
			{
				label: "Pending Cases",
				value: pendingCases.toLocaleString(),
				hint: "Awaiting closure"
			},
			{
				label: "FIR Records",
				value: firs.length.toLocaleString(),
				hint: "Registered FIRs across Karnataka"
			},
			{
				label: "Repeat Offenders",
				value: repeatOffenders.toLocaleString(),
				hint: "Records flagged as repeat offenders"
			},
			{
				label: "Police Stations",
				value: policeStations.length.toLocaleString(),
				hint: "Active stations in the network"
			},
			{
				label: "Districts",
				value: districts.length.toLocaleString(),
				hint: "Karnataka districts covered"
			}
		]
	};
}
function getDistrictSummaries() {
	return districtCrimeStats();
}
function getAnalyticsSummary() {
	const { crimes } = getData();
	const districts = districtCrimeStats();
	const monthly = /* @__PURE__ */ new Map();
	crimes.forEach((crime) => {
		const key = monthKey(crime.crimeTime);
		const existing = monthly.get(key) ?? {
			crimes: 0,
			firs: 0,
			solved: 0,
			pending: 0
		};
		existing.crimes += 1;
		if (crime.status === "Solved" || crime.status === "Filed In Court") existing.solved += 1;
		else existing.pending += 1;
		monthly.set(key, existing);
	});
	const lastTwelve = [...monthly.entries()].sort((left, right) => left[0].localeCompare(right[0])).slice(-12);
	const yearly = /* @__PURE__ */ new Map();
	crimes.forEach((crime) => {
		const year = new Date(crime.crimeTime).getFullYear();
		const existing = yearly.get(year) ?? {
			crimes: 0,
			solved: 0
		};
		existing.crimes += 1;
		if (crime.status === "Solved" || crime.status === "Filed In Court") existing.solved += 1;
		yearly.set(year, existing);
	});
	const categories = /* @__PURE__ */ new Map();
	const ageBands = /* @__PURE__ */ new Map([
		["Below 18", 0],
		["18-30", 0],
		["31-45", 0],
		["46-60", 0],
		["60+", 0]
	]);
	const genders = /* @__PURE__ */ new Map([
		["Male", 0],
		["Female", 0],
		["Other", 0]
	]);
	crimes.forEach((crime) => {
		categories.set(crime.category, (categories.get(crime.category) ?? 0) + 1);
	});
	getData().victims.forEach((victim) => {
		if (victim.age < 18) ageBands.set("Below 18", (ageBands.get("Below 18") ?? 0) + 1);
		else if (victim.age <= 30) ageBands.set("18-30", (ageBands.get("18-30") ?? 0) + 1);
		else if (victim.age <= 45) ageBands.set("31-45", (ageBands.get("31-45") ?? 0) + 1);
		else if (victim.age <= 60) ageBands.set("46-60", (ageBands.get("46-60") ?? 0) + 1);
		else ageBands.set("60+", (ageBands.get("60+") ?? 0) + 1);
		genders.set(victim.gender, (genders.get(victim.gender) ?? 0) + 1);
	});
	const predictionGraph = lastTwelve.map(([month, value]) => ({
		month: monthLabel(month),
		observed: value.crimes,
		projected: Math.round(value.crimes * 1.08)
	})).map((entry, index) => ({
		month: entry.month,
		observed: entry.observed,
		projected: Math.round(entry.observed * (1.04 + index * .01))
	}));
	const sortedRiskScores = [...calculateDistrictRiskScores(districts, crimes)].sort((left, right) => right.score - left.score);
	const riskScores = sortedRiskScores.map((r) => ({
		districtId: r.districtId,
		district: r.district,
		score: r.score,
		level: r.level,
		reasons: r.reasons,
		trend: districts.find((d) => d.id === r.districtId)?.trend.slice(-1)[0] ?? 0
	})).slice(0, 10);
	const anomalies = districts.filter((district) => district.crimeCount > districts.reduce((sum, item) => sum + item.crimeCount, 0) / districts.length * 1.4).slice(0, 5).map((district) => ({
		title: `${district.name} spike`,
		district: district.name,
		severity: "High",
		signal: `Crime activity is ${Math.round(district.crimeCount / districts.reduce((sum, item) => sum + item.crimeCount, 0) * 100)}% of the state sample`
	}));
	const hotspots = sortedRiskScores.slice(0, 5).map((r) => ({
		district: r.district,
		score: r.score,
		reason: r.reasons.join(", ")
	}));
	return {
		barSeries: lastTwelve.map(([month, value]) => ({
			label: monthLabel(month),
			crimes: value.crimes,
			firs: value.firs
		})),
		pieSeries: [...categories.entries()].map(([name, value]) => ({
			name,
			value
		})).sort((left, right) => right.value - left.value),
		lineSeries: lastTwelve.map(([month, value]) => ({
			month: monthLabel(month),
			crimeCount: value.crimes,
			solvedCount: value.solved,
			pendingCount: value.pending
		})),
		yearlyTrend: [...yearly.entries()].sort((left, right) => left[0] - right[0]).map(([year, value]) => ({
			year,
			crimes: value.crimes,
			solved: value.solved
		})),
		districtComparison: districts.slice(0, 10).map((district) => ({
			name: district.name,
			crimes: district.crimeCount,
			solved: Math.round(district.crimeCount * .45),
			pending: Math.round(district.crimeCount * .55)
		})),
		categoryDistribution: [...categories.entries()].map(([name, value]) => ({
			name,
			value
		})).sort((left, right) => right.value - left.value),
		ageDistribution: [...ageBands.entries()].map(([band, value]) => ({
			band,
			value
		})),
		genderDistribution: [...genders.entries()].map(([name, value]) => ({
			name,
			value
		})),
		predictionGraph,
		riskScores,
		anomalyEvents: anomalies,
		hotspotPrediction: hotspots
	};
}
function getNetworkGraphSummary() {
	const { crimes, accused, victims, policeStations, districts } = getData();
	const topCriminals = accused.slice().sort((left, right) => Number(right.repeatOffender) - Number(left.repeatOffender)).slice(0, 8);
	const topVictims = victims.slice(0, 8);
	const topStations = policeStations.slice(0, 8);
	const topDistricts = districts.slice().sort((left, right) => right.crimeCount - left.crimeCount).slice(0, 8);
	const topCases = crimes.slice(0, 8);
	const nodes = [
		...topCriminals.map((item, index) => ({
			id: item.id,
			label: item.name,
			type: "criminal",
			district: item.districtId,
			value: 8 - index
		})),
		...topVictims.map((item, index) => ({
			id: item.id,
			label: item.name,
			type: "victim",
			district: item.districtId,
			value: 7 - index
		})),
		...topStations.map((item, index) => ({
			id: item.id,
			label: item.name,
			type: "station",
			district: item.districtId,
			value: 6 - index
		})),
		...topDistricts.map((item, index) => ({
			id: item.id,
			label: item.name,
			type: "district",
			district: item.id,
			value: 9 - index
		})),
		...topCases.map((item, index) => ({
			id: item.id,
			label: item.caseNumber,
			type: "case",
			district: item.districtId,
			value: 5 - index
		}))
	];
	const edges = [];
	topCases.forEach((crime, index) => {
		edges.push({
			source: crime.id,
			target: crime.accusedId,
			label: "accused",
			weight: 3 + index % 2
		});
		edges.push({
			source: crime.id,
			target: crime.victimId,
			label: "victim",
			weight: 2 + index % 3
		});
		edges.push({
			source: crime.id,
			target: crime.policeStationId,
			label: "station",
			weight: 2
		});
		edges.push({
			source: crime.id,
			target: crime.districtId,
			label: "district",
			weight: 3
		});
	});
	return {
		nodes,
		edges,
		highlights: [
			{
				label: "Active links",
				value: String(edges.length)
			},
			{
				label: "Core entities",
				value: String(nodes.length)
			},
			{
				label: "Repeat offenders",
				value: String(accused.filter((item) => item.repeatOffender).length)
			},
			{
				label: "Hot districts",
				value: String(topDistricts.length)
			}
		]
	};
}
function getCriminalTimelineData() {
	const { crimes, accused, firs } = getData();
	return accused.map((acc) => {
		const accCrimes = crimes.filter((c) => c.accusedId === acc.id || c.accusedName === acc.name);
		const events = [];
		accCrimes.forEach((crime) => {
			const linkedFir = firs.find((f) => f.id === crime.firId || f.crimeId === crime.id);
			const firNum = linkedFir?.firNumber ?? "N/A";
			const crimeDate = new Date(crime.crimeTime);
			events.push({
				id: `event-${crime.id}-committed`,
				date: crime.crimeTime,
				type: "crime",
				title: "Crime Incident",
				description: `${crime.title} — Category: ${crime.category} using weapon: ${crime.weapon}. Modus Operandi: ${crime.modusOperandi}`,
				firNumber: firNum,
				crimeType: crime.crimeType
			});
			if (linkedFir) events.push({
				id: `event-${crime.id}-fir`,
				date: linkedFir.dateFiled,
				type: "fir",
				title: "FIR Registered",
				description: `FIR ${linkedFir.firNumber} registered under section ${linkedFir.section} at ${linkedFir.policeStationName}. Officer: ${linkedFir.officer}. Status: ${linkedFir.status}.`,
				firNumber: firNum,
				crimeType: crime.crimeType
			});
			if (crime.arrestStatus && crime.arrestStatus !== "Not Arrested") {
				const arrestDate = new Date(crimeDate.getTime() + 2880 * 60 * 1e3).toISOString();
				events.push({
					id: `event-${crime.id}-arrest`,
					date: arrestDate,
					type: crime.arrestStatus === "Bail Granted" ? "bail" : "arrest",
					title: crime.arrestStatus,
					description: `Arrest status updated to: ${crime.arrestStatus} under supervision of ${crime.investigationOfficer}.`,
					firNumber: firNum,
					crimeType: crime.crimeType
				});
			}
			if (crime.courtStatus && crime.courtStatus !== "Not Filed") {
				const courtDate = new Date(crimeDate.getTime() + 360 * 60 * 60 * 1e3).toISOString();
				events.push({
					id: `event-${crime.id}-court`,
					date: courtDate,
					type: "court",
					title: crime.courtStatus,
					description: `Court trial status updated to: ${crime.courtStatus}. Case status is currently: ${crime.status}.`,
					firNumber: firNum,
					crimeType: crime.crimeType
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
			timeline: sortedTimeline
		};
	});
}
function getAssistantResponse(question) {
	const lower = question.toLowerCase();
	const dashboard = getDashboardSummary();
	const analytics = getAnalyticsSummary();
	const topDistrict = dashboard.topCrimeDistricts[0];
	const topHotspot = analytics.hotspotPrediction[0];
	if (lower.includes("highest crime") || lower.includes("top district")) return {
		answer: `${topDistrict.name} currently leads the sample with ${topDistrict.crimes.toLocaleString()} crimes and ${topDistrict.hotspots} hotspots.`,
		confidence: .96,
		citations: [`/${topDistrict.name}`, "/api/dashboard"],
		suggestions: [
			"Show monthly trend",
			"Compare with second district",
			"List recent FIRs"
		]
	};
	if (lower.includes("trend") || lower.includes("forecast")) return {
		answer: `Crime activity is trending upward in the latest sample, with projected values of ${analytics.predictionGraph.slice(-3).map((entry) => entry.projected).join(", ")} over the last three observed months.`,
		confidence: .89,
		citations: ["/api/analytics"],
		suggestions: [
			"Show yearly trend",
			"Show risk scores",
			"What are the hotspot districts?"
		]
	};
	if (lower.includes("hotspot")) return {
		answer: `The strongest hotspot signal is in ${topHotspot.district}, where the risk score is ${topHotspot.score}.`,
		confidence: .92,
		citations: ["/api/analytics", "/api/map"],
		suggestions: [
			"Show network graph",
			"Show crime map",
			"List repeat offenders"
		]
	};
	if (lower.includes("fir")) {
		const recent = dashboard.recentFirs[0];
		return {
			answer: `There are ${dashboard.totals.firs.toLocaleString()} FIR records. The latest sample entry is ${recent.firNumber} from ${recent.districtName}.`,
			confidence: .91,
			citations: ["/api/firs", "/api/dashboard"],
			suggestions: [
				"Search FIR by district",
				"Filter by officer",
				"Download report"
			]
		};
	}
	return {
		answer: `The platform currently tracks ${dashboard.totals.crimes.toLocaleString()} crimes across ${dashboard.totals.districts} districts. Ask me about the highest crime district, hotspots, FIRs, trends, or predictions.`,
		confidence: .84,
		citations: ["/api/dashboard", "/api/analytics"],
		suggestions: [
			"Highest crime district",
			"Crime trends",
			"Recent FIRs",
			"Hotspots"
		]
	};
}
async function getHybridAssistantResponse(question) {
	return enrichAssistantResponseWithRecommendations(await internalGetHybridAssistantResponse(question), question);
}
async function internalGetHybridAssistantResponse(question) {
	let cleanQuestion = question;
	let contextPage = "";
	let contextRows = [];
	const contextIndex = question.indexOf("\nContext:");
	if (contextIndex !== -1) {
		cleanQuestion = question.substring(0, contextIndex).trim();
		const contextStr = question.substring(contextIndex + 9).trim();
		try {
			const parsed = JSON.parse(contextStr);
			if (parsed && typeof parsed === "object") if (Array.isArray(parsed)) contextRows = parsed;
			else {
				contextPage = parsed.page ?? "";
				contextRows = parsed.rows ?? [];
			}
		} catch (e) {}
	} else {
		const contextIndexNoNL = question.indexOf("Context:");
		if (contextIndexNoNL !== -1) {
			cleanQuestion = question.substring(0, contextIndexNoNL).trim();
			const contextStr = question.substring(contextIndexNoNL + 8).trim();
			try {
				const parsed = JSON.parse(contextStr);
				if (parsed && typeof parsed === "object") if (Array.isArray(parsed)) contextRows = parsed;
				else {
					contextPage = parsed.page ?? "";
					contextRows = parsed.rows ?? [];
				}
			} catch (e) {}
		}
	}
	if (/similar|matching cases|case finder|compare fir|find similarity/i.test(cleanQuestion)) {
		const caseMatch = cleanQuestion.match(/case\/[a-z0-9]+\/\d+/i) || cleanQuestion.match(/fir\/[a-z0-9]+\/\d+/i) || cleanQuestion.match(/crime-[a-z0-9]+/i) || cleanQuestion.match(/fir-[a-z0-9]+/i);
		let targetKey = "";
		if (caseMatch) targetKey = caseMatch[0].toUpperCase();
		else if (contextRows.length > 0) targetKey = contextRows[0].caseNumber ?? contextRows[0].firNumber ?? contextRows[0].id ?? "";
		else {
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
				return {
					answer,
					confidence: .98,
					citations: ["Similar Case Finder Module", "FIR Database"],
					suggestions: [
						`Show details for ${matches[0].caseNumber}`,
						`Investigate suspect ${matches[0].accusedName}`,
						"Show crime trends"
					],
					handledBy: "analysis",
					tableRows: matches,
					tableColumns: [
						"caseNumber",
						"firNumber",
						"crimeType",
						"districtName",
						"similarityPercentage",
						"modusOperandi"
					]
				};
			} else return {
				answer: `Could not find any similar cases for record **${targetKey}**. Please check if the case/FIR number is correct.`,
				confidence: .85,
				citations: ["Similar Case Finder Module"],
				suggestions: ["List recent FIRs", "Show repeat offenders"],
				handledBy: "analysis"
			};
		}
	}
	if (contextRows.length > 0) {
		const caseMatch = cleanQuestion.match(/case\/[a-z0-9]+\/\d+/i);
		const firMatch = cleanQuestion.match(/fir\/[a-z0-9]+\/\d+/i);
		if (caseMatch) {
			const matchStr = caseMatch[0].toUpperCase();
			const matchedRow = contextRows.find((r) => r.caseNumber?.toUpperCase() === matchStr);
			if (matchedRow) return {
				answer: `Found case **${matchedRow.caseNumber}** in the page records:\n\n• **Title**: ${matchedRow.title ?? matchedRow.crimeType ?? "Crime Record"}\n• **District**: ${matchedRow.districtName}\n• **Severity**: ${matchedRow.severity}\n• **Status**: ${matchedRow.status}\n• **Officer**: ${matchedRow.investigationOfficer ?? matchedRow.officer}\n• **Accused**: ${matchedRow.accusedName ?? "Unknown"}\n• **Victim**: ${matchedRow.victimName ?? "Unknown"}\n• **Modus Operandi**: ${matchedRow.modusOperandi ?? "N/A"}`,
				confidence: .99,
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
					"investigationOfficer"
				]
			};
		}
		if (firMatch) {
			const matchStr = firMatch[0].toUpperCase();
			const matchedRow = contextRows.find((r) => r.firNumber?.toUpperCase() === matchStr);
			if (matchedRow) return {
				answer: `Found FIR **${matchedRow.firNumber}** in the page records:\n\n• **District**: ${matchedRow.districtName}\n• **Police Station**: ${matchedRow.policeStationName}\n• **Officer**: ${matchedRow.officer}\n• **Status**: ${matchedRow.status}\n• **IPC Section**: ${matchedRow.section}\n• **Date Filed**: ${matchedRow.dateFiled?.slice(0, 10) ?? "N/A"}\n• **Details**: ${matchedRow.caseDetails}`,
				confidence: .99,
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
					"section"
				]
			};
		}
	}
	const isContextSummaryQuery = /summarise|summarize|tell me about|explain|describe|what is shown|records shown|this page|these records|these cases|these fir/i.test(cleanQuestion);
	if (contextRows.length > 0 && isContextSummaryQuery) {
		const isCrime = contextPage.toLowerCase().includes("crime") || "caseNumber" in contextRows[0];
		const isFir = contextPage.toLowerCase().includes("fir") || "firNumber" in contextRows[0];
		if (isCrime) {
			const total = contextRows.length;
			const categories = {};
			const severities = {};
			const statuses = {};
			contextRows.forEach((r) => {
				if (r.category) categories[r.category] = (categories[r.category] ?? 0) + 1;
				if (r.severity) severities[r.severity] = (severities[r.severity] ?? 0) + 1;
				if (r.status) statuses[r.status] = (statuses[r.status] ?? 0) + 1;
			});
			const catStr = Object.entries(categories).map(([k, v]) => `${k} (${v})`).join(", ");
			const sevStr = Object.entries(severities).map(([k, v]) => `${k} (${v})`).join(", ");
			const statStr = Object.entries(statuses).map(([k, v]) => `${k} (${v})`).join(", ");
			return {
				answer: `Here is a summary of the ${total} crime records visible on this page:\n\n• **Categories**: ${catStr || "None"}\n• **Severities**: ${sevStr || "None"}\n• **Statuses**: ${statStr || "None"}\n\nYou can search, filter, and drill down on these records using the platform controls.`,
				confidence: .98,
				citations: ["Visible page context"],
				suggestions: [
					"Show open cases",
					"Show critical crimes",
					"Show crime trends"
				],
				handledBy: "sql",
				tableRows: contextRows,
				tableColumns: [
					"caseNumber",
					"districtName",
					"crimeType",
					"severity",
					"status",
					"investigationOfficer"
				]
			};
		}
		if (isFir) {
			const total = contextRows.length;
			const statuses = {};
			const sections = {};
			contextRows.forEach((r) => {
				if (r.status) statuses[r.status] = (statuses[r.status] ?? 0) + 1;
				if (r.section) sections[r.section] = (sections[r.section] ?? 0) + 1;
			});
			const statStr = Object.entries(statuses).map(([k, v]) => `${k} (${v})`).join(", ");
			const secStr = Object.entries(sections).map(([k, v]) => `${k} (${v})`).join(", ");
			return {
				answer: `Here is a summary of the ${total} FIR records visible on this page:\n\n• **Statuses**: ${statStr || "None"}\n• **Sections**: ${secStr || "None"}\n\nYou can inspect live case details or filter these FIRs using the page controls.`,
				confidence: .98,
				citations: ["Visible page context"],
				suggestions: [
					"List recent FIRs",
					"Filter by officer",
					"Download report"
				],
				handledBy: "sql",
				tableRows: contextRows,
				tableColumns: [
					"firNumber",
					"districtName",
					"policeStationName",
					"officer",
					"status",
					"section"
				]
			};
		}
	}
	const { intent, normalisedQuery, analysisType } = await routeIntent(cleanQuestion);
	if (intent === "caw") return generateAnalysisResponse(runAnalysis("caw", normalisedQuery), cleanQuestion);
	if (intent === "sql") return await generateSqlResponse(await executeTextToSql(normalisedQuery, "sql"), cleanQuestion);
	if (intent === "rag") return generateRagResponse(retrieveFromRag(normalisedQuery), cleanQuestion);
	if (intent === "analysis") return generateAnalysisResponse(runAnalysis(analysisType ?? "trend", normalisedQuery), cleanQuestion);
	const ragResult = retrieveFromRag(normalisedQuery);
	if (ragResult.chunks.length > 0 && ragResult.chunks[0].score > .1) return generateRagResponse(ragResult, cleanQuestion);
	const { totals } = getDashboardSummary();
	return generateGeneralResponse(cleanQuestion, totals.crimes, totals.districts);
}
function getReportsSummary() {
	const dashboard = getDashboardSummary();
	const analytics = getAnalyticsSummary();
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		reports: [
			{
				id: "rpt-dashboard",
				title: "State Crime Dashboard",
				format: "PDF/CSV/XLSX",
				rows: dashboard.totals.crimes,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "rpt-districts",
				title: "District Comparison",
				format: "CSV/XLSX",
				rows: dashboard.topCrimeDistricts.length,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "rpt-hotspots",
				title: "Hotspot Forecast",
				format: "PDF/CSV",
				rows: analytics.hotspotPrediction.length,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		]
	};
}
function getSettingsSummary() {
	return {
		roles: [
			"admin",
			"police_officer",
			"analyst",
			"scrb_officer",
			"investigator",
			"data_analyst"
		],
		modules: [
			"Crimes",
			"FIR Records",
			"Districts",
			"Crime Map",
			"Analytics",
			"AI Assistant",
			"Reports",
			"Network Analysis"
		],
		dataStatus: "Connected",
		services: {
			postgres: "Ready for Supabase/PostgreSQL deployment",
			neo4j: "Graph model available via /api/network",
			leaflet: "Map markers and hotspots available via /api/map"
		},
		dashboard: getDashboardSummary()
	};
}
function splitResource(path) {
	const parts = path.split("/").filter(Boolean);
	return {
		resource: parts[0] ?? "",
		id: parts[1] ?? "",
		subId: parts[2] ?? ""
	};
}
function parseNumber(value, fallback) {
	const next = Number(value);
	return Number.isFinite(next) && next > 0 ? next : fallback;
}
function csvEscape(value) {
	const raw = String(value ?? "");
	if (/[",\n]/.test(raw)) return `"${raw.replaceAll("\"", "\"\"")}"`;
	return raw;
}
function toCsv(rows) {
	if (!rows.length) return "";
	const headers = Object.keys(rows[0]);
	const lines = [headers.join(",")];
	rows.forEach((row) => {
		lines.push(headers.map((header) => csvEscape(row[header])).join(","));
	});
	return lines.join("\n");
}
var Route$13 = createFileRoute("/api/$")({ server: { handlers: {
	GET: async ({ request, params }) => {
		const { resource, id, subId } = splitResource(params._splat ?? "");
		const url = new URL(request.url);
		if (resource === "dashboard") return Response.json(getDashboardSummary());
		if (resource === "crimes") {
			if (id) {
				const crime = getCrime(id);
				if (!crime) return Response.json({ message: "Crime record not found" }, { status: 404 });
				return Response.json(crime);
			}
			const page = parseNumber(url.searchParams.get("page"), 1);
			const pageSize = parseNumber(url.searchParams.get("pageSize"), 20);
			const sortBy = url.searchParams.get("sortBy");
			const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";
			return Response.json(listCrimes({
				search: url.searchParams.get("search") ?? void 0,
				district: url.searchParams.get("district") ?? void 0,
				category: url.searchParams.get("category") ?? void 0,
				status: url.searchParams.get("status") ?? void 0,
				severity: url.searchParams.get("severity") ?? void 0,
				page,
				pageSize,
				sortBy,
				sortDir
			}));
		}
		if (resource === "firs") {
			if (id) {
				const fir = getFir(id);
				if (!fir) return Response.json({ message: "FIR record not found" }, { status: 404 });
				return Response.json(fir);
			}
			const page = parseNumber(url.searchParams.get("page"), 1);
			const pageSize = parseNumber(url.searchParams.get("pageSize"), 20);
			return Response.json(listFirs({
				search: url.searchParams.get("search") ?? void 0,
				district: url.searchParams.get("district") ?? void 0,
				status: url.searchParams.get("status") ?? void 0,
				officer: url.searchParams.get("officer") ?? void 0,
				page,
				pageSize
			}));
		}
		if (resource === "districts") return Response.json(getDistrictSummaries());
		if (resource === "analytics") return Response.json(getAnalyticsSummary());
		if (resource === "map") return Response.json({
			...getDashboardSummary(),
			districts: getDistrictSummaries()
		});
		if (resource === "network") return Response.json(getNetworkGraphSummary());
		if (resource === "timeline") return Response.json(getCriminalTimelineData());
		if (resource === "assistant") {
			const question = url.searchParams.get("question") ?? "";
			return Response.json(getAssistantResponse(question));
		}
		if (resource === "ai-assistant") {
			const question = url.searchParams.get("question") ?? "";
			return Response.json(await getHybridAssistantResponse(question));
		}
		if (resource === "reports") {
			const summary = getReportsSummary();
			const format = url.searchParams.get("format") ?? "json";
			const type = url.searchParams.get("type") ?? "reports";
			if (format === "csv") {
				if (type === "crimes") {
					const { items } = listCrimes({
						page: 1,
						pageSize: 1e4
					});
					return new Response(toCsv(items.map((crime) => ({
						id: crime.id,
						caseNumber: crime.caseNumber,
						district: crime.districtName,
						category: crime.category,
						crimeType: crime.crimeType,
						status: crime.status,
						severity: crime.severity,
						officer: crime.investigationOfficer,
						crimeTime: crime.crimeTime
					}))), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
				}
				return new Response(toCsv(summary.reports), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
			}
			if (format === "html") return new Response(`<!doctype html><html><head><title>Reports</title><meta charset="utf-8" /></head><body><pre>${JSON.stringify(summary, null, 2)}</pre></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
			return Response.json(summary);
		}
		if (resource === "settings") return Response.json(getSettingsSummary());
		if (resource === "health") return Response.json({
			ok: true,
			service: "ksp-crime-platform",
			time: (/* @__PURE__ */ new Date()).toISOString()
		});
		return Response.json({ message: "Not found" }, { status: 404 });
	},
	POST: async ({ request, params }) => {
		const { resource, id } = splitResource(params._splat ?? "");
		const body = await request.json().catch(() => ({}));
		if (resource === "crimes" && !id) return Response.json(createCrime(body));
		return Response.json({ message: "Not found" }, { status: 404 });
	},
	PUT: async ({ request, params }) => {
		const { resource, id } = splitResource(params._splat ?? "");
		const body = await request.json().catch(() => ({}));
		if (resource === "crimes" && id) {
			const updated = updateCrime(id, body);
			if (!updated) return Response.json({ message: "Crime record not found" }, { status: 404 });
			return Response.json(updated);
		}
		if (resource === "firs" && id) {
			const updated = updateFir(id, body);
			if (!updated) return Response.json({ message: "FIR record not found" }, { status: 404 });
			return Response.json(updated);
		}
		return Response.json({ message: "Not found" }, { status: 404 });
	},
	PATCH: async ({ request, params }) => {
		const { resource, id } = splitResource(params._splat ?? "");
		const body = await request.json().catch(() => ({}));
		if (resource === "crimes" && id) {
			const updated = updateCrime(id, body);
			if (!updated) return Response.json({ message: "Crime record not found" }, { status: 404 });
			return Response.json(updated);
		}
		if (resource === "firs" && id) {
			const updated = updateFir(id, body);
			if (!updated) return Response.json({ message: "FIR record not found" }, { status: 404 });
			return Response.json(updated);
		}
		return Response.json({ message: "Not found" }, { status: 404 });
	},
	DELETE: async ({ params }) => {
		const { resource, id } = splitResource(params._splat ?? "");
		if (resource === "crimes" && id) {
			if (!deleteCrime(id)) return Response.json({ message: "Crime record not found" }, { status: 404 });
			return Response.json({ ok: true });
		}
		if (resource === "firs" && id) {
			if (!deleteFir(id)) return Response.json({ message: "FIR record not found" }, { status: 404 });
			return Response.json({ ok: true });
		}
		return Response.json({ message: "Not found" }, { status: 404 });
	}
} } });
var $$splitComponentImporter$12 = () => import("./timeline-C4r9fG2Z.mjs");
var Route$12 = createFileRoute("/_authenticated/timeline")({
	head: () => ({ meta: [{ title: "Criminal Timeline · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./settings-Bjv58apD.mjs");
var Route$11 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: "Settings · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./reports-DUzZ4bF2.mjs");
var Route$10 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [{ title: "Reports · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./network-B9sRmqw2.mjs");
var Route$9 = createFileRoute("/_authenticated/network")({
	head: () => ({ meta: [{ title: "Network Analysis · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./map-C7sdeU2K.mjs");
var Route$8 = createFileRoute("/_authenticated/map")({
	head: () => ({ meta: [{ title: "Crime Map · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./fir-DA0cvOZj.mjs");
var Route$7 = createFileRoute("/_authenticated/fir")({
	head: () => ({ meta: [{ title: "FIR Records · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./evidence-DAKNUJE3.mjs");
var Route$6 = createFileRoute("/_authenticated/evidence")({
	head: () => ({ meta: [{ title: "Evidence Management · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./districts-DquhB7mt.mjs");
var Route$5 = createFileRoute("/_authenticated/districts")({
	head: () => ({ meta: [{ title: "Districts · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard-Dm-1fQ5W.mjs");
var Route$4 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./crimes-Bm7CYht9.mjs");
var Route$3 = createFileRoute("/_authenticated/crimes")({
	head: () => ({ meta: [{ title: "Crimes · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./assistant-A7vhGnBT.mjs");
var Route$2 = createFileRoute("/_authenticated/assistant")({
	head: () => ({ meta: [{ title: "AI Assistant · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./analytics--eJIvv1z.mjs");
var Route$1 = createFileRoute("/_authenticated/analytics")({
	head: () => ({ meta: [{ title: "Analytics · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./ai-BZQUl2mS.mjs");
var Route = createFileRoute("/_authenticated/ai")({
	head: () => ({ meta: [{ title: "AI Intelligence · KSP Crime Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var ResetPasswordRoute = Route$18.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$19
});
var ForgotPasswordRoute = Route$17.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$19
});
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRoute = Route$15.update({
	id: "/_authenticated",
	getParentRoute: () => Route$19
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var ApiSplatRoute = Route$13.update({
	id: "/api/$",
	path: "/api/$",
	getParentRoute: () => Route$19
});
var AuthenticatedTimelineRoute = Route$12.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$10.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNetworkRoute = Route$9.update({
	id: "/network",
	path: "/network",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMapRoute = Route$8.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFirRoute = Route$7.update({
	id: "/fir",
	path: "/fir",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedEvidenceRoute = Route$6.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDistrictsRoute = Route$5.update({
	id: "/districts",
	path: "/districts",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$4.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCrimesRoute = Route$3.update({
	id: "/crimes",
	path: "/crimes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAssistantRoute = Route$2.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$1.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAiRoute: Route.update({
		id: "/ai",
		path: "/ai",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAnalyticsRoute,
	AuthenticatedAssistantRoute,
	AuthenticatedCrimesRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedDistrictsRoute,
	AuthenticatedEvidenceRoute,
	AuthenticatedFirRoute,
	AuthenticatedMapRoute,
	AuthenticatedNetworkRoute,
	AuthenticatedReportsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedTimelineRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ForgotPasswordRoute,
	ResetPasswordRoute,
	ApiSplatRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
