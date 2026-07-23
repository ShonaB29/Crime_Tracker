import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  History,
  Calendar,
  User,
  Search,
  ShieldAlert,
  Lock,
  FileText,
  Scale,
  BadgeAlert,
  KeyRound,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CriminalTimelineEvent {
  id: string;
  date: string;
  type: "crime" | "fir" | "arrest" | "court" | "bail";
  title: string;
  description: string;
  firNumber: string;
  crimeType: string;
}

interface CriminalProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  repeatOffender: boolean;
  status: string;
  modusOperandi: string;
  totalCrimes: number;
  timeline: CriminalTimelineEvent[];
}

async function fetchTimelines(): Promise<CriminalProfile[]> {
  const response = await fetch("/api/timeline");
  if (!response.ok) throw new Error("Unable to load timeline data");
  return response.json();
}

export function CriminalTimelinePage() {
  const {
    data: profiles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timelines"],
    queryFn: fetchTimelines,
  });

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [filterFir, setFilterFir] = useState("");
  const [filterCrimeType, setFilterCrimeType] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Get unique filter values from profiles
  const allFirs = useMemo(() => {
    const firs = new Set<string>();
    profiles.forEach((p) => {
      p.timeline.forEach((e) => {
        if (e.firNumber && e.firNumber !== "N/A") firs.add(e.firNumber);
      });
    });
    return Array.from(firs).sort();
  }, [profiles]);

  const allCrimeTypes = useMemo(() => {
    const types = new Set<string>();
    profiles.forEach((p) => {
      p.timeline.forEach((e) => {
        if (e.crimeType) types.add(e.crimeType);
      });
    });
    return Array.from(types).sort();
  }, [profiles]);

  const allYears = useMemo(() => {
    const years = new Set<string>();
    profiles.forEach((p) => {
      p.timeline.forEach((e) => {
        const year = new Date(e.date).getFullYear().toString();
        if (year && year !== "NaN") years.add(year);
      });
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [profiles]);

  // Filter profiles based on selected filters
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // 1. Name search
      if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      // 2. Timeline filter checks (FIR, Crime Type, Year)
      if (filterFir || filterCrimeType || filterYear) {
        const matchesTimeline = p.timeline.some((e) => {
          const matchFir = !filterFir || e.firNumber === filterFir;
          const matchType = !filterCrimeType || e.crimeType === filterCrimeType;
          const matchYear = !filterYear || new Date(e.date).getFullYear().toString() === filterYear;
          return matchFir && matchType && matchYear;
        });
        if (!matchesTimeline) return false;
      }

      return true;
    });
  }, [profiles, searchName, filterFir, filterCrimeType, filterYear]);

  // Selected profile detail
  const selectedProfile = useMemo(() => {
    if (selectedProfileId) {
      const match = profiles.find((p) => p.id === selectedProfileId);
      if (match) return match;
    }
    // Default to the first filtered profile if available
    return filteredProfiles[0] ?? null;
  }, [profiles, selectedProfileId, filteredProfiles]);

  const handleResetFilters = () => {
    setSearchName("");
    setFilterFir("");
    setFilterCrimeType("");
    setFilterYear("");
  };

  const getEventIcon = (type: CriminalTimelineEvent["type"]) => {
    switch (type) {
      case "crime":
        return <BadgeAlert className="h-4.5 w-4.5 text-red-400" />;
      case "fir":
        return <FileText className="h-4.5 w-4.5 text-blue-400" />;
      case "arrest":
        return <Lock className="h-4.5 w-4.5 text-amber-400" />;
      case "court":
        return <Scale className="h-4.5 w-4.5 text-purple-400" />;
      case "bail":
        return <Unlock className="h-4.5 w-4.5 text-emerald-400" />;
      default:
        return <History className="h-4.5 w-4.5 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: CriminalTimelineEvent["type"]) => {
    switch (type) {
      case "crime":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "fir":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "arrest":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      case "court":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";
      case "bail":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      default:
        return "border-white/10 bg-white/5 text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Loading criminal profiles...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-white/10 p-6 text-sm text-muted-foreground">
        Unable to load timeline records.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Criminal Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Track dynamic criminal records, history timelines, court trials, and status updates.
        </p>
      </div>

      {/* Filter Controls Panel */}
      <Card className="glass border-white/10 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Search Criminal Name</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search..."
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">FIR Number</label>
            <select
              value={filterFir}
              onChange={(e) => setFilterFir(e.target.value)}
              className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none"
            >
              <option value="" className="bg-card">
                All FIRs
              </option>
              {allFirs.map((fir) => (
                <option key={fir} value={fir} className="bg-card">
                  {fir}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Crime Type</label>
            <select
              value={filterCrimeType}
              onChange={(e) => setFilterCrimeType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none"
            >
              <option value="" className="bg-card">
                All Types
              </option>
              {allCrimeTypes.map((type) => (
                <option key={type} value={type} className="bg-card">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none"
            >
              <option value="" className="bg-card">
                All Years
              </option>
              {allYears.map((year) => (
                <option key={year} value={year} className="bg-card">
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="h-9 rounded border border-white/10 bg-white/5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </Card>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Criminals Sidebar */}
        <Card className="glass border-white/10 p-5 space-y-4 max-h-[600px] overflow-y-auto">
          <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold">
            Criminals ({filteredProfiles.length})
          </h2>
          <div className="space-y-2">
            {filteredProfiles.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No criminals match filters.</p>
            ) : (
              filteredProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-all",
                    selectedProfile?.id === p.id
                      ? "border-accent bg-primary/10 shadow-md"
                      : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-foreground text-sm">{p.name}</span>
                    {p.repeatOffender && (
                      <span className="rounded bg-red-500/10 border border-red-500/25 px-1 py-0.5 text-[9px] font-semibold text-red-400">
                        REPEAT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Age {p.age} · {p.gender} · {p.totalCrimes} cases
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 mt-1 truncate">
                    MO: {p.modusOperandi}
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Selected Criminal Timeline Detail */}
        {selectedProfile ? (
          <div className="space-y-6">
            {/* Criminal Information Header Card */}
            <Card className="glass border-white/10 p-5">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {selectedProfile.name}
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accused ID:{" "}
                    <span className="font-semibold text-foreground">{selectedProfile.id}</span> ·
                    Status:{" "}
                    <span className="font-semibold text-foreground">{selectedProfile.status}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Modus Operandi:{" "}
                    <span className="italic text-foreground">{selectedProfile.modusOperandi}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Demographics</p>
                  <p className="text-sm font-medium text-foreground">
                    Age {selectedProfile.age} · {selectedProfile.gender}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Risk classification:{" "}
                    <span
                      className={cn(
                        "font-bold",
                        selectedProfile.repeatOffender ? "text-red-400" : "text-amber-400",
                      )}
                    >
                      {selectedProfile.repeatOffender ? "High (Repeat)" : "Medium"}
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Interactive Timeline Card */}
            <Card className="glass border-white/10 p-6 space-y-6">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <History className="h-5 w-5 text-accent" /> Interactive Criminal History Timeline
              </h3>

              <div className="relative pl-6 border-l border-white/15 space-y-8 mt-4">
                {selectedProfile.timeline.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Event Circle Anchor */}
                    <div
                      className={cn(
                        "absolute -left-[38px] top-1 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110",
                        getEventColor(event.type),
                      )}
                    >
                      {getEventIcon(event.type)}
                    </div>

                    {/* Timeline Event Content */}
                    <div className="rounded-xl border border-white/10 bg-white/3 p-4 hover:border-white/20 hover:bg-white/5 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2">
                        <span className="text-[11px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {event.firNumber !== "N/A"
                            ? `FIR: ${event.firNumber}`
                            : `Crime Type: ${event.crimeType}`}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="glass border-white/10 p-6 text-center text-sm text-muted-foreground">
            No profile details available.
          </Card>
        )}
      </div>
    </div>
  );
}
