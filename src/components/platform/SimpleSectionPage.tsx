import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionPageProps {
  title: string;
  description: string;
  queryKey: string;
  endpoint: string;
  columns?: Array<{ key: string; label: string }>;
}

export function SimpleSectionPage({ title, description, queryKey, endpoint, columns = [] }: SectionPageProps) {
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
    if (Array.isArray((data as { items?: unknown[] }).items)) return (data as { items: unknown[] }).items;
    if (Array.isArray((data as { reports?: unknown[] }).reports)) return (data as { reports: unknown[] }).reports;
    return [];
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {isLoading ? (
        <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">Loading {title.toLowerCase()}...</Card>
      ) : error ? (
        <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">Unable to load {title.toLowerCase()}.</Card>
      ) : (
        <Card className="glass border-white/10 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  {columns.length ? columns.map((column) => <th key={column.key} className="px-4 py-3">{column.label}</th>) : <th className="px-4 py-3">Record</th>}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row, index) => {
                  const item = row as Record<string, unknown>;
                  return (
                    <tr key={index} className="border-b border-white/5 text-foreground/90">
                      {columns.length ? columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-muted-foreground">{String(item[column.key] ?? "")}</td>
                      )) : (
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
