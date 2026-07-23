import { createFileRoute } from "@tanstack/react-router";
import {
  createCrime,
  deleteCrime,
  deleteFir,
  getAnalyticsSummary,
  getAssistantResponse,
  getDashboardSummary,
  getDistrictSummaries,
  getCrime,
  getFir,
  getNetworkGraphSummary,
  getReportsSummary,
  getSettingsSummary,
  listCrimes,
  listFirs,
  updateCrime,
  updateFir,
  // Hybrid AI workflow orchestrator (Steps 3–9)
  getHybridAssistantResponse,
  getCriminalTimelineData,
} from "@/server/crime-platform.server";

function splitResource(path: string) {
  const parts = path.split("/").filter(Boolean);
  return {
    resource: parts[0] ?? "",
    id: parts[1] ?? "",
    subId: parts[2] ?? "",
  };
}

function parseNumber(value: string | null, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? next : fallback;
}

function csvEscape(value: unknown) {
  const raw = String(value ?? "");
  if (/[",\n]/.test(raw)) {
    return `"${raw.replaceAll('"', '""')}"`;
  }
  return raw;
}

function toCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });
  return lines.join("\n");
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { resource, id, subId } = splitResource(params._splat ?? "");
        const url = new URL(request.url);

        if (resource === "dashboard") {
          return Response.json(getDashboardSummary());
        }

        if (resource === "crimes") {
          if (id) {
            const crime = getCrime(id);
            if (!crime)
              return Response.json({ message: "Crime record not found" }, { status: 404 });
            return Response.json(crime);
          }

          const page = parseNumber(url.searchParams.get("page"), 1);
          const pageSize = parseNumber(url.searchParams.get("pageSize"), 20);
          const sortBy = url.searchParams.get("sortBy") as never;
          const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";
          return Response.json(
            listCrimes({
              search: url.searchParams.get("search") ?? undefined,
              district: url.searchParams.get("district") ?? undefined,
              category: url.searchParams.get("category") ?? undefined,
              status: url.searchParams.get("status") ?? undefined,
              severity: url.searchParams.get("severity") ?? undefined,
              page,
              pageSize,
              sortBy,
              sortDir,
            }),
          );
        }

        if (resource === "firs") {
          if (id) {
            const fir = getFir(id);
            if (!fir) return Response.json({ message: "FIR record not found" }, { status: 404 });
            return Response.json(fir);
          }

          const page = parseNumber(url.searchParams.get("page"), 1);
          const pageSize = parseNumber(url.searchParams.get("pageSize"), 20);
          return Response.json(
            listFirs({
              search: url.searchParams.get("search") ?? undefined,
              district: url.searchParams.get("district") ?? undefined,
              status: url.searchParams.get("status") ?? undefined,
              officer: url.searchParams.get("officer") ?? undefined,
              page,
              pageSize,
            }),
          );
        }

        if (resource === "districts") {
          return Response.json(getDistrictSummaries());
        }

        if (resource === "analytics") {
          return Response.json(getAnalyticsSummary());
        }

        if (resource === "map") {
          return Response.json({
            ...getDashboardSummary(),
            districts: getDistrictSummaries(),
          });
        }

        if (resource === "network") {
          return Response.json(getNetworkGraphSummary());
        }

        if (resource === "timeline") {
          return Response.json(getCriminalTimelineData());
        }

        if (resource === "assistant") {
          const question = url.searchParams.get("question") ?? "";
          return Response.json(getAssistantResponse(question));
        }

        // /api/ai-assistant — Hybrid AI workflow (Steps 3–9)
        // Routes through IntentRouter → Text-to-SQL | RAG | AnalysisEngine → LLM Response
        if (resource === "ai-assistant") {
          const question = url.searchParams.get("question") ?? "";
          return Response.json(await getHybridAssistantResponse(question));
        }

        if (resource === "reports") {
          const summary = getReportsSummary();
          const format = url.searchParams.get("format") ?? "json";
          const type = url.searchParams.get("type") ?? "reports";

          if (format === "csv") {
            if (type === "crimes") {
              const { items } = listCrimes({ page: 1, pageSize: 10000 });
              return new Response(
                toCsv(
                  items.map((crime) => ({
                    id: crime.id,
                    caseNumber: crime.caseNumber,
                    district: crime.districtName,
                    category: crime.category,
                    crimeType: crime.crimeType,
                    status: crime.status,
                    severity: crime.severity,
                    officer: crime.investigationOfficer,
                    crimeTime: crime.crimeTime,
                  })),
                ),
                {
                  headers: { "Content-Type": "text/csv; charset=utf-8" },
                },
              );
            }

            return new Response(toCsv(summary.reports), {
              headers: { "Content-Type": "text/csv; charset=utf-8" },
            });
          }

          if (format === "html") {
            return new Response(
              `<!doctype html><html><head><title>Reports</title><meta charset="utf-8" /></head><body><pre>${JSON.stringify(summary, null, 2)}</pre></body></html>`,
              { headers: { "Content-Type": "text/html; charset=utf-8" } },
            );
          }

          return Response.json(summary);
        }

        if (resource === "settings") {
          return Response.json(getSettingsSummary());
        }

        if (resource === "health") {
          return Response.json({
            ok: true,
            service: "ksp-crime-platform",
            time: new Date().toISOString(),
          });
        }

        return Response.json({ message: "Not found" }, { status: 404 });
      },
      POST: async ({ request, params }) => {
        const { resource, id } = splitResource(params._splat ?? "");
        const body = await request.json().catch(() => ({}));

        if (resource === "crimes" && !id) {
          return Response.json(createCrime(body));
        }

        return Response.json({ message: "Not found" }, { status: 404 });
      },
      PUT: async ({ request, params }) => {
        const { resource, id } = splitResource(params._splat ?? "");
        const body = await request.json().catch(() => ({}));

        if (resource === "crimes" && id) {
          const updated = updateCrime(id, body);
          if (!updated)
            return Response.json({ message: "Crime record not found" }, { status: 404 });
          return Response.json(updated);
        }

        if (resource === "firs" && id) {
          const updated = updateFir(id, body);
          if (!updated) return Response.json({ message: "FIR record not found" }, { status: 404 });
          return Response.json(updated);
        }

        return Response.json({ message: "Not found" }, { status: 404 });
      },
      PATCH: async ({ request, params }) => {
        const { resource, id } = splitResource(params._splat ?? "");
        const body = await request.json().catch(() => ({}));

        if (resource === "crimes" && id) {
          const updated = updateCrime(id, body);
          if (!updated)
            return Response.json({ message: "Crime record not found" }, { status: 404 });
          return Response.json(updated);
        }

        if (resource === "firs" && id) {
          const updated = updateFir(id, body);
          if (!updated) return Response.json({ message: "FIR record not found" }, { status: 404 });
          return Response.json(updated);
        }

        return Response.json({ message: "Not found" }, { status: 404 });
      },
      DELETE: async ({ params }) => {
        const { resource, id } = splitResource(params._splat ?? "");

        if (resource === "crimes" && id) {
          const removed = deleteCrime(id);
          if (!removed)
            return Response.json({ message: "Crime record not found" }, { status: 404 });
          return Response.json({ ok: true });
        }

        if (resource === "firs" && id) {
          const removed = deleteFir(id);
          if (!removed) return Response.json({ message: "FIR record not found" }, { status: 404 });
          return Response.json({ ok: true });
        }

        return Response.json({ message: "Not found" }, { status: 404 });
      },
    },
  },
});
