import { t as cn } from "./utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-C7sdeU2K.js
var import_jsx_runtime = require_jsx_runtime();
async function fetchMap() {
	const response = await fetch("/api/map");
	if (!response.ok) throw new Error("Unable to load map data");
	return response.json();
}
function CrimeMapPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["map"],
		queryFn: fetchMap
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Loading map data..."
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Map data unavailable."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-bold text-foreground",
			children: "Crime Map"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Leaflet-ready hotspot and marker feed for Karnataka district visualization."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-5 xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "Hotspots"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: data.heatmapPoints.slice(0, 18).map((point, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: point.district
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: point.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									point.lat.toFixed(2),
									", ",
									point.lng.toFixed(2)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-2 rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 rounded-full bg-accent",
									style: { width: `${Math.round(point.intensity * 100)}%` }
								})
							})
						]
					}, `${point.district}-${index}`))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "Districts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: data.districts.slice(0, 10).map((district) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: district.name
							}), district.riskLevel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider", district.riskLevel === "High" ? "bg-red-500/15 text-red-400 border border-red-500/10" : district.riskLevel === "Medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/10" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"),
								children: [
									district.riskScore,
									" ",
									district.riskLevel[0]
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								district.crimeCount,
								" crimes · ",
								district.hotspotCount,
								" hotspots ·",
								" ",
								district.policeStationCount,
								" stations"
							]
						})]
					}, district.name))
				})]
			})]
		})]
	});
}
function MapRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrimeMapPage, {});
}
//#endregion
export { MapRoute as component };
