import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/network-B9sRmqw2.js
var import_jsx_runtime = require_jsx_runtime();
async function fetchNetwork() {
	const response = await fetch("/api/network");
	if (!response.ok) throw new Error("Unable to load network data");
	return response.json();
}
function NetworkPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["network"],
		queryFn: fetchNetwork
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Loading network graph..."
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "glass border-white/10 p-6 text-sm text-muted-foreground",
		children: "Network graph unavailable."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground",
				children: "Network Analysis"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Neo4j-style relationships between criminals, victims, FIRs, stations, and districts."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: data.highlights.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "glass border-white/10 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl font-bold text-foreground",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "Entities"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: data.nodes.slice(0, 18).map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: node.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								node.type,
								" · ",
								node.district ?? "global"
							]
						})]
					}, node.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "Relationships"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: data.edges.slice(0, 20).map((edge, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: edge.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: edge.target
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/15 px-2 py-0.5 text-xs text-accent",
								children: edge.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs",
								children: ["weight ", edge.weight]
							})
						]
					}, `${edge.source}-${edge.target}-${index}`))
				})]
			})
		]
	});
}
var SplitComponent = NetworkPage;
//#endregion
export { SplitComponent as component };
