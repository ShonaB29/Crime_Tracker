import { createFileRoute } from "@tanstack/react-router";

import { AssistantPage as AssistantPanel } from "@/components/platform/AssistantPage";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · KSP Crime Intelligence" }] }),
  component: AssistantRoute,
});

function AssistantRoute() {
  return <AssistantPanel />;
}
