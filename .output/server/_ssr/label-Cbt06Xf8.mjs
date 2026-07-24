import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as ksp_emblem_default } from "./ksp-emblem-ByXYWd1P.mjs";
import { i as stringType, n as literalType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-Cbt06Xf8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KARNATAKA_DISTRICTS = [
	"Bagalkot",
	"Ballari",
	"Belagavi",
	"Bengaluru Rural",
	"Bengaluru Urban",
	"Bidar",
	"Chamarajanagar",
	"Chikkaballapur",
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
var strongPassword = stringType().min(8, "Password must be at least 8 characters").max(72, "Password is too long").regex(/[A-Z]/, "Must include an uppercase letter").regex(/[a-z]/, "Must include a lowercase letter").regex(/[0-9]/, "Must include a number");
var loginSchema = objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(1, "Password is required").max(72)
});
var registerSchema = objectType({
	fullName: stringType().trim().min(2, "Enter your full name").max(120),
	email: stringType().trim().email("Enter a valid email").max(255),
	badgeNumber: stringType().trim().max(40).optional().or(literalType("")),
	department: stringType().trim().max(120).optional().or(literalType("")),
	district: stringType().trim().max(60).optional().or(literalType("")),
	role: enumType([
		"admin",
		"police_officer",
		"analyst"
	]),
	password: strongPassword,
	confirmPassword: stringType()
}).refine((d) => d.password === d.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});
var forgotPasswordSchema = objectType({ email: stringType().trim().email("Enter a valid email").max(255) });
var resetPasswordSchema = objectType({
	password: strongPassword,
	confirmPassword: stringType()
}).refine((d) => d.password === d.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});
/** Simple password strength meter (0-4). */
function passwordStrength(pw) {
	let score = 0;
	if (pw.length >= 8) score++;
	if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
	if (/[0-9]/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 10) score++;
	return {
		score,
		label: [
			"Too weak",
			"Weak",
			"Fair",
			"Strong",
			"Very strong"
		][score]
	};
}
/** Shared branded shell for all authentication screens. */
function AuthShell({ title, subtitle, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-backdrop opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { backgroundImage: "var(--gradient-glow)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ksp_emblem_default,
								alt: "Karnataka State Police emblem",
								className: "mb-4 h-20 w-20 drop-shadow-[0_0_24px_rgba(66,165,245,0.45)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.3em] text-accent",
								children: "Karnataka State Police"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-2xl font-bold text-foreground",
								children: title
							}),
							subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-sm text-sm text-muted-foreground",
								children: subtitle
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass rounded-2xl p-6 shadow-elegant sm:p-8",
						children
					}),
					footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: footer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-center text-xs text-muted-foreground/70",
						children: "Crime Intelligence & Analytical Platform · Authorized personnel only"
					})
				]
			})
		]
	});
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
//#endregion
export { loginSchema as a, resetPasswordSchema as c, forgotPasswordSchema as i, KARNATAKA_DISTRICTS as n, passwordStrength as o, Label as r, registerSchema as s, AuthShell as t };
