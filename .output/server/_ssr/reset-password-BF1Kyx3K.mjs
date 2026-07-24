import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LoaderCircle, N as KeyRound } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-CPTHcKtl.mjs";
import { c as resetPasswordSchema, o as passwordStrength, r as Label, t as AuthShell } from "./label-Cbt06Xf8.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-BF1Kyx3K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) setReady(true);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: u(resetPasswordSchema) });
	const pw = watch("password") ?? "";
	const strength = passwordStrength(pw);
	const onSubmit = async (values) => {
		const { error } = await supabase.auth.updateUser({ password: values.password });
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Password updated. Please sign in.");
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Set New Password",
		subtitle: "Choose a strong new password for your account.",
		children: !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-4 text-center text-sm text-muted-foreground",
			children: "Open this page from the password reset link in your email to continue."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rp-password",
							children: "New password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rp-password",
							type: "password",
							placeholder: "••••••••",
							...register("password")
						}),
						pw && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-1.5 gap-1",
							children: [
								0,
								1,
								2,
								3
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full flex-1 rounded-full ${i < strength.score ? strength.score >= 3 ? "bg-success" : strength.score === 2 ? "bg-warning" : "bg-danger" : "bg-muted"}` }, i))
						}),
						errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.password.message
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rp-confirm",
							children: "Confirm password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rp-confirm",
							type: "password",
							placeholder: "••••••••",
							...register("confirmPassword")
						}),
						errors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.confirmPassword.message
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: isSubmitting,
					children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 h-4 w-4" }), "Update Password"]
				})
			]
		})
	});
}
//#endregion
export { ResetPasswordPage as component };
