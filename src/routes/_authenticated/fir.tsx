import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { SimpleSectionPage } from "@/components/platform/SimpleSectionPage";
import { FirAutoSummaryPage } from "@/components/platform/FirAutoSummaryPage";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/fir")({
  head: () => ({ meta: [{ title: "FIR Records · KSP Crime Intelligence" }] }),
  component: FirPage,
});

function FirPage() {
  const [activeTab, setActiveTab] = useState<"database" | "summarize">("database");

  return (
    <div className="space-y-6">
      {/* Custom Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-4">
        <button
          onClick={() => setActiveTab("database")}
          className={cn(
            "pb-3 text-sm font-semibold tracking-wider transition-colors relative uppercase",
            activeTab === "database"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          FIR Records Database
        </button>
        <button
          onClick={() => setActiveTab("summarize")}
          className={cn(
            "pb-3 text-sm font-semibold tracking-wider transition-colors relative uppercase",
            activeTab === "summarize"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          FIR Auto Summarizer
        </button>
      </div>

      {activeTab === "database" ? (
        <SimpleSectionPage
          title="FIR Records"
          description="Browse FIRs, filter by officer, district, or status, and inspect live case details."
          queryKey="firs"
          endpoint="/api/firs?page=1&pageSize=20"
          assistant
          columns={[
            { key: "firNumber", label: "FIR" },
            { key: "districtName", label: "District" },
            { key: "policeStationName", label: "Police Station" },
            { key: "officer", label: "Officer" },
            { key: "status", label: "Status" },
            { key: "section", label: "Section" },
          ]}
        />
      ) : (
        <FirAutoSummaryPage />
      )}
    </div>
  );
}
