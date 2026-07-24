import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { F as Image, H as Eye, Q as CircleAlert, R as File, W as Download, _ as Plus, a as Video, d as ShieldCheck, it as Calendar, m as Search, q as Clock, s as User, t as X, v as Paperclip, z as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-DAKNUJE3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_EVIDENCE = [
	{
		id: "EVID-000842-1",
		firNumber: "FIR/K04/000842/2026",
		caseId: "CASE/K04/000001",
		evidenceType: "Image",
		description: "Screenshots of fake bank page login screen used for phishing transfer",
		uploadedBy: "Inspector Rajesh Kumar",
		dateTime: "2026-07-15 14:45:00",
		verificationStatus: "Verified",
		aiSummary: "AI Summary: Scanned spoofed portal asset. Image metadata geolocation coordinates match suspect active IP ranges in Indiranagar.",
		fileName: "phishing_portal_ss.jpg",
		fileSize: "245 KB"
	},
	{
		id: "EVID-000842-2",
		firNumber: "FIR/K04/000842/2026",
		caseId: "CASE/K04/000001",
		evidenceType: "Document",
		description: "UPI reference transactions log bank statement (Ref: 662891)",
		uploadedBy: "SI Patil",
		dateTime: "2026-07-16 09:30:00",
		verificationStatus: "Verified",
		aiSummary: "AI Summary: UPI ledger entry scanned. Confirms transfer of INR 1,50,000 from victim's account to target beneficiary Rajesh M.",
		fileName: "upi_transfer_ledger.txt",
		fileSize: "45 KB"
	},
	{
		id: "EVID-000001-1",
		firNumber: "FIR/K01/000001/2026",
		caseId: "CASE/K01/000001",
		evidenceType: "Video",
		description: "CCTV surveillance footage of back exit gate showing suspect escaping",
		uploadedBy: "SI Patil",
		dateTime: "2026-07-16 10:10:00",
		verificationStatus: "Pending",
		aiSummary: "AI Summary: Thermal night footage parsed. Suspect physical height matches repeat offender database profiles. Face match pending HD resolution.",
		fileName: "cctv_back_exit_loop.mp4",
		fileSize: "14.2 MB"
	},
	{
		id: "EVID-000001-2",
		firNumber: "FIR/K01/000001/2026",
		caseId: "CASE/K01/000001",
		evidenceType: "PDF",
		description: "Forensic fingerprint lifts report from locking clip fragments",
		uploadedBy: "Inspector Rajesh Kumar",
		dateTime: "2026-07-16 10:45:00",
		verificationStatus: "Verified",
		aiSummary: "AI Summary: Latent prints scanned. Lifts matched with 96% accuracy index against Aadhaar ID print files for suspect Naveen Gowda.",
		fileName: "latent_fingerprints_lift.pdf",
		fileSize: "1.8 MB"
	}
];
function EvidencePage() {
	const [evidenceList, setEvidenceList] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("All");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [uploadModalOpen, setUploadModalOpen] = (0, import_react.useState)(false);
	const [viewingEvidence, setViewingEvidence] = (0, import_react.useState)(null);
	const [formFir, setFormFir] = (0, import_react.useState)("");
	const [formCase, setFormCase] = (0, import_react.useState)("");
	const [formType, setFormType] = (0, import_react.useState)("Image");
	const [formDesc, setFormDesc] = (0, import_react.useState)("");
	const [formFile, setFormFile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("ksp_evidence");
		if (stored) setEvidenceList(JSON.parse(stored));
		else {
			localStorage.setItem("ksp_evidence", JSON.stringify(INITIAL_EVIDENCE));
			setEvidenceList(INITIAL_EVIDENCE);
		}
	}, []);
	const saveEvidence = (list) => {
		setEvidenceList(list);
		localStorage.setItem("ksp_evidence", JSON.stringify(list));
	};
	const existingFirOptions = [
		"FIR/K04/000842/2026",
		"FIR/K01/000001/2026",
		"FIR/M01/000213/2026"
	];
	const existingCaseOptions = [
		"CASE/K04/000001",
		"CASE/K01/000001",
		"CASE/M01/000213"
	];
	const filteredEvidence = (0, import_react.useMemo)(() => {
		return evidenceList.filter((e) => {
			const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.firNumber.toLowerCase().includes(search.toLowerCase()) || e.caseId.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
			const matchType = typeFilter === "All" || e.evidenceType === typeFilter;
			const matchStatus = statusFilter === "All" || e.verificationStatus === statusFilter;
			return matchSearch && matchType && matchStatus;
		});
	}, [
		evidenceList,
		search,
		typeFilter,
		statusFilter
	]);
	const handleUploadSubmit = (e) => {
		e.preventDefault();
		if (!formFir || !formCase || !formDesc) {
			toast.error("Please fill in all mandatory metadata fields.");
			return;
		}
		const nextIdx = evidenceList.length + 1;
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
		const filename = formFile?.name ?? `evidence_upload_${nextIdx}.${formType === "PDF" ? "pdf" : formType === "Video" ? "mp4" : formType === "Document" ? "txt" : "jpg"}`;
		const fileSizeStr = formFile ? `${(formFile.size / 1024).toFixed(1)} KB` : "120 KB";
		let aiSummary = `AI Summary: Automatically ingested ${formType} asset. `;
		if (formType === "Image") aiSummary += "Parsed EXIF data. Geolocation matches crime district bounding box.";
		else if (formType === "PDF" || formType === "Document") aiSummary += "Optical character scanning scanned terms. Text highlights entities relevant to Case file.";
		else aiSummary += "Frame timeline scan complete. Low manipulation probability index detected.";
		const updated = [{
			id: `EVID-${formCase.split("/").pop() || "000000"}-${nextIdx}`,
			firNumber: formFir,
			caseId: formCase,
			evidenceType: formType,
			description: formDesc,
			uploadedBy: "Inspector Rajesh Kumar",
			dateTime: dateStr,
			verificationStatus: "Pending",
			aiSummary,
			fileName: filename,
			fileSize: fileSizeStr
		}, ...evidenceList];
		saveEvidence(updated);
		setUploadModalOpen(false);
		toast.success("Evidence asset registered and queued for AI verification!");
		setFormFir("");
		setFormCase("");
		setFormDesc("");
		setFormFile(null);
	};
	const handleToggleStatus = (id, nextStatus) => {
		const updated = evidenceList.map((e) => e.id === id ? {
			...e,
			verificationStatus: nextStatus
		} : e);
		saveEvidence(updated);
		toast.success(`Evidence status updated to: ${nextStatus}`);
	};
	const getEvidenceIcon = (type) => {
		switch (type) {
			case "Image": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4.5 w-4.5 text-pink-400" });
			case "PDF": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4.5 w-4.5 text-red-400" });
			case "Video": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4.5 w-4.5 text-amber-400" });
			case "Document": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-4.5 w-4.5 text-blue-400" });
		}
	};
	const handleDownload = (ev) => {
		const data = JSON.stringify(ev, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ksp_evidence_${ev.id}.json`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Downloaded asset report for ${ev.id}`);
	};
	const selectedCaseTimeline = (0, import_react.useMemo)(() => {
		if (filteredEvidence.length === 0) return [];
		return [...filteredEvidence].filter((e) => e.caseId).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
	}, [filteredEvidence]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-2xl font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-6 w-6 text-accent" }), " Evidence Management"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Register, verify, and examine digital evidence records linked to FIR complaints."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setUploadModalOpen(true),
					className: "gap-1.5 uppercase font-bold text-xs tracking-wider",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Upload Evidence"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "glass border-white/10 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Search details / FIR / Case"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search...",
									className: "pl-9 bg-white/5 border-white/10"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Evidence Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: typeFilter,
								onChange: (e) => setTypeFilter(e.target.value),
								className: "flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All",
										className: "bg-card",
										children: "All Types"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Image",
										className: "bg-card",
										children: "Image"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "PDF",
										className: "bg-card",
										children: "PDF"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Video",
										className: "bg-card",
										children: "Video"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Document",
										className: "bg-card",
										children: "Document"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Verification Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								className: "flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All",
										className: "bg-card",
										children: "All Statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Pending",
										className: "bg-card",
										children: "Pending Verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Verified",
										className: "bg-card",
										children: "Verified"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Rejected",
										className: "bg-card",
										children: "Rejected"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setSearch("");
								setTypeFilter("All");
								setStatusFilter("All");
							},
							className: "text-xs text-muted-foreground hover:text-foreground h-9",
							children: "Clear Filters"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold",
						children: [
							"Evidence Library (",
							filteredEvidence.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-3",
										children: "Asset / ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-3",
										children: "FIR & Case"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-3",
										children: "Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-3",
										children: "Verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-3 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-white/5",
								children: filteredEvidence.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 5,
									className: "py-6 text-center text-xs text-muted-foreground italic",
									children: "No evidence records cataloged."
								}) }) : filteredEvidence.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-foreground/90 hover:bg-white/2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-1.5 rounded bg-white/5 border border-white/8 shrink-0",
													children: getEvidenceIcon(ev.evidenceType)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground text-xs block",
													children: ev.id
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground",
													children: [
														ev.fileName,
														" (",
														ev.fileSize,
														")"
													]
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-accent text-xs block",
												children: ev.firNumber
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: ev.caseId
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3 max-w-[200px] truncate text-xs text-muted-foreground",
											children: ev.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold border", ev.verificationStatus === "Verified" ? "bg-success/10 border-success/20 text-green-400" : ev.verificationStatus === "Rejected" ? "bg-destructive/10 border-destructive/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"),
												children: ev.verificationStatus
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setViewingEvidence(ev),
													className: "p-1 rounded bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
													title: "Inspect Evidence",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleDownload(ev),
													className: "p-1 rounded bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
													title: "Download Record",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
												})]
											})
										})
									]
								}, ev.id))
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4.5 w-4.5 text-accent" }), " Evidence timeline"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Historical order of uploads compiled for selected case investigations."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative pl-4 border-l border-white/15 space-y-5 mt-4",
							children: selectedCaseTimeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground italic",
								children: "Filter cases in search to build timeline."
							}) : selectedCaseTimeline.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded bg-white/3 p-2.5 border border-white/5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center text-[10px] text-accent mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: item.dateTime.split(" ")[0]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-white/5 px-1 py-0.5 border border-white/5 text-[8px]",
												children: item.evidenceType
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground text-xs leading-tight mb-1",
											children: item.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground text-[11px] leading-snug",
											children: item.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground/80 mt-1 italic",
											children: item.uploadedBy
										})
									]
								})]
							}, item.id))
						})
					]
				})]
			}),
			uploadModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 w-full max-w-lg p-6 space-y-4 relative animate-scale-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUploadModalOpen(false),
							className: "absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Upload Evidence Asset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Provide investigation references, target FIR filings, and upload files."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleUploadSubmit,
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-muted-foreground block font-medium",
											children: "FIR Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: formFir,
											onChange: (e) => setFormFir(e.target.value),
											required: true,
											className: "flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												className: "bg-card",
												children: "Select FIR..."
											}), existingFirOptions.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: f,
												className: "bg-card",
												children: f
											}, f))]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-muted-foreground block font-medium",
											children: "Case ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: formCase,
											onChange: (e) => setFormCase(e.target.value),
											required: true,
											className: "flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												className: "bg-card",
												children: "Select Case..."
											}), existingCaseOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												className: "bg-card",
												children: c
											}, c))]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-muted-foreground block font-medium",
											children: "Evidence Asset Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: formType,
											onChange: (e) => setFormType(e.target.value),
											className: "flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Image",
													className: "bg-card",
													children: "Image (JPG/PNG)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PDF",
													className: "bg-card",
													children: "PDF Document"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Video",
													className: "bg-card",
													children: "Video (MP4)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Document",
													className: "bg-card",
													children: "Document (TXT)"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-muted-foreground block font-medium",
											children: "Attach File Asset"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											onChange: (e) => setFormFile(e.target.files?.[0] ?? null),
											className: "flex h-9 w-full rounded border border-white/10 bg-transparent px-2.5 py-1 file:bg-white/5 file:border-0 file:rounded file:text-foreground file:text-xs file:font-semibold text-muted-foreground focus-visible:outline-none"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-muted-foreground block font-medium",
										children: "Description / Legal Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: formDesc,
										onChange: (e) => setFormDesc(e.target.value),
										placeholder: "Details concerning item recovery, parameters, location matching...",
										required: true,
										rows: 3,
										className: "flex w-full rounded border border-white/10 bg-transparent px-3 py-2 text-foreground focus-visible:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 justify-end pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										onClick: () => setUploadModalOpen(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										children: "Upload & Classify"
									})]
								})
							]
						})
					]
				})
			}),
			viewingEvidence && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 w-full max-w-2xl p-6 space-y-5 relative animate-scale-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setViewingEvidence(null),
							className: "absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded bg-accent/15 border border-accent/20 text-accent",
								children: getEvidenceIcon(viewingEvidence.evidenceType)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-base font-bold text-foreground",
								children: ["Asset Review: ", viewingEvidence.id]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Verification status review dashboard"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden",
							children: viewingEvidence.evidenceType === "Image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full w-full bg-cover bg-center flex flex-col justify-end p-4 bg-white/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-black/70 backdrop-blur border border-white/10 rounded-lg p-3 max-w-xs space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-xs text-foreground",
										children: "phishing_portal_ss.jpg"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "Traced: Bangalore Cyber PS logs"
									})]
								})
							}) : viewingEvidence.evidenceType === "Video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-full w-full flex flex-col justify-center items-center text-center p-4 bg-white/3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-10 w-10 text-amber-400 mb-2 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-foreground",
										children: "cctv_back_exit_loop.mp4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: "Night loop · Segment recovery verified"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-full w-full flex flex-col justify-center items-center text-center p-4 bg-white/3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-accent mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-foreground",
										children: viewingEvidence.fileName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: [
											"Scan text: \"",
											viewingEvidence.description.slice(0, 80),
											"...\""
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold uppercase tracking-wider text-accent text-[10px]",
									children: "Asset File Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "inline-block h-3.5 w-3.5 mr-1" }),
												" Filed At:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: viewingEvidence.dateTime
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "inline-block h-3.5 w-3.5 mr-1" }),
												" Ingested By:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: viewingEvidence.uploadedBy
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "inline-block h-3.5 w-3.5 mr-1" }),
												" Linked FIR:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-semibold",
													children: viewingEvidence.firNumber
												})
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold uppercase tracking-wider text-accent text-[10px]",
									children: "AI Scanner Analysis"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3 rounded-lg bg-white/3 border border-white/5 text-[11px] text-muted-foreground leading-relaxed",
									children: viewingEvidence.aiSummary
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-white/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground self-center uppercase font-bold tracking-wider",
									children: "Verification status:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded px-2 py-0.5 text-[10px] font-bold border", viewingEvidence.verificationStatus === "Verified" ? "bg-success/15 border-success/20 text-green-400" : viewingEvidence.verificationStatus === "Rejected" ? "bg-destructive/15 border-destructive/20 text-red-400" : "bg-amber-500/15 border-amber-500/20 text-amber-400"),
									children: viewingEvidence.verificationStatus
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									viewingEvidence.verificationStatus !== "Verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => {
											handleToggleStatus(viewingEvidence.id, "Verified");
											setViewingEvidence(null);
										},
										className: "bg-green-600 hover:bg-green-500 text-white gap-1 text-[10px] h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Mark Verified"]
									}),
									viewingEvidence.verificationStatus !== "Rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "destructive",
										onClick: () => {
											handleToggleStatus(viewingEvidence.id, "Rejected");
											setViewingEvidence(null);
										},
										className: "gap-1 text-[10px] h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), " Mark Rejected"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setViewingEvidence(null),
										className: "h-8",
										children: "Close"
									})
								]
							})]
						})
					]
				})
			})
		]
	});
}
var SplitComponent = EvidencePage;
//#endregion
export { SplitComponent as component };
