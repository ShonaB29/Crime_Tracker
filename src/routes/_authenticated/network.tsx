import { createFileRoute } from "@tanstack/react-router";

import { NetworkPage } from "@/components/platform/NetworkPage";

export const Route = createFileRoute("/_authenticated/network")({
  head: () => ({ meta: [{ title: "Network Analysis · KSP Crime Intelligence" }] }),
  component: NetworkPage,
});
