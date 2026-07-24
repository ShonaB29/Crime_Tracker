import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Line, r as LineChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
import { B as FileDown, i as Volume2, x as Mic } from "../_libs/lucide-react.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AssistantPage-CwTA6dhm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
/**
* AssistantPage — Workflow Step 10
*
* Displays the hybrid AI response including:
*   - Answer text + confidence + citations  (existing UI, unchanged)
*   - Metrics card                          (new)
*   - Trend / prediction chart              (new – recharts LineChart)
*   - Hotspot map overlay                   (new – SVG dot map)
*   - Criminal network visualisation        (new – SVG force-layout)
*   - Downloadable PDF report               (new – browser print)
*   - Follow-up suggestion pills            (existing UI, unchanged)
*/
async function askHybridAssistant(question) {
	const start = performance.now();
	const response = await fetch(`/api/ai-assistant?question=${encodeURIComponent(question)}`);
	if (!response.ok) throw new Error("Assistant unavailable");
	const data = await response.json();
	const end = performance.now();
	return {
		...data,
		processingTimeMs: Math.round(end - start),
		timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
	};
}
/** Trend / prediction line chart rendered when chartData contains month keys */
function TrendChart({ data }) {
	if (!data?.length || !data[0].month) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs uppercase tracking-widest text-muted-foreground",
			children: "Crime Trend Chart"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-52",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "rgba(255,255,255,0.08)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "month",
							stroke: "rgba(255,255,255,0.45)",
							tick: { fontSize: 10 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "rgba(255,255,255,0.45)",
							tick: { fontSize: 10 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "#0d1117",
							border: "1px solid rgba(255,255,255,0.08)"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "observed",
							stroke: "#58d6c9",
							strokeWidth: 2,
							dot: false,
							name: "Observed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "projected",
							stroke: "#a88cff",
							strokeWidth: 2,
							strokeDasharray: "5 3",
							dot: false,
							name: "Projected"
						})
					]
				})
			})
		})]
	});
}
/** Hotspot map: SVG dot-map using normalised lat/lng coordinates */
function HotspotMap({ points }) {
	if (!points?.length) return null;
	const LAT_MIN = 11.5, LAT_MAX = 18.5, LNG_MIN = 74, LNG_MAX = 78.5;
	const W = 320, H = 200;
	const toX = (lng) => (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W;
	const toY = (lat) => H - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN) * H;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs uppercase tracking-widest text-muted-foreground",
			children: "Crime Hotspot Map"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${W} ${H}`,
				className: "w-full",
				style: { maxHeight: 200 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 0,
					y: 0,
					width: W,
					height: H,
					fill: "rgba(255,255,255,0.02)",
					rx: 8
				}), points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: toX(p.lng),
						cy: toY(p.lat),
						r: p.intensity * 14 + 4,
						fill: `rgba(255,80,80,${p.intensity * .25})`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: toX(p.lng),
						cy: toY(p.lat),
						r: 4,
						fill: `rgba(255,${Math.round(80 + (1 - p.intensity) * 120)},80,0.9)`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("title", { children: [
						p.district,
						" — ",
						p.category,
						" (",
						Math.round(p.intensity * 100),
						"%)"
					] })
				] }, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-center text-[10px] text-muted-foreground",
				children: [
					"Karnataka — ",
					points.length,
					" hotspot clusters"
				]
			})]
		})]
	});
}
/** Criminal network: simple SVG force-layout (circular placement) */
function NetworkViz({ data }) {
	if (!data?.nodes?.length) return null;
	const nodes = data.nodes.slice(0, 16);
	const edges = data.edges.slice(0, 24);
	const W = 320, H = 220, CX = W / 2, CY = H / 2, R = 90;
	const positions = nodes.map((_, i) => ({
		x: CX + R * Math.cos(2 * Math.PI * i / nodes.length),
		y: CY + R * Math.sin(2 * Math.PI * i / nodes.length)
	}));
	const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]));
	const typeColor = {
		criminal: "#ff6b6b",
		victim: "#67a4ff",
		station: "#58d6c9",
		district: "#a88cff",
		case: "#ffb86b"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs uppercase tracking-widest text-muted-foreground",
			children: "Criminal Network Graph"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${W} ${H}`,
				className: "w-full",
				style: { maxHeight: 220 },
				children: [edges.map((e, i) => {
					const si = nodeIndex.get(e.source);
					const ti = nodeIndex.get(e.target);
					if (si === void 0 || ti === void 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: positions[si].x,
						y1: positions[si].y,
						x2: positions[ti].x,
						y2: positions[ti].y,
						stroke: "rgba(255,255,255,0.12)",
						strokeWidth: e.weight * .5
					}, i);
				}), nodes.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: positions[i].x,
					cy: positions[i].y,
					r: 6 + n.value * .5,
					fill: typeColor[n.type] ?? "#888",
					opacity: .85
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: positions[i].x,
					y: positions[i].y - 9,
					textAnchor: "middle",
					fontSize: 7,
					fill: "rgba(255,255,255,0.6)",
					children: n.label.split(" ")[0]
				})] }, n.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground",
				children: Object.entries(typeColor).map(([type, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-2 w-2 rounded-full",
						style: { backgroundColor: color }
					}), type]
				}, type))
			})]
		})]
	});
}
/** Key metrics grid */
function MetricsGrid({ metrics }) {
	const entries = Object.entries(metrics).filter(([key, value]) => {
		if (key === "query" || key === "explanation") return false;
		if (typeof value === "string" && value.length > 60) return false;
		return true;
	}).slice(0, 6);
	if (!entries.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3",
		children: entries.map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-white/10 bg-white/5 px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-widest text-muted-foreground",
				children: key.replace(/([A-Z])/g, " $1")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm font-semibold text-foreground",
				children: String(value)
			})]
		}, key))
	});
}
function AssistantPage() {
	const [question, setQuestion] = (0, import_react.useState)("Show crime trends");
	(0, import_react.useRef)(null);
	const navigate = useNavigate();
	const query = useQuery({
		queryKey: ["ai-assistant", question],
		queryFn: () => askHybridAssistant(question)
	});
	const suggestions = (0, import_react.useMemo)(() => query.data?.suggestions ?? [], [query.data]);
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [voiceEnabled, setVoiceEnabled] = (0, import_react.useState)(() => localStorage.getItem("voice_enabled") === "true");
	const [voiceSpeed, setVoiceSpeed] = (0, import_react.useState)(() => Number(localStorage.getItem("voice_speed") ?? "1.0"));
	const [selectedVoiceName, setSelectedVoiceName] = (0, import_react.useState)(() => localStorage.getItem("voice_name") ?? "");
	const [availableVoices, setAvailableVoices] = (0, import_react.useState)([]);
	const [showVoiceSettings, setShowVoiceSettings] = (0, import_react.useState)(false);
	const [explainOpen, setExplainOpen] = (0, import_react.useState)(false);
	const [sqlCardOpen, setSqlCardOpen] = (0, import_react.useState)(false);
	const reasoningSteps = (0, import_react.useMemo)(() => {
		if (!query.data) return [];
		switch (query.data.handledBy) {
			case "sql": return [
				"Parsed query intent: Categorized as structured search requiring database statistics query.",
				"Generated Text-to-SQL command mapping columns (FIR, District, Officer, status).",
				"Executed SQL query against local Karnataka Crime Database schema.",
				"Retrieved structured rows and calculated corresponding counts.",
				"Generated natural language response reporting results and appended follow-up suggestions."
			];
			case "rag": return [
				"Parsed query intent: Categorized as semantic textual documentation retrieval request.",
				"Computed text embeddings on the search query.",
				"Executed cosine similarity lookup on vector DB document segments.",
				"Retrieved top verified RAG documents matching Karnataka census and demographics.",
				"Synthesized context summary to answer the question exactly matching verified sources."
			];
			case "analysis": return [
				"Parsed query intent: Categorized as analytics engine prediction/risk scoring.",
				"Loaded historical crimes dataset and aggregated monthly buckets.",
				"Computed dynamic risk score using baseline frequency, offender presence, and trend weights.",
				"Ran time-series forecasting to plot observed vs projected values.",
				"Compiled hotspot coordinates and generated recommendation checklist."
			];
			case "caw": return [
				"Parsed query intent: Categorized as Crimes Against Women statistics inquiry.",
				"Queried specific state-wide CAW ledger tables.",
				"Extracted category breakdowns (Rape, Dowry Deaths, Assault).",
				"Constructed comparative metrics for top crime districts.",
				"Compiled safety insights and next-step recommendations."
			];
			default: return [
				"Parsed query intent: General help / conversational QA request.",
				"Routed to General LLM generator.",
				"Matched with internal agent knowledge base.",
				"Constructed direct response with helpful system guidelines."
			];
		}
	}, [query.data]);
	(0, import_react.useEffect)(() => {
		const loadVoices = () => {
			const voices = window.speechSynthesis.getVoices();
			setAvailableVoices(voices.filter((v) => v.lang.startsWith("en")));
		};
		loadVoices();
		if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = loadVoices;
	}, []);
	(0, import_react.useEffect)(() => {
		if (query.data && voiceEnabled) {
			window.speechSynthesis.cancel();
			const speechText = query.data.answer.replace(/\*\*/g, "").replace(/###/g, "").replace(/•/g, "-").replace(/- /g, "").slice(0, 500);
			const utterance = new SpeechSynthesisUtterance(speechText);
			utterance.rate = voiceSpeed;
			if (selectedVoiceName) {
				const matched = window.speechSynthesis.getVoices().find((v) => v.name === selectedVoiceName);
				if (matched) utterance.voice = matched;
			}
			window.speechSynthesis.speak(utterance);
		}
		return () => {
			window.speechSynthesis.cancel();
		};
	}, [
		query.data,
		voiceEnabled,
		voiceSpeed,
		selectedVoiceName
	]);
	function startSpeechToText() {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) {
			toast.error("Speech recognition is not supported in this browser. Please use Google Chrome.");
			return;
		}
		const rec = new SpeechRecognition();
		rec.lang = "en-IN";
		rec.interimResults = false;
		rec.maxAlternatives = 1;
		rec.onstart = () => {
			setIsListening(true);
			toast.info("Microphone active... Speak your query in English.");
		};
		rec.onerror = (e) => {
			console.error(e);
			setIsListening(false);
			toast.error("Voice capture error: " + e.error);
		};
		rec.onend = () => {
			setIsListening(false);
		};
		rec.onresult = (event) => {
			const recognized = event.results[0][0].transcript;
			setQuestion(recognized);
			toast.success("Voice capture successful!");
			const cmd = recognized.toLowerCase().trim();
			if (cmd === "submit" || cmd === "send" || cmd === "ask") query.refetch();
			else if (cmd === "clear" || cmd === "reset") setQuestion("");
			else if (cmd.includes("go to dashboard")) navigate({ to: "/dashboard" });
			else if (cmd.includes("go to crimes")) navigate({ to: "/crimes" });
			else if (cmd.includes("go to map")) navigate({ to: "/map" });
			else if (cmd.includes("go to timeline")) navigate({ to: "/timeline" });
		};
		rec.start();
	}
	function handleDownloadPdf() {
		if (!query.data) return;
		const doc = new import_jspdf_node_min.jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 15;
		const contentWidth = pageWidth - 2 * margin;
		doc.setFillColor(13, 17, 23);
		doc.rect(0, 0, pageWidth, 40, "F");
		doc.setTextColor(255, 255, 255);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(15);
		doc.text("KARNATAKA STATE POLICE", margin, 18);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(180, 180, 180);
		doc.text("CRIME INTELLIGENCE UNIT · OFFICIAL ANALYSIS REPORT", margin, 25);
		doc.text(`Generated At: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, margin, 32);
		doc.setFillColor(88, 214, 201);
		doc.rect(pageWidth - 35, 10, 20, 20, "F");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(13, 17, 23);
		doc.text("KSP", pageWidth - 32, 22);
		doc.setFontSize(7);
		doc.text("INTEL", pageWidth - 32, 27);
		doc.setTextColor(33, 37, 41);
		let y = 52;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(13);
		doc.text("CRIMESENSE AI intel INVESTIGATION DISCLOSURE", margin, y);
		y += 8;
		doc.setDrawColor(220, 220, 220);
		doc.line(margin, y, pageWidth - margin, y);
		y += 10;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9.5);
		doc.text("SEARCH QUERY INQUIRY PARAMETERS:", margin, y);
		y += 6;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.5);
		doc.setTextColor(90, 90, 90);
		const wrappedQuery = doc.splitTextToSize(question, contentWidth);
		doc.text(wrappedQuery, margin, y);
		y += wrappedQuery.length * 5.5 + 6;
		doc.setFont("helvetica", "bold");
		doc.setTextColor(33, 37, 41);
		doc.setFontSize(9.5);
		doc.text("AI CONTEXTUAL INTEL & INVESTIGATION RECOMMENDATIONS:", margin, y);
		y += 6;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(50, 50, 50);
		const cleanAnswer = query.data.answer.replace(/\*\*/g, "").replace(/###/g, "").replace(/•/g, "-");
		doc.splitTextToSize(cleanAnswer, contentWidth).forEach((line) => {
			if (y > 275) {
				doc.addPage();
				y = 20;
			}
			doc.text(line, margin, y);
			y += 5.5;
		});
		y += 8;
		if (query.data.metrics) {
			if (y > 240) {
				doc.addPage();
				y = 20;
			}
			doc.setFillColor(245, 247, 250);
			doc.rect(margin, y, contentWidth, 26, "F");
			doc.setFont("helvetica", "bold");
			doc.setFontSize(9);
			doc.setTextColor(13, 17, 23);
			doc.text("ANALYTICAL METRICS:", 20, y + 7);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(8);
			doc.setTextColor(80, 80, 80);
			const entries = Object.entries(query.data.metrics).filter(([k]) => k !== "query" && k !== "explanation").slice(0, 4);
			let entryX = 20;
			entries.forEach(([k, v]) => {
				doc.text(`${k.toUpperCase()}: ${v}`, entryX, y + 17);
				entryX += 45;
			});
			y += 34;
		}
		if (query.data.citations && query.data.citations.length > 0) {
			if (y > 270) {
				doc.addPage();
				y = 20;
			}
			doc.setFont("helvetica", "bold");
			doc.setFontSize(9);
			doc.setTextColor(33, 37, 41);
			doc.text("VERIFIED PLATFORM CITATION DATABASE SOURCES:", margin, y);
			y += 5;
			doc.setFont("helvetica", "normal");
			doc.setFontSize(8);
			doc.setTextColor(120, 120, 120);
			doc.text(query.data.citations.join("  |  "), margin, y);
		}
		const totalPages = doc.internal.pages.length - 1;
		for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
			doc.setPage(pageNum);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(7.5);
			doc.setTextColor(150, 150, 150);
			doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 32, 287);
			doc.text("CONFIDENTIAL & PRIVILEGED · KARNATAKA POLICE CRIME RESEARCH DEPT", margin, 287);
		}
		doc.save(`KSP_Intelligence_Report_${Date.now()}.pdf`);
		toast.success("Professional PDF report generated and downloaded!");
	}
	const moduleBadge = {
		sql: "bg-blue-500/15 text-blue-300",
		rag: "bg-purple-500/15 text-purple-300",
		analysis: "bg-teal-500/15 text-teal-300",
		caw: "bg-pink-500/15 text-pink-300",
		general: "bg-white/10 text-muted-foreground"
	};
	const toast = {
		info: (msg) => window.dispatchEvent(new CustomEvent("sonner-toast", { detail: {
			type: "info",
			message: msg
		} })),
		success: (msg) => window.dispatchEvent(new CustomEvent("sonner-toast", { detail: {
			type: "success",
			message: msg
		} })),
		error: (msg) => window.dispatchEvent(new CustomEvent("sonner-toast", { detail: {
			type: "error",
			message: msg
		} }))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-bold text-foreground",
			children: "AI Assistant"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Hybrid AI — routes your question through Text-to-SQL, RAG, or the Analysis Engine automatically."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "glass border-white/10 p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: question,
						onChange: (e) => setQuestion(e.target.value),
						placeholder: "Ask a crime intelligence question...",
						onKeyDown: (e) => e.key === "Enter" && query.refetch(),
						className: "flex-1 bg-white/5 border-white/10 text-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: isListening ? "destructive" : "outline",
								onClick: startSpeechToText,
								className: cn("gap-1.5 min-w-[45px]", isListening && "animate-pulse"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4.5 w-4.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowVoiceSettings(!showVoiceSettings),
								className: cn("min-w-[45px]", voiceEnabled ? "text-accent border-accent/30 bg-accent/5" : "text-muted-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4.5 w-4.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => query.refetch(),
								children: "Ask"
							})
						]
					})]
				}),
				showVoiceSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 animate-fade-in text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground text-xs",
							children: "Speak AI Responses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: "Synthesize and read out response outputs loud automatically"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: voiceEnabled,
							onChange: (e) => {
								setVoiceEnabled(e.target.checked);
								localStorage.setItem("voice_enabled", String(e.target.checked));
								if (!e.target.checked) window.speechSynthesis.cancel();
							},
							className: "rounded border-white/10 h-4 w-4 bg-transparent accent-accent cursor-pointer"
						})]
					}), voiceEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Voice Accent Selection"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedVoiceName,
								onChange: (e) => {
									setSelectedVoiceName(e.target.value);
									localStorage.setItem("voice_name", e.target.value);
								},
								className: "flex h-8 w-full rounded border border-white/10 bg-transparent px-2 text-xs text-foreground focus-visible:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									className: "bg-card",
									children: "Default System Voice"
								}), availableVoices.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: v.name,
									className: "bg-card text-xs",
									children: [
										v.name,
										" (",
										v.lang,
										")"
									]
								}, v.name))]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[10px] uppercase text-muted-foreground flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Voice Speed rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-accent",
									children: [voiceSpeed, "x"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0.5",
								max: "2.0",
								step: "0.1",
								value: voiceSpeed,
								onChange: (e) => {
									const val = Number(e.target.value);
									setVoiceSpeed(val);
									localStorage.setItem("voice_speed", String(val));
								},
								className: "w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 rounded-xl border border-white/10 bg-white/5 p-4",
					children: query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground animate-pulse",
						children: "Thinking…"
					}) : query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-full px-2.5 py-0.5 text-[11px] font-medium ${moduleBadge[query.data.handledBy]}`,
									children: [query.data.handledBy.toUpperCase(), " MODULE"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/15 px-3 py-1 text-xs text-accent",
									children: [
										"Confidence ",
										Math.round(query.data.confidence * 100),
										"%"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleDownloadPdf,
								className: "text-xs gap-1.5 h-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-3.5 w-3.5" }), " PDF"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground whitespace-pre-wrap",
							children: query.data.answer
						}),
						query.data.citations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground",
							children: query.data.citations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-white/10 px-3 py-1",
								children: c
							}, c))
						}),
						query.data.tableRows && query.data.tableRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 animate-fade-in",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-accent",
										children: [
											"Matching Incident Records (",
											query.data.rowsReturned ?? query.data.tableRows.length,
											")"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto max-h-72 overflow-y-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left border-collapse text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
											className: "border-b border-white/10 bg-white/5",
											children: Object.keys(query.data.tableRows[0]).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2 font-medium text-muted-foreground capitalize",
												children: key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()
											}, key))
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: query.data.tableRows.slice(0, 15).map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
											className: "border-b border-white/5 hover:bg-white/5 transition-colors",
											children: Object.values(row).map((val, vIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-foreground truncate max-w-xs",
												children: val === null || val === void 0 ? "-" : typeof val === "boolean" ? val ? "Yes" : "No" : typeof val === "object" ? JSON.stringify(val) : String(val)
											}, vIdx))
										}, idx)) })]
									})
								}),
								query.data.tableRows.length > 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground italic",
									children: [
										"Showing first 15 of ",
										query.data.tableRows.length,
										" records."
									]
								})
							]
						}),
						query.data.showSqlDebug && query.data.handledBy === "sql" && query.data.queryDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSqlCardOpen(!sqlCardOpen),
								className: "flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider",
								children: sqlCardOpen ? "Hide Developer SQL Debug Info" : "[DEV MODE] View Generated SQL & Query Plan"
							}), sqlCardOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3.5 text-xs text-muted-foreground animate-fade-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-amber-400 uppercase block font-semibold",
										children: "Generated PostgreSQL Query"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "p-3 rounded-lg border border-white/10 bg-black/50 text-amber-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap",
										children: query.data.queryDescription
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 grid-cols-2 border-t border-white/10 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase block",
										children: "Execution Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground mt-0.5 block",
										children: [query.data.executionTimeMs ?? query.data.processingTimeMs ?? 0, " ms"]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase block",
										children: "Rows Returned"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground mt-0.5 block",
										children: query.data.rowsReturned ?? query.data.tableRows?.length ?? 0
									})] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-white/5 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setExplainOpen(!explainOpen),
								className: "flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider",
								children: explainOpen ? "Hide Intelligence Details" : "Explain AI Response & Data Context"
							}), explainOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 p-4 rounded-xl border border-white/10 bg-white/3 space-y-3.5 text-xs text-muted-foreground animate-fade-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase block",
											children: "Data Source"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground mt-0.5 block",
											children: query.data.citations?.join(", ") || "Karnataka Crime DB / Documents"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase block",
											children: "Module Used"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground mt-0.5 block",
											children: query.data.handledBy === "sql" ? "Text-to-SQL (Structured)" : query.data.handledBy === "rag" ? "RAG Retrieval (Semantic)" : query.data.handledBy === "analysis" ? "Analysis Engine (Predictive)" : query.data.handledBy === "caw" ? "Crimes Against Women (CAW)" : "General LLM (Conversational)"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase block",
											children: "Confidence Score"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground mt-0.5 block",
											children: [Math.round(query.data.confidence * 100), "%"]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase block",
											children: "Processing Time"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground mt-0.5 block",
											children: [query.data.processingTimeMs ?? 240, " ms"]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase block",
											children: "Timestamp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground mt-0.5 block",
											children: query.data.timestamp ?? (/* @__PURE__ */ new Date()).toLocaleTimeString()
										})] })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 border-t border-white/5 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase block font-semibold",
										children: "Reasoning Steps"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 pl-3 border-l border-white/10",
										children: reasoningSteps.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 items-start text-[11px] leading-relaxed",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-accent font-bold",
												children: [idx + 1, "."]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
										}, idx))
									})]
								})]
							})]
						}),
						query.data.metrics && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricsGrid, { metrics: query.data.metrics }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, { data: query.data.chartData }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotspotMap, { points: query.data.heatmapPoints }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkViz, { data: query.data.networkData })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No answer yet."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground",
						children: "Investigation Recommendations & Follow-Up Inquiries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQuestion(item),
							className: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground hover:bg-white/10",
							children: item
						}, item))
					})]
				})
			]
		})]
	});
}
//#endregion
export { AssistantPage as t };
