import { createFileRoute } from "@tanstack/react-router";

import { SimpleSectionPage } from "@/components/platform/SimpleSectionPage";

export const Route = createFileRoute("/_authenticated/fir")({
  head: () => ({ meta: [{ title: "FIR Records · KSP Crime Intelligence" }] }),
  component: FirPage,
});

function FirPage() {
  return (
    <SimpleSectionPage
      title="FIR Records"
      description="Browse FIRs, filter by officer, district, or status, and inspect live case details."
      queryKey="firs"
      endpoint="/api/firs?page=1&pageSize=20"
      columns={[
        { key: "firNumber", label: "FIR" },
        { key: "districtName", label: "District" },
        { key: "policeStationName", label: "Police Station" },
        { key: "officer", label: "Officer" },
        { key: "status", label: "Status" },
        { key: "section", label: "Section" },
      ]}
    />
  );
}
