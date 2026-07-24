import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SimpleSectionPage-v_bNU3Oh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimpleSectionPage({ title, description, queryKey, endpoint, assistant = false, columns = [] }) {
	const { data, isLoading, error } = useQuery({
		queryKey: [queryKey],
		queryFn: async () => {
			const response = await fetch(endpoint);
			if (!response.ok) throw new Error(`Unable to load ${title}`);
			return response.json();
		}
	});
	const rows = (0, import_react.useMemo)(() => {
		if (!data) return [];
		if (Array.isArray(data)) return data;
		if (Array.isArray(data.items)) return data.items;
		if (Array.isArray(data.reports)) return data.reports;
		return [];
	}, [data]);
	const [assistantQuestion, setAssistantQuestion] = (0, import_react.useState)("Tell me about these records");
	const [assistantAnswer, setAssistantAnswer] = (0, import_react.useState)(null);
	const [assistantConfidence, setAssistantConfidence] = (0, import_react.useState)(null);
	const [assistantCitations, setAssistantCitations] = (0, import_react.useState)(null);
	const [assistantLoading, setAssistantLoading] = (0, import_react.useState)(false);
	const [assistantError, setAssistantError] = (0, import_react.useState)(null);
	async function askAssistant() {
		setAssistantLoading(true);
		setAssistantError(null);
		setAssistantAnswer(null);
		try {
			const contextObj = {
				page: title,
				description,
				rows: rows.slice(0, 10).map((row) => {
					const cleanObj = {};
					columns.forEach((col) => {
						if (col.key in row) cleanObj[col.key] = row[col.key];
					});
					[
						"title",
						"caseDetails",
						"dateFiled",
						"accusedName",
						"victimName",
						"modusOperandi",
						"section"
					].forEach((key) => {
						if (key in row) cleanObj[key] = row[key];
					});
					return cleanObj;
				})
			};
			const q = `${assistantQuestion}\nContext: ${JSON.stringify(contextObj)}`;
			const res = await fetch(`/api/ai-assistant?question=${encodeURIComponent(q)}`);
			if (!res.ok) throw new Error("Assistant request failed");
			const json = await res.json();
			setAssistantAnswer(json.answer ?? String(json));
			setAssistantConfidence(typeof json.confidence === "number" ? json.confidence : null);
			setAssistantCitations(Array.isArray(json.citations) ? json.citations : null);
		} catch (err) {
			setAssistantError(err?.message ?? String(err));
		} finally {
			setAssistantLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: description
			})] }),
			assistant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 md:flex-row md:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "flex-1 rounded border border-white/10 bg-transparent px-3 py-2 text-sm text-foreground",
							value: assistantQuestion,
							onChange: (e) => setAssistantQuestion(e.target.value),
							placeholder: `Ask about the ${title.toLowerCase()} displayed here`,
							onKeyDown: (e) => e.key === "Enter" && askAssistant()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => askAssistant(),
							className: "rounded bg-primary/10 px-3 py-2 text-sm text-accent",
							disabled: assistantLoading,
							children: assistantLoading ? "Thinking…" : "Ask AI"
						})]
					}),
					assistantError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-red-400",
						children: assistantError
					}),
					assistantAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded border border-white/5 bg-white/3 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-foreground",
								children: assistantAnswer
							}),
							assistantConfidence !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Confidence: ",
									Math.round(assistantConfidence * 100),
									"%"
								]
							}),
							assistantCitations && assistantCitations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground",
								children: assistantCitations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-white/10 px-3 py-1",
									children: c
								}, c))
							})
						]
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-6 text-sm text-muted-foreground",
				children: [
					"Loading ",
					title.toLowerCase(),
					"..."
				]
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 p-6 text-sm text-muted-foreground",
				children: [
					"Unable to load ",
					title.toLowerCase(),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "glass border-white/10 p-0 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.length ? columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: column.label
							}, column.key)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Record"
							}) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.slice(0, 20).map((row, index) => {
							const item = row;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b border-white/5 text-foreground/90",
								children: columns.length ? columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: String(item[column.key] ?? "")
								}, column.key)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: JSON.stringify(row)
								})
							}, index);
						}) })]
					})
				})
			})
		]
	});
}
//#endregion
export { SimpleSectionPage as t };
