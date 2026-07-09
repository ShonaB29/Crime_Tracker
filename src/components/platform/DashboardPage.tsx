import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardPayload = {
  totals: Record<string, number>;
  crimeRate: number;
  districtComparison: Array<{ name: string; crimes: number; firs: number; hotspots: number }>;
  monthlyTrends: Array<{ month: string; crimes: number; firs: number }>;
  crimeCategories: Array<{ name: string; value: number }>;
  recentFirs: Array<{ firNumber: string; districtName: string; officer: string; status: string; dateFiled: string; section: string }>;
  topCrimeDistricts: Array<{ id: string; name: string; crimes: number; hotspots: number; policeStations: number }>;
  heatmapPoints: Array<{ lat: number; lng: number; intensity: number; district: string; category: string }>;
  kpis: Array<{ label: string; value: string; hint: string }>;
};

const COLORS = ["#58d6c9", "#67a4ff", "#a88cff", "#ffb86b", "#ff6b9d", "#7bd389", "#ffd166", "#f77f00"];

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
          <p className="text-sm text-muted-foreground">Live operational overview of Karnataka crime intelligence.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Crime rate: <span className="font-semibold text-foreground">{data.crimeRate}</span> per district sample
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
              <p className="text-xs text-muted-foreground">Crime and FIR trend from the live data store</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.55)" />
                <YAxis stroke="rgba(255,255,255,0.55)" />
                <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }} />
                <Legend />
                <Line type="monotone" dataKey="crimes" stroke="#58d6c9" strokeWidth={3} dot={false} />
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
                <Pie data={data.crimeCategories} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92} paddingAngle={3}>
                  {data.crimeCategories.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.crimeCategories.slice(0, 5).map((item, index) => (
              <span key={item.name} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {item.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">District Comparison</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.districtComparison} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.55)" />
                <YAxis type="category" dataKey="name" width={120} stroke="rgba(255,255,255,0.55)" />
                <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }} />
                <Legend />
                <Bar dataKey="crimes" fill="#58d6c9" radius={[0, 8, 8, 0]} />
                <Bar dataKey="firs" fill="#67a4ff" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/10 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Top Crime Districts</h2>
          <div className="mt-4 space-y-4">
            {data.topCrimeDistricts.slice(0, 5).map((district) => (
              <div key={district.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{district.name}</p>
                    <p className="text-xs text-muted-foreground">{district.hotspots} hotspots · {district.policeStations} stations</p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-accent">{district.crimes.toLocaleString()}</span>
                </div>
                <Sparkline values={data.monthlyTrends.map((entry) => entry.crimes)} />
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
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", fir.status === "Closed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning")}>{fir.status}</span>
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
              <div key={`${point.district}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{point.district}</span>
                  <span className="text-xs font-semibold text-accent">{Math.round(point.intensity * 100)}%</span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{point.category}</p>
                <p className="mt-1 text-xs text-muted-foreground">{point.lat.toFixed(2)}, {point.lng.toFixed(2)}</p>
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
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}
