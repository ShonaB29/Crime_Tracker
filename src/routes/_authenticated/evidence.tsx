import { createFileRoute } from "@tanstack/react-router";
import { EvidencePage } from "@/components/platform/EvidencePage";

export const Route = createFileRoute("/_authenticated/evidence")({
  head: () => ({ meta: [{ title: "Evidence Management · KSP Crime Intelligence" }] }),
  component: EvidencePage,
});
