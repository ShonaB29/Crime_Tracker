import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LoaderCircle, E as MailCheck, ft as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-CPTHcKtl.mjs";
import { i as forgotPasswordSchema, r as Label, t as AuthShell } from "./label-Cbt06Xf8.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-C6I6MqAJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: u(forgotPasswordSchema) });
	const onSubmit = async (values) => {
		const { error } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/reset-password` });
		if (error) {
			toast.error(error.message);
			return;
		}
		setSent(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Reset Password",
		subtitle: "We'll send a secure reset link to your official email.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/auth",
			className: "inline-flex items-center gap-1 text-accent hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to sign in"]
		}),
		children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 py-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-6 w-6" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-foreground",
				children: "If an account exists for that email, a password reset link is on its way."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "fp-email",
						children: "Official email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fp-email",
						type: "email",
						placeholder: "officer@ksp.gov.in",
						...register("email")
					}),
					errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-danger",
						children: errors.email.message
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "w-full",
				disabled: isSubmitting,
				children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Send Reset Link"]
			})]
		})
	});
}
//#endregion
export { ForgotPasswordPage as component };
