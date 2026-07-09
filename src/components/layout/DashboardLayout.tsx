import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Map,
  Building2,
  Brain,
  Network,
  BarChart3,
  MessageSquare,
  FileBarChart,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth, ROLE_LABELS, type AppRole } from "@/hooks/useAuth";
import kspEmblem from "@/assets/ksp-emblem.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  roles?: AppRole[]; // undefined = all roles
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Crimes", to: "/crimes", icon: ShieldAlert },
  { label: "FIR Records", to: "/fir", icon: FileText },
  { label: "Districts", to: "/districts", icon: Building2 },
  { label: "Crime Map", to: "/map", icon: Map },
  { label: "AI Intelligence", to: "/ai", icon: Brain, roles: ["admin", "analyst"] },
  { label: "Network Analysis", to: "/network", icon: Network, roles: ["admin", "analyst"] },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "AI Assistant", to: "/assistant", icon: MessageSquare },
  { label: "Reports", to: "/reports", icon: FileBarChart },
  { label: "Admin", to: "/admin", icon: Users, roles: ["admin"] },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, roles, hasAnyRole, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || hasAnyRole(item.roles));
  const initials = (profile?.full_name ?? "Officer")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src={kspEmblem} alt="KSP" className="h-10 w-10" />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-foreground">KSP Intelligence</p>
          <p className="text-[10px] uppercase tracking-widest text-accent">Crime Analytics</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {visibleItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-accent shadow-[inset_2px_0_0_0_hsl(var(--accent))]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 text-[10px] text-muted-foreground/60">
        v1.0 · Restricted Access
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-card/60 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-card">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Karnataka State Police
              </p>
              <p className="font-display text-sm font-semibold text-foreground">
                Crime Intelligence Platform
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-white/10 bg-card/60 py-1 pl-1 pr-3 transition-colors hover:bg-card">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium leading-tight text-foreground">
                    {profile?.full_name ?? "Officer"}
                  </span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    {roles.map((r) => ROLE_LABELS[r]).join(", ") || "No role"}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-danger focus:text-danger">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
