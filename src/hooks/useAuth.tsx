import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "police_officer" | "analyst";

export interface AuthProfile {
  id: string;
  full_name: string;
  email: string;
  badge_number: string | null;
  rank: string | null;
  department: string | null;
  district: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  roles: AppRole[];
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  police_officer: "Police Officer",
  analyst: "Analyst",
};

async function fetchProfileAndRoles(userId: string) {
  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  return {
    profile: (profile as AuthProfile | null) ?? null,
    roles: (roleRows ?? []).map((r) => r.role as AppRole),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const { profile, roles } = await fetchProfileAndRoles(userId);
    setProfile(profile);
    setRoles(roles);
  };

  useEffect(() => {
    let active = true;

    // Register listener first, then hydrate existing session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      // Defer Supabase calls out of the callback to avoid deadlocks.
      if (nextSession?.user) {
        setTimeout(() => {
          if (active) void loadUserData(nextSession.user.id);
        }, 0);
      } else {
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

  const value = useMemo<AuthContextValue>(() => {
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
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile, roles, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
