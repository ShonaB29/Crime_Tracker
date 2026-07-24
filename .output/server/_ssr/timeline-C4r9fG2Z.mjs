import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as History, O as Lock, h as Scale, it as Calendar, k as LockOpen, m as Search, s as User, ut as BadgeAlert, z as FileText } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-C4r9fG2Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function fetchTimelines() {
	const response = await fetch("/api/timeline");
	if (!response.ok) throw new Error("Unable to load timeline data");
	return response.json();
}
function CriminalTimelinePage() {
	const { data: profiles = [], isLoading, error } = useQuery({
		queryKey: ["timelines"],
		queryFn: fetchTimelines
	});
	const [selectedProfileId, setSelectedProfileId] = (0, import_react.useState)(null);
	const [searchName, setSearchName] = (0, import_react.useState)("");
	const [filterFir, setFilterFir] = (0, import_react.useState)("");
	const [filterCrimeType, setFilterCrimeType] = (0, import_react.useState)("");
	const [filterYear, setFilterYear] = (0, import_react.useState)("");
	const allFirs = (0, import_react.useMemo)(() => {
		const firs = /* @__PURE__ */ new Set();
		profiles.forEach((p) => {
			p.timeline.forEach((e) => {
				if (e.firNumber && e.firNumber !== "N/A") firs.add(e.firNumber);
			});
		});
		return Array.from(firs).sort();
	}, [profiles]);
	const allCrimeTypes = (0, import_react.useMemo)(() => {
		const types = /* @__PURE__ */ new Set();
		profiles.forEach((p) => {
			p.timeline.forEach((e) => {
				if (e.crimeType) types.add(e.crimeType);
			});
		});
		return Array.from(types).sort();
	}, [profiles]);
	const allYears = (0, import_react.useMemo)(() => {
		const years = /* @__PURE__ */ new Set();
		profiles.forEach((p) => {
			p.timeline.forEach((e) => {
				const year = new Date(e.date).getFullYear().toString();
				if (year && year !== "NaN") years.add(year);
			});
		});
		return Array.from(years).sort((a, b) => b.localeCompare(a));
	}, [profiles]);
	const filteredProfiles = (0, import_react.useMemo)(() => {
		return profiles.filter((p) => {
			if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;
			if (filterFir || filterCrimeType || filterYear) {
				if (!p.timeline.some((e) => {
					const matchFir = !filterFir || e.firNumber === filterFir;
					const matchType = !filterCrimeType || e.crimeType === filterCrimeType;
					const matchYear = !filterYear || new Date(e.date).getFullYear().toString() === filterYear;
					return matchFir && matchType && matchYear;
				})) return false;
			}
			return true;
		});
	}, [
		profiles,
		searchName,
		filterFir,
		filterCrimeType,
		filterYear
	]);
	const selectedProfile = (0, import_react.useMemo)(() => {
		if (selectedProfileId) {
			const match = profiles.find((p) => p.id === selectedProfileId);
			if (match) return match;
		}
		return filteredProfiles[0] ?? null;
	}, [
		profiles,
		selectedProfileId,
		filteredProfiles
	]);
	const handleResetFilters = () => {
		setSearchName("");
		setFilterFir("");
		setFilterCrimeType("");
		setFilterYear("");
	};
	const getEventIcon = (type) => {
		switch (type) {
			case "crime": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeAlert, { className: "h-4.5 w-4.5 text-red-400" });
			case "fir": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4.5 w-4.5 text-blue-400" });
			case "arrest": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4.5 w-4.5 text-amber-400" });
			case "court": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4.5 w-4.5 text-purple-400" });
			case "bail": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-4.5 w-4.5 text-emerald-400" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4.5 w-4.5 text-muted-foreground" });
		}
	};
	const getEventColor = (type) => {
		switch (type) {
			case "crime": return "border-red-500/30 bg-red-500/10 text-red-400";
			case "fir": return "border-blue-500/30 bg-blue-500/10 text-blue-400";
			case "arrest": return "border-amber-500/30 bg-amber-500/10 text-amber-400";
			case "court": return "border-purple-500/30 bg-purple-500/10 text-purple-400";
			case "bail": return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
			default: return "border-white/10 bg-white/5 text-muted-foreground";
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Loading criminal profiles..."
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Unable to load timeline records."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground",
				children: "Criminal Timeline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Track dynamic criminal records, history timelines, court trials, and status updates."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "glass border-white/10 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Search Criminal Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: searchName,
									onChange: (e) => setSearchName(e.target.value),
									placeholder: "Search...",
									className: "pl-9 bg-white/5 border-white/10"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "FIR Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filterFir,
								onChange: (e) => setFilterFir(e.target.value),
								className: "flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									className: "bg-card",
									children: "All FIRs"
								}), allFirs.map((fir) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: fir,
									className: "bg-card",
									children: fir
								}, fir))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Crime Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filterCrimeType,
								onChange: (e) => setFilterCrimeType(e.target.value),
								className: "flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									className: "bg-card",
									children: "All Types"
								}), allCrimeTypes.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: type,
									className: "bg-card",
									children: type
								}, type))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filterYear,
								onChange: (e) => setFilterYear(e.target.value),
								className: "flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									className: "bg-card",
									children: "All Years"
								}), allYears.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: year,
									className: "bg-card",
									children: year
								}, year))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleResetFilters,
							className: "h-9 rounded border border-white/10 bg-white/5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors",
							children: "Reset Filters"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 p-5 space-y-4 max-h-[600px] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold",
						children: [
							"Criminals (",
							filteredProfiles.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: filteredProfiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground italic",
							children: "No criminals match filters."
						}) : filteredProfiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedProfileId(p.id),
							className: cn("w-full text-left rounded-xl border p-3 transition-all", selectedProfile?.id === p.id ? "border-accent bg-primary/10 shadow-md" : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground text-sm",
										children: p.name
									}), p.repeatOffender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-red-500/10 border border-red-500/25 px-1 py-0.5 text-[9px] font-semibold text-red-400",
										children: "REPEAT"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: [
										"Age ",
										p.age,
										" · ",
										p.gender,
										" · ",
										p.totalCrimes,
										" cases"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground/80 mt-1 truncate",
									children: ["MO: ", p.modusOperandi]
								})
							]
						}, p.id))
					})]
				}), selectedProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "glass border-white/10 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl font-bold text-foreground",
											children: selectedProfile.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Accused ID:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: selectedProfile.id
											}),
											" · Status:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: selectedProfile.status
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Modus Operandi:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "italic text-foreground",
												children: selectedProfile.modusOperandi
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left sm:text-right space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Demographics"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium text-foreground",
										children: [
											"Age ",
											selectedProfile.age,
											" · ",
											selectedProfile.gender
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: [
											"Risk classification:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("font-bold", selectedProfile.repeatOffender ? "text-red-400" : "text-amber-400"),
												children: selectedProfile.repeatOffender ? "High (Repeat)" : "Medium"
											})
										]
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "glass border-white/10 p-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-semibold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-5 w-5 text-accent" }), " Interactive Criminal History Timeline"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative pl-6 border-l border-white/15 space-y-8 mt-4",
							children: selectedProfile.timeline.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("absolute -left-[38px] top-1 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110", getEventColor(event.type)),
									children: getEventIcon(event.type)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/10 bg-white/3 p-4 hover:border-white/20 hover:bg-white/5 transition-all",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-bold text-accent uppercase tracking-widest flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
													" ",
													new Date(event.date).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-muted-foreground",
												children: event.firNumber !== "N/A" ? `FIR: ${event.firNumber}` : `Crime Type: ${event.crimeType}`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display text-sm font-semibold text-foreground mb-1",
											children: event.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-normal",
											children: event.description
										})
									]
								})]
							}, event.id))
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "glass border-white/10 p-6 text-center text-sm text-muted-foreground",
					children: "No profile details available."
				})]
			})
		]
	});
}
var SplitComponent = CriminalTimelinePage;
//#endregion
export { SplitComponent as component };
