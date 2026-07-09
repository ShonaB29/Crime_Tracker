import { createFileRoute } from "@tanstack/react-router";

import { CrimeMapPage as CrimeMapPanel } from "@/components/platform/CrimeMapPage";

export const Route = createFileRoute("/_authenticated/map")({
  head: () => ({ meta: [{ title: "Crime Map · KSP Crime Intelligence" }] }),
  component: MapRoute,
});

function MapRoute() {
  return <CrimeMapPanel />;
}
