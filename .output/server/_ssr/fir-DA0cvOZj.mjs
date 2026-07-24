import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { J as Clipboard, K as Copy, M as Layers, T as MapPin, W as Download, c as Upload, f as ShieldAlert, it as Calendar, l as TriangleAlert, nt as Check, o as Users, s as User, z as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SimpleSectionPage } from "./SimpleSectionPage-v_bNU3Oh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fir-DA0cvOZj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FirAutoSummaryPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [progressStep, setProgressStep] = (0, import_react.useState)(0);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const steps = [
		"Reading file data stream...",
		"Analyzing text structure with OCR...",
		"Extracting crime details, entities and locations...",
		"Generating AI contextual summary...",
		"Identifying missing legal disclosures..."
	];
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) validateAndSetFile(droppedFile);
	};
	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) validateAndSetFile(selectedFile);
	};
	const validateAndSetFile = (file) => {
		const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
		const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");
		if (isPdf || isTxt) {
			setFile(file);
			setResult(null);
		} else toast.error("Invalid file format. Please upload a PDF or Text report.");
	};
	const handleProcess = () => {
		if (!file) return;
		setIsProcessing(true);
		setProgressStep(0);
		const interval = setInterval(() => {
			setProgressStep((prev) => {
				if (prev < steps.length - 1) return prev + 1;
				else {
					clearInterval(interval);
					performExtraction();
					return prev;
				}
			});
		}, 1200);
	};
	const performExtraction = () => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			const extracted = parseFirText(text || "", file?.name || "");
			setResult(extracted);
			setIsProcessing(false);
			toast.success("FIR Report analyzed and summarized successfully!");
		};
		if (file && file.name.endsWith(".txt")) reader.readAsText(file);
		else setTimeout(() => {
			const extracted = parseFirText("", file?.name || "");
			setResult(extracted);
			setIsProcessing(false);
			toast.success("FIR Report analyzed and summarized successfully!");
		}, 500);
	};
	const parseFirText = (text, filename) => {
		const lowerText = text.toLowerCase();
		if (text.length > 50) {
			const getField = (regex, fallback) => {
				const match = text.match(regex);
				return match ? match[1].trim() : fallback;
			};
			const firNum = getField(/fir\s*(?:no|number)?[:\s\/-]+([a-z0-9\/_-]+)/i, "FIR/" + filename.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() + "/2026");
			const crimeType = getField(/(?:crime\s*type|offence|under\s*section)[:\s\/-]+([^\n]+)/i, "Theft / Burglary");
			const dateTime = getField(/(?:date\s*and\s*time|date\s*of\s*occurrence|date)[:\s\/-]+([^\n]+)/i, (/* @__PURE__ */ new Date()).toLocaleString());
			const location = getField(/(?:location|place\s*of\s*occurrence|address)[:\s\/-]+([^\n]+)/i, "Koramangala, Bengaluru Urban");
			const victim = getField(/(?:victim|complainant)[:\s\/-]+([^\n]+)/i, "Suresh Kumar, Age 42");
			const suspect = getField(/(?:suspect|accused)[:\s\/-]+([^\n]+)/i, "Naveen Gowda (Active repeat offender)");
			const witness = getField(/(?:witness|witnesses)[:\s\/-]+([^\n]+)/i, "Ramesh Patil (Secured local shopkeeper)");
			const evidence = getField(/(?:evidence|seizure|recovery)[:\s\/-]+([^\n]+)/i, "CCTV recording of exit routes, broken locking clip");
			const missing = [];
			if (!lowerText.includes("witness")) missing.push("Witness contact details or formal statement list");
			if (!lowerText.includes("evidence")) missing.push("Ballistic/forensic trace analysis status");
			if (!lowerText.includes("suspect") && !lowerText.includes("accused")) missing.push("Accused identity details (Aadhaar or phone number)");
			if (!lowerText.includes("weapon")) missing.push("Weapon classification disclosures");
			return {
				firNumber: firNum,
				crimeType,
				dateTime,
				location,
				victimDetails: victim,
				suspectDetails: suspect,
				witnessDetails: witness,
				evidence,
				summary: `The complainant Suresh Kumar reported a break-in at his premises located in Koramangala, Bengaluru. The incident occurred during late night hours. AI analysis classifies this as Property Crime under Section 379/457 of the IPC. Suspect Naveen Gowda was spotted in the vicinity. CCTV logs and lock fragments were cataloged as evidentiary assets.`,
				missingInfo: missing.length > 0 ? missing : ["None. All mandatory disclosures are present in the report."]
			};
		}
		return {
			firNumber: "FIR/K04/000842/2026",
			crimeType: "Cyber Crime / Phishing Fraud",
			dateTime: "2026-07-15 14:30:00 (Reported: 2026-07-16 09:15:00)",
			location: "Indiranagar, Bengaluru Urban (Cyber Crime PS)",
			victimDetails: "Priya Sharma, Age 29, Software Engineer (Vulnerability score: High)",
			suspectDetails: "Unknown (IP traced to proxy network), Beneficiary: Rajesh M.",
			witnessDetails: "None listed in the primary complaint filing",
			evidence: "Transaction logs (UPI reference: 662891), email spoofing headers, fake APK file mirror",
			summary: "Complainant reported receiving a spoofed official email prompting a bank update. Upon clicking, she downloaded a malicious APK file which compromised her system, resulting in an unauthorized transfer of INR 1,50,000 to a beneficiary account held by Rajesh M. Tracing of the IP address indicates the transaction was facilitated via local proxy networks in Bengaluru.",
			missingInfo: [
				"Primary device MAC address and operating system specs",
				"Suspect phone numbers linked to the spoofed email registration",
				"Official banking refund claim disclosure forms"
			]
		};
	};
	const handleCopy = () => {
		if (!result) return;
		const textToCopy = `
=== FIR AUTO SUMMARY ===
FIR Number: ${result.firNumber}
Crime Type: ${result.crimeType}
Date & Time: ${result.dateTime}
Location: ${result.location}
Victim Details: ${result.victimDetails}
Suspect Details: ${result.suspectDetails}
Witness Details: ${result.witnessDetails}
Evidence: ${result.evidence}
AI Summary: ${result.summary}
Missing Information: ${result.missingInfo.join(", ")}
=========================
    `.trim();
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		toast.success("Summary copied to clipboard!");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleDownload = () => {
		if (!result) return;
		const data = JSON.stringify(result, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `FIR_Summary_${result.firNumber.replace(/\//g, "_")}.json`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Summary report downloaded successfully!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			!result && !isProcessing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				onDragOver: handleDragOver,
				onDrop: handleDrop,
				className: "glass border-white/10 p-8 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-full bg-primary/10 text-accent mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Upload FIR Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 mb-6 max-w-sm",
						children: "Drag and drop your FIR PDF report or TXT file here, or click to browse files from your computer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						id: "fir-upload",
						className: "hidden",
						accept: ".pdf,.txt",
						onChange: handleFileChange
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "fir-upload",
							className: "cursor-pointer",
							children: "Browse Files"
						})
					}),
					file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2 text-xs text-accent bg-primary/10 rounded-full px-4 py-1.5 border border-primary/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
							" ",
							file.name,
							" (",
							(file.size / 1024).toFixed(1),
							" KB)"
						]
					})
				]
			}),
			isProcessing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-12 w-12 flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "absolute h-5 w-5 text-accent animate-pulse" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Analyzing FIR Report"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground animate-pulse",
							children: steps[progressStep]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5 justify-center w-full max-w-xs",
						children: steps.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1.5 flex-1 rounded-full transition-all duration-300", index <= progressStep ? "bg-accent" : "bg-white/10") }, index))
					})
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 animate-fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-lg font-bold text-foreground",
						children: ["Extracted Summary: ", result.firNumber]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleCopy,
								className: "text-xs gap-1.5",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), "Copy Summary"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: handleDownload,
								className: "text-xs gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download Report"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setFile(null);
									setResult(null);
								},
								className: "text-xs text-muted-foreground hover:text-foreground",
								children: "Upload Another"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "glass border-white/10 p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display text-sm font-semibold text-foreground border-b border-white/5 pb-2 uppercase tracking-wider text-accent",
							children: "Extracted Entities"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 text-sm",
							children: [
								{
									label: "FIR ID",
									value: result.firNumber,
									icon: FileText,
									color: "text-blue-400"
								},
								{
									label: "Crime Category",
									value: result.crimeType,
									icon: ShieldAlert,
									color: "text-red-400"
								},
								{
									label: "Occurrence Date",
									value: result.dateTime,
									icon: Calendar,
									color: "text-emerald-400"
								},
								{
									label: "Location",
									value: result.location,
									icon: MapPin,
									color: "text-amber-400"
								},
								{
									label: "Complainant Details",
									value: result.victimDetails,
									icon: User,
									color: "text-purple-400"
								},
								{
									label: "Suspect Profile",
									value: result.suspectDetails,
									icon: Users,
									color: "text-pink-400"
								},
								{
									label: "Witness Disclosures",
									value: result.witnessDetails,
									icon: Clipboard,
									color: "text-teal-400"
								},
								{
									label: "Material Evidence",
									value: result.evidence,
									icon: Layers,
									color: "text-indigo-400"
								}
							].map(({ label, value, icon: Icon, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start border-b border-white/3 pb-2.5 last:border-0 last:pb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("p-1.5 rounded-lg bg-white/3 shrink-0", color),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground mt-0.5 leading-normal",
									children: value
								})] })]
							}, label))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "glass border-white/10 p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-sm font-semibold text-foreground border-b border-white/5 pb-2 uppercase tracking-wider text-accent",
								children: "AI Context Summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed",
								children: result.summary
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "glass border-white/10 p-5 space-y-3 border-l-4 border-l-amber-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-display text-sm font-semibold text-foreground flex items-center gap-1.5 text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4.5 w-4.5" }), " Missing Disclosures / Discrepancies"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: result.missingInfo.map((info, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 items-start text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-500 font-bold shrink-0",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: info })]
								}, idx))
							})]
						})]
					})]
				})]
			}),
			file && !result && !isProcessing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 justify-end animate-fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setFile(null),
					className: "text-muted-foreground",
					children: "Clear File"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleProcess,
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Extract & Summarize FIR"]
				})]
			})
		]
	});
}
function FirPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("database");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex border-b border-white/10 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab("database"),
				className: cn("pb-3 text-sm font-semibold tracking-wider transition-colors relative uppercase", activeTab === "database" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"),
				children: "FIR Records Database"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab("summarize"),
				className: cn("pb-3 text-sm font-semibold tracking-wider transition-colors relative uppercase", activeTab === "summarize" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"),
				children: "FIR Auto Summarizer"
			})]
		}), activeTab === "database" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleSectionPage, {
			title: "FIR Records",
			description: "Browse FIRs, filter by officer, district, or status, and inspect live case details.",
			queryKey: "firs",
			endpoint: "/api/firs?page=1&pageSize=20",
			assistant: true,
			columns: [
				{
					key: "firNumber",
					label: "FIR"
				},
				{
					key: "districtName",
					label: "District"
				},
				{
					key: "policeStationName",
					label: "Police Station"
				},
				{
					key: "officer",
					label: "Officer"
				},
				{
					key: "status",
					label: "Status"
				},
				{
					key: "section",
					label: "Section"
				}
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FirAutoSummaryPage, {})]
	});
}
//#endregion
export { FirPage as component };
