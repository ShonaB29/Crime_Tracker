import { createFileRoute } from "@tanstack/react-router";

import { AssistantPage } from "@/components/platform/AssistantPage";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({ meta: [{ title: "AI Intelligence · KSP Crime Intelligence" }] }),
  component: AssistantPage,
});
