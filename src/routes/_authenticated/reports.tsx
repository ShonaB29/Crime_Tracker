import { createFileRoute } from "@tanstack/react-router";

import { SimpleSectionPage } from "@/components/platform/SimpleSectionPage";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports · KSP Crime Intelligence" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <SimpleSectionPage
      title="Reports"
      description="Generate downloadable PDF, Excel, and CSV-ready reporting summaries."
      queryKey="reports"
      endpoint="/api/reports"
      columns={[
        { key: "title", label: "Title" },
        { key: "format", label: "Format" },
        { key: "rows", label: "Rows" },
        { key: "updatedAt", label: "Updated" },
      ]}
    />
  );
}
