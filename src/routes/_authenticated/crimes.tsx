import { createFileRoute } from "@tanstack/react-router";

import { SimpleSectionPage } from "@/components/platform/SimpleSectionPage";

export const Route = createFileRoute("/_authenticated/crimes")({
  head: () => ({ meta: [{ title: "Crimes · KSP Crime Intelligence" }] }),
  component: CrimesPage,
});

function CrimesPage() {
  return (
    <SimpleSectionPage
      title="Crimes"
      description="Search, filter, sort, and manage crime records from the live data store."
      queryKey="crimes"
      endpoint="/api/crimes?page=1&pageSize=20"
      assistant
      columns={[
        { key: "caseNumber", label: "Case" },
        { key: "districtName", label: "District" },
        { key: "crimeType", label: "Crime Type" },
        { key: "severity", label: "Severity" },
        { key: "status", label: "Status" },
        { key: "investigationOfficer", label: "Officer" },
      ]}
    />
  );
}
