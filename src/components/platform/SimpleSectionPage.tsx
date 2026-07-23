import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionPageProps {
  title: string;
  description: string;
  queryKey: string;
  endpoint: string;
  /** When true, show a small assistant input that queries the hybrid AI */
  assistant?: boolean;
  columns?: Array<{ key: string; label: string }>;
}

export function SimpleSectionPage({
  title,
  description,
  queryKey,
  endpoint,
  assistant = false,
  columns = [],
}: SectionPageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Unable to load ${title}`);
      return response.json();
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray((data as { items?: unknown[] }).items))
      return (data as { items: unknown[] }).items;
    if (Array.isArray((data as { reports?: unknown[] }).reports))
      return (data as { reports: unknown[] }).reports;
    return [];
  }, [data]);

  // Assistant local state (mini assistant for the page)
  const [assistantQuestion, setAssistantQuestion] = useState<string>("Tell me about these records");
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null);
  const [assistantConfidence, setAssistantConfidence] = useState<number | null>(null);
  const [assistantCitations, setAssistantCitations] = useState<string[] | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  async function askAssistant() {
    setAssistantLoading(true);
    setAssistantError(null);
    setAssistantAnswer(null);
    try {
      // Keep only essential fields to prevent URL length limits (414 URI Too Large)
      const cleanRows = rows.slice(0, 10).map((row: any) => {
        const cleanObj: Record<string, any> = {};
        columns.forEach((col) => {
          if (col.key in row) cleanObj[col.key] = row[col.key];
        });
        const essentials = [
          "title",
          "caseDetails",
          "dateFiled",
          "accusedName",
          "victimName",
          "modusOperandi",
          "section",
        ];
        essentials.forEach((key) => {
          if (key in row) cleanObj[key] = row[key];
        });
        return cleanObj;
      });

      const contextObj = {
        page: title,
        description: description,
        rows: cleanRows,
      };
      const q = `${assistantQuestion}\nContext: ${JSON.stringify(contextObj)}`;
      const res = await fetch(`/api/ai-assistant?question=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Assistant request failed");
      const json = await res.json();
      setAssistantAnswer(json.answer ?? String(json));
      setAssistantConfidence(typeof json.confidence === "number" ? json.confidence : null);
      setAssistantCitations(Array.isArray(json.citations) ? json.citations : null);
    } catch (err: any) {
      setAssistantError(err?.message ?? String(err));
    } finally {
      setAssistantLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Assistant quick-query (optional) */}
      {/** Show a compact assistant that queries the hybrid AI workflow */}
      {/** This keeps behaviour local and non-intrusive to existing pages */}
      {/** Renders only when `assistant` prop is true */}
      {/** Mini assistant sends the user's question plus a short summary of visible rows */}
      {/** Keeps UI simple and self-contained for Crimes/FIR pages */}
      {/** Assistant UI */}
      {/** eslint-disable-next-line react-hooks/rules-of-hooks */}
      {/** Note: keeping hooks inline-safe since this component is a function component */}
      {assistant && (
        <Card className="glass border-white/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              className="flex-1 rounded border border-white/10 bg-transparent px-3 py-2 text-sm text-foreground"
              value={assistantQuestion}
              onChange={(e) => setAssistantQuestion(e.target.value)}
              placeholder={`Ask about the ${title.toLowerCase()} displayed here`}
              onKeyDown={(e) => e.key === "Enter" && askAssistant()}
            />
            <button
              onClick={() => askAssistant()}
              className="rounded bg-primary/10 px-3 py-2 text-sm text-accent"
              disabled={assistantLoading}
            >
              {assistantLoading ? "Thinking…" : "Ask AI"}
            </button>
          </div>

          {assistantError && <p className="mt-2 text-xs text-red-400">{assistantError}</p>}
          {assistantAnswer && (
            <div className="mt-3 rounded border border-white/5 bg-white/3 p-3 text-sm">
              <p className="mb-2 text-foreground">{assistantAnswer}</p>
              {assistantConfidence !== null && (
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.round(assistantConfidence * 100)}%
                </p>
              )}
              {assistantCitations && assistantCitations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {assistantCitations.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 px-3 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
      {/** We'll implement conditional render below */}
      {/** End assistant placeholder */}

      {isLoading ? (
        <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
          Loading {title.toLowerCase()}...
        </Card>
      ) : error ? (
        <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
          Unable to load {title.toLowerCase()}.
        </Card>
      ) : (
        <Card className="glass border-white/10 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  {columns.length ? (
                    columns.map((column) => (
                      <th key={column.key} className="px-4 py-3">
                        {column.label}
                      </th>
                    ))
                  ) : (
                    <th className="px-4 py-3">Record</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row, index) => {
                  const item = row as Record<string, unknown>;
                  return (
                    <tr key={index} className="border-b border-white/5 text-foreground/90">
                      {columns.length ? (
                        columns.map((column) => (
                          <td key={column.key} className="px-4 py-3 text-muted-foreground">
                            {String(item[column.key] ?? "")}
                          </td>
                        ))
                      ) : (
                        <td className="px-4 py-3">{JSON.stringify(row)}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
