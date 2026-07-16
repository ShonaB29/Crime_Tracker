import { useState, useEffect, useMemo, useRef } from "react";
import { Bell, Search, CheckCircle, AlertTriangle, ShieldAlert, BadgeInfo, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  category: "fir" | "risk" | "investigation" | "system" | "case";
  read: boolean;
}

// Initial mock notifications to seed the list
const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "High Crime Risk Warning",
    description: "Dharwad district risk score increased to 82. Patrol frequency elevation recommended.",
    timestamp: "10 mins ago",
    priority: "High",
    category: "risk",
    read: false,
  },
  {
    id: "notif-2",
    title: "New Cyber Fraud FIR Registered",
    description: "FIR/K04/000842/2026 filed at Indiranagar PS involving fake banking gateway.",
    timestamp: "1 hour ago",
    priority: "High",
    category: "fir",
    read: false,
  },
  {
    id: "notif-3",
    title: "Investigation Case Update",
    description: "Forensic analysis deadline set for Case K01/000001 details checklist tomorrow.",
    timestamp: "3 hours ago",
    priority: "Medium",
    category: "investigation",
    read: false,
  },
  {
    id: "notif-4",
    title: "Wanted Suspect Location Alert",
    description: "Wanted criminal Naveen Gowda reported spotted near Belagavi border checkpoint.",
    timestamp: "5 hours ago",
    priority: "High",
    category: "case",
    read: false,
  },
  {
    id: "notif-5",
    title: "System Database Sync Success",
    description: "Daily automated cloud backup completed for Bengaluru district crime records.",
    timestamp: "1 day ago",
    priority: "Low",
    category: "system",
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const panelRef = useRef<HTMLDivElement>(null);

  // Load and seed notifications in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ksp_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      localStorage.setItem("ksp_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  // Sync to localStorage
  const saveNotifications = (newNotifs: SystemNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem("ksp_notifications", JSON.stringify(newNotifs));
  };

  // Close panel on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered notifications
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchSearch = 
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase());
      
      const matchPriority = priorityFilter === "All" || n.priority === priorityFilter;

      return matchSearch && matchPriority;
    });
  }, [notifications, search, priorityFilter]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const getPriorityColor = (p: SystemNotification["priority"]) => {
    switch (p) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getCategoryIcon = (cat: SystemNotification["category"]) => {
    switch (cat) {
      case "risk": return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "fir": return <ShieldAlert className="h-4 w-4 text-accent" />;
      case "investigation": return <Eye className="h-4 w-4 text-amber-400" />;
      case "case": return <ShieldAlert className="h-4 w-4 text-red-400" />;
      default: return <BadgeInfo className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-card/60 transition-colors hover:bg-card hover:text-foreground text-muted-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 z-50 w-[360px] overflow-hidden border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-in sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-foreground text-sm uppercase tracking-wider">Alert Center</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts..."
                className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex gap-1">
              {(["All", "High", "Medium", "Low"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriorityFilter(filter)}
                  className={cn(
                    "rounded px-2.5 py-1 text-[10px] font-semibold border transition-all uppercase tracking-wider",
                    priorityFilter === filter
                      ? "bg-accent/15 border-accent/30 text-accent"
                      : "bg-white/3 border-white/5 text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground italic">
                No alerts found matching search criteria.
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={cn(
                    "p-3.5 transition-colors cursor-pointer flex gap-3 relative",
                    n.read ? "bg-transparent hover:bg-white/2" : "bg-primary/5 hover:bg-primary/8 border-l-2 border-l-accent"
                  )}
                >
                  {/* Category icon */}
                  <div className="p-2 rounded-lg bg-white/3 shrink-0 h-8 w-8 flex items-center justify-center border border-white/5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-foreground text-xs leading-snug">{n.title}</span>
                      <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">{n.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className={cn("rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider", getPriorityColor(n.priority))}>
                        {n.priority}
                      </span>
                    </div>
                  </div>

                  {/* Unread Indicator dot */}
                  {!n.read && (
                    <span className="absolute right-3.5 bottom-3.5 h-2 w-2 rounded-full bg-accent" />
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
