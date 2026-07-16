import { createFileRoute } from "@tanstack/react-router";
import { CriminalTimelinePage } from "@/components/platform/CriminalTimelinePage";

export const Route = createFileRoute("/_authenticated/timeline")({
  head: () => ({ meta: [{ title: "Criminal Timeline · KSP Crime Intelligence" }] }),
  component: CriminalTimelinePage,
});
