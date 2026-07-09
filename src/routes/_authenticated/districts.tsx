import { createFileRoute } from "@tanstack/react-router";

import { SimpleSectionPage } from "@/components/platform/SimpleSectionPage";

export const Route = createFileRoute("/_authenticated/districts")({
  head: () => ({ meta: [{ title: "Districts · KSP Crime Intelligence" }] }),
  component: DistrictsPage,
});

function DistrictsPage() {
  return (
    <SimpleSectionPage
      title="Districts"
      description="District-level crime comparison, station coverage, and hotspot indicators for Karnataka."
      queryKey="districts"
      endpoint="/api/districts"
      columns={[
        { key: "name", label: "District" },
        { key: "crimeCount", label: "Crimes" },
        { key: "firCount", label: "FIRs" },
        { key: "hotspotCount", label: "Hotspots" },
        { key: "policeStationCount", label: "Stations" },
      ]}
    />
  );
}
