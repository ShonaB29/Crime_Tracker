import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Protected subtree. ssr:false because the Supabase session lives in localStorage,
// which the server cannot read. The client-only gate redirects to /auth when signed out.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (data.user) {
      return { user: data.user };
    }

    if (import.meta.env.DEV) {
      return { user: null };
    }

    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href, mode: "login" } });
    }
    return { user: data.user };
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
