import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-CPTHcKtl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-C2tvUku-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
var ROLE_LABELS = {
	admin: "Administrator",
	police_officer: "Police Officer",
	analyst: "Analyst"
};
async function fetchProfileAndRoles(userId) {
	const [{ data: profile }, { data: roleRows }] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
	return {
		profile: profile ?? null,
		roles: (roleRows ?? []).map((r) => r.role)
	};
}
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadUserData = async (userId) => {
		if (!userId) {
			setProfile(null);
			setRoles([]);
			return;
		}
		const { profile, roles } = await fetchProfileAndRoles(userId);
		setProfile(profile);
		setRoles(roles);
	};
	(0, import_react.useEffect)(() => {
		let active = true;
		const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
			if (!active) return;
			setSession(nextSession);
			if (nextSession?.user) setTimeout(() => {
				if (active) loadUserData(nextSession.user.id);
			}, 0);
			else {
				setProfile(null);
				setRoles([]);
			}
			if (event === "INITIAL_SESSION") setLoading(false);
		});
		supabase.auth.getSession().then(async ({ data }) => {
			if (!active) return;
			setSession(data.session);
			if (data.session?.user) await loadUserData(data.session.user.id);
			setLoading(false);
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const value = (0, import_react.useMemo)(() => {
		const user = session?.user ?? null;
		return {
			session,
			user,
			profile,
			roles,
			loading,
			isAuthenticated: !!user,
			hasRole: (role) => roles.includes(role),
			hasAnyRole: (list) => list.some((r) => roles.includes(r)),
			refresh: () => loadUserData(user?.id),
			signOut: async () => {
				await supabase.auth.signOut();
				setProfile(null);
				setRoles([]);
			}
		};
	}, [
		session,
		profile,
		roles,
		loading
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
//#endregion
export { ROLE_LABELS as n, useAuth as r, AuthProvider as t };
