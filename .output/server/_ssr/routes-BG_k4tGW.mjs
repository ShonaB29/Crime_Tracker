import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Network, d as ShieldCheck, dt as ArrowRight, ot as Brain, w as Map } from "../_libs/lucide-react.mjs";
import { t as ksp_emblem_default } from "./ksp-emblem-ByXYWd1P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BG_k4tGW.js
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: Brain,
		title: "AI Intelligence",
		desc: "Hotspot prediction, risk scoring & anomaly detection."
	},
	{
		icon: Map,
		title: "Geo Analytics",
		desc: "Interactive Karnataka crime maps & heatmaps."
	},
	{
		icon: Network,
		title: "Network Analysis",
		desc: "Uncover criminal associations & repeat offenders."
	},
	{
		icon: ShieldCheck,
		title: "Secure & Role-Based",
		desc: "JWT sessions with granular access control."
	}
];
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-backdrop opacity-50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { backgroundImage: "var(--gradient-glow)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ksp_emblem_default,
						alt: "KSP",
						className: "h-10 w-10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-bold text-foreground",
						children: "KSP Intelligence"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						children: "Sign In"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto max-w-6xl px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col items-center py-16 text-center sm:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent",
							children: "Karnataka State Police"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl",
							children: "Crime Intelligence & Analytical Platform"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-2xl text-lg text-muted-foreground",
							children: "Transform isolated records into actionable intelligence with AI-powered analytics, crime prediction, hotspot detection, and investigation assistance."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								search: { mode: "register" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									children: ["Request Access ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									children: "Officer Sign In"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-4",
					children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold text-foreground",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: f.desc
							})
						]
					}, f.title))
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
