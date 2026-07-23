import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardPayload = {
  totals: Record<string, number>;
  crimeRate: number;
  districtComparison: Array<{ name: string; crimes: number; firs: number; hotspots: number }>;
  monthlyTrends: Array<{ month: string; crimes: number; firs: number }>;
  crimeCategories: Array<{ name: string; value: number }>;
  recentFirs: Array<{
    firNumber: string;
    districtName: string;
    officer: string;
    status: string;
    dateFiled: string;
    section: string;
  }>;
  topCrimeDistricts: Array<{
    id: string;
    name: string;
    crimes: number;
    hotspots: number;
    policeStations: number;
  }>;
  heatmapPoints: Array<{
    lat: number;
    lng: number;
    intensity: number;
    district: string;
    category: string;
  }>;
  kpis: Array<{ label: string; value: string; hint: string }>;
};

const COLORS = [
  "#58d6c9",
  "#67a4ff",
  "#a88cff",
  "#ffb86b",
  "#ff6b9d",
  "#7bd389",
  "#ffd166",
  "#f77f00",
];

async function fetchDashboard(): Promise<DashboardPayload> {
  const response = await fetch("/api/dashboard");
  if (!response.ok) {
    throw new Error("Unable to load dashboard data");
  }
  return response.json();
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="mt-3 flex h-14 items-end gap-1">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="flex-1 rounded-t-md bg-accent/70"
          style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["dashboard"], queryFn: fetchDashboard });

  const evidenceStats = useMemo(() => {
    try {
      const stored = localStorage.getItem("ksp_evidence");
      if (stored) {
        const list = JSON.parse(stored);
        const total = list.length;
        const verified = list.filter((e: any) => e.verificationStatus === "Verified").length;
        return { total, verified };
      }
    } catch (e) {
      // ignore
    }
    return { total: 4, verified: 3 };
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Dashboard data could not be loaded.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live operational overview of Karnataka crime intelligence.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Crime rate: <span className="font-semibold text-foreground">{data.crimeRate}</span> per
          district sample
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label} className="glass border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card className="glass border-white/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Monthly Trend</h2>
              <p className="text-xs text-muted-foreground">
                Crime and FIR trend from the live data store
              </p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.55)" />
                <YAxis stroke="rgba(255,255,255,0.55)" />
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="crimes"
                  stroke="#58d6c9"
                  strokeWidth={3}
                  dot={false}
                />
                <Line type="monotone" dataKey="firs" stroke="#67a4ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Crime Categories</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.crimeCategories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {data.crimeCategories.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.crimeCategories.slice(0, 5).map((item, index) => (
              <span
                key={item.name}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            District Comparison
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.districtComparison} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.55)" />
                <YAxis type="category" dataKey="name" width={120} stroke="rgba(255,255,255,0.55)" />
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <Legend />
                <Bar dataKey="crimes" fill="#58d6c9" radius={[0, 8, 8, 0]} />
                <Bar dataKey="firs" fill="#67a4ff" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Top Crime Districts
          </h2>
          <div className="mt-4 space-y-4">
            {data.topCrimeDistricts.slice(0, 5).map((district) => (
              <div key={district.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{district.name}</p>
                      {district.riskLevel && (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                            district.riskLevel === "High"
                              ? "bg-red-500/15 text-red-400 border border-red-500/10"
                              : district.riskLevel === "Medium"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10",
                          )}
                        >
                          RISK: {district.riskScore} ({district.riskLevel})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {district.hotspots} hotspots · {district.policeStations} stations
                    </p>
                    {district.riskReasons && district.riskReasons.length > 0 && (
                      <p className="text-[10px] text-muted-foreground italic leading-tight">
                        Reason: {district.riskReasons.join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-accent">
                    {district.crimes.toLocaleString()}
                  </span>
                </div>
                <Sparkline values={data.monthlyTrends.map((entry) => entry.crimes)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Dashboard Enhancements Widgets Grid (Feature 4) ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Investigations & Progress */}
        <Card className="glass border-white/10 p-5 space-y-4">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Active Investigations
            </h3>
            <p className="text-xs text-muted-foreground">
              Ongoing case files and progress tracking
            </p>
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Under Investigation</span>
              <span className="font-semibold text-foreground">{data.totals.activeCases} cases</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Solved & Closed</span>
              <span className="font-semibold text-success">{data.totals.solvedCases} cases</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                <span>Investigation Progress</span>
                <span className="text-accent">
                  {Math.round(
                    (data.totals.solvedCases /
                      (data.totals.solvedCases + data.totals.activeCases || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{
                    width: `${(data.totals.solvedCases / (data.totals.solvedCases + data.totals.activeCases || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Most Wanted Criminals */}
        <Card className="glass border-white/10 p-5 space-y-4">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Most Wanted Criminals
            </h3>
            <p className="text-xs text-muted-foreground">High-priority suspect tracking</p>
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { name: "Naveen Gowda", status: "Wanted", reward: "₹50,000", alert: "Active Alert" },
              {
                name: "Vikram Singh",
                status: "Absconding",
                reward: "₹25,000",
                alert: "Spotted border",
              },
              { name: "Shekhar R.", status: "Wanted", reward: "₹10,000", alert: "Inactive" },
            ].map((suspect) => (
              <div
                key={suspect.name}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5"
              >
                <div>
                  <span className="font-semibold text-foreground block">{suspect.name}</span>
                  <span className="text-[10px] text-red-400 font-medium">{suspect.alert}</span>
                </div>
                <div className="text-right">
                  <span className="rounded bg-destructive/15 border border-destructive/20 px-2 py-0.5 text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                    {suspect.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    {suspect.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Repeat Offenders & Evidence Stats */}
        <Card className="glass border-white/10 p-5 space-y-4">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Repeat Offenders & Evidence
            </h3>
            <p className="text-xs text-muted-foreground">Offender profiles & file statistics</p>
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div>
                <span className="text-muted-foreground block">Repeat Offenders Count</span>
                <span className="text-[10px] text-muted-foreground">
                  From active database records
                </span>
              </div>
              <span className="font-display text-lg font-bold text-accent">
                {data.totals.repeatOffenders} suspects
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Evidence Statistics
              </span>
              <div className="grid grid-cols-2 gap-2 text-center pt-0.5">
                <div className="p-2 rounded bg-white/3 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block">Total Assets</span>
                  <span className="font-semibold text-foreground text-sm">
                    {evidenceStats.total} files
                  </span>
                </div>
                <div className="p-2 rounded bg-white/3 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block">Verified</span>
                  <span className="font-semibold text-success text-sm">
                    {evidenceStats.verified} files
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* District Crime Ranking */}
        <Card className="glass border-white/10 p-5 md:col-span-2 lg:col-span-3 space-y-4">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              District Crime Ranking
            </h3>
            <p className="text-xs text-muted-foreground">
              Relative density index by district jurisdiction
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.topCrimeDistricts.slice(0, 6).map((district, idx) => (
              <div
                key={district.id}
                className="p-3.5 rounded-xl border border-white/5 bg-white/3 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">
                    #{idx + 1} {district.name}
                  </span>
                  <span className="text-accent font-bold">{district.crimes} crimes</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-muted-foreground uppercase">
                    <span>Crime share</span>
                    <span>{Math.round((district.crimes / data.totals.crimes) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${(district.crimes / data.totals.crimes) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="glass border-white/10 p-5 xl:col-span-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent FIRs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4">FIR</th>
                  <th className="py-3 pr-4">District</th>
                  <th className="py-3 pr-4">Officer</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Section</th>
                </tr>
              </thead>
              <tbody>
                {data.recentFirs.map((fir) => (
                  <tr key={fir.firNumber} className="border-b border-white/5 text-foreground/90">
                    <td className="py-3 pr-4 font-medium">{fir.firNumber}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{fir.districtName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{fir.officer}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          fir.status === "Closed"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning",
                        )}
                      >
                        {fir.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{fir.section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Hotspot Heat</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {data.heatmapPoints.slice(0, 8).map((point, index) => (
              <div
                key={`${point.district}-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{point.district}</span>
                  <span className="text-xs font-semibold text-accent">
                    {Math.round(point.intensity * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{point.category}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}
