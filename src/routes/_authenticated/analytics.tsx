import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics · KSP Crime Intelligence" }] }),
  component: AnalyticsPage,
});

const COLORS = ["#58d6c9", "#67a4ff", "#a88cff", "#ffb86b", "#ff6b9d", "#7bd389", "#ffd166", "#f77f00"];
const TOOLTIP_STYLE = { background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12 };

async function fetchAnalytics() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });

  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Analytics data could not be loaded.
      </Card>
    );
  }

  // Pull all series from the API response
  const lineSeries: Array<{ month: string; crimeCount: number; solvedCount: number; pendingCount: number }> =
    data.lineSeries ?? [];
  const barSeries: Array<{ label: string; crimes: number; firs: number }> =
    data.barSeries ?? [];
  const pieSeries: Array<{ name: string; value: number }> =
    data.pieSeries ?? [];
  const yearlyTrend: Array<{ year: number; crimes: number; solved: number }> =
    data.yearlyTrend ?? [];
  const predictionGraph: Array<{ month: string; observed: number; projected: number }> =
    data.predictionGraph ?? [];
  const riskScores: Array<{ district: string; score: number; trend: number }> =
    data.riskScores ?? [];
  const districtComparison: Array<{ name: string; crimes: number; solved: number; pending: number }> =
    data.districtComparison ?? [];
  const ageDistribution: Array<{ band: string; value: number }> =
    data.ageDistribution ?? [];
  const genderDistribution: Array<{ name: string; value: number }> =
    data.genderDistribution ?? [];
  const anomalyEvents: Array<{ title: string; district: string; severity: string; signal: string }> =
    data.anomalyEvents ?? [];
  const hotspotPrediction: Array<{ district: string; score: number; reason: string }> =
    data.hotspotPrediction ?? [];

  // Summary KPIs derived from lineSeries
  const totalCrimes  = lineSeries.reduce((s, r) => s + r.crimeCount, 0);
  const totalSolved  = lineSeries.reduce((s, r) => s + r.solvedCount, 0);
  const totalPending = lineSeries.reduce((s, r) => s + r.pendingCount, 0);
  const solveRate    = totalCrimes > 0 ? Math.round((totalSolved / totalCrimes) * 100) : 0;

  const kpis = [
    { label: "Total Crimes (12 mo)", value: totalCrimes.toLocaleString(), hint: "Sum of monthly crime counts" },
    { label: "Solved",               value: totalSolved.toLocaleString(),  hint: "Cases solved or filed in court" },
    { label: "Pending",              value: totalPending.toLocaleString(), hint: "Cases still open or under investigation" },
    { label: "Solve Rate",           value: `${solveRate}%`,              hint: "Solved ÷ Total crimes" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Live crime analytics, trends, distributions, and predictive insights across Karnataka.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="glass border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
          </Card>
        ))}
      </div>

      {/* Row 1: Monthly trend + Category pie */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Monthly Crime Trend</h2>
          <p className="text-xs text-muted-foreground">Crimes reported, solved, and pending per month</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Line type="monotone" dataKey="crimeCount"  stroke="#58d6c9" strokeWidth={2} dot={false} name="Crimes" />
                <Line type="monotone" dataKey="solvedCount" stroke="#7bd389" strokeWidth={2} dot={false} name="Solved" />
                <Line type="monotone" dataKey="pendingCount" stroke="#ffb86b" strokeWidth={2} dot={false} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Crime Categories</h2>
          <p className="text-xs text-muted-foreground">Distribution by crime type</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieSeries} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {pieSeries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {pieSeries.slice(0, 5).map((item, i) => (
              <span key={item.name} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: District comparison + Yearly trend */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">District Comparison</h2>
          <p className="text-xs text-muted-foreground">Top 10 districts — crimes, solved, pending</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtComparison} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={110} stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="crimes"  fill="#58d6c9" radius={[0, 4, 4, 0]} name="Crimes" />
                <Bar dataKey="solved"  fill="#7bd389" radius={[0, 4, 4, 0]} name="Solved" />
                <Bar dataKey="pending" fill="#ffb86b" radius={[0, 4, 4, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Yearly Trend</h2>
          <p className="text-xs text-muted-foreground">Annual crimes reported vs solved</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="crimes" fill="#67a4ff" radius={[4, 4, 0, 0]} name="Crimes" />
                <Bar dataKey="solved" fill="#7bd389" radius={[4, 4, 0, 0]} name="Solved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Prediction graph + Monthly bar */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Crime Prediction</h2>
          <p className="text-xs text-muted-foreground">Observed vs projected crime counts</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionGraph}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Line type="monotone" dataKey="observed"  stroke="#58d6c9" strokeWidth={2} dot={false} name="Observed" />
                <Line type="monotone" dataKey="projected" stroke="#a88cff" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Monthly FIR vs Crimes</h2>
          <p className="text-xs text-muted-foreground">FIRs filed vs crimes recorded per month</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="crimes" fill="#58d6c9" radius={[4, 4, 0, 0]} name="Crimes" />
                <Bar dataKey="firs"   fill="#67a4ff" radius={[4, 4, 0, 0]} name="FIRs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 4: Age distribution + Gender distribution */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Victim Age Distribution</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="band" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Victims">
                  {ageDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Victim Gender Distribution</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                  {genderDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 5: Risk scores + Anomaly events */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">District Risk Scores</h2>
          <p className="text-xs text-muted-foreground">Composite risk index — higher = more at-risk</p>
          <div className="mt-4 space-y-2">
            {riskScores.map((r) => (
              <div key={r.district} className="flex items-center gap-3">
                <span className="w-32 truncate text-xs text-muted-foreground">{r.district}</span>
                <div className="flex-1 rounded-full bg-white/10 h-2">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${r.score}%`, backgroundColor: r.score > 70 ? "#ff6b6b" : r.score > 45 ? "#ffb86b" : "#58d6c9" }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-semibold text-foreground">{r.score}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Anomaly Events</h2>
          <p className="text-xs text-muted-foreground">Districts with statistically elevated crime activity</p>
          <div className="mt-4 space-y-3">
            {anomalyEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No anomalies detected.</p>
            ) : (
              anomalyEvents.map((ev, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{ev.title}</p>
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-400">{ev.severity}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{ev.signal}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Row 6: Hotspot prediction table */}
      <Card className="glass border-white/10 p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">Hotspot Prediction</h2>
        <p className="text-xs text-muted-foreground mb-4">Districts predicted to be high-risk in the next period</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="py-3 pr-6">District</th>
                <th className="py-3 pr-6">Risk Score</th>
                <th className="py-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {hotspotPrediction.map((h) => (
                <tr key={h.district} className="border-b border-white/5 text-foreground/90">
                  <td className="py-3 pr-6 font-medium">{h.district}</td>
                  <td className="py-3 pr-6">
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-accent">{h.score}</span>
                  </td>
                  <td className="py-3 text-muted-foreground text-xs">{h.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
