import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/components/platform/DashboardPage";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · KSP Crime Intelligence" }] }),
  component: DashboardPage,
});
