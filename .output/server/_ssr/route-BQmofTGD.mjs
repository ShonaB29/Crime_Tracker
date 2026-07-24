import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Menu, D as LogOut, H as Eye, I as History, L as FolderOpen, S as MessageSquare, V as FileChartColumnIncreasing, Y as Circle, Z as CircleCheckBig, at as Building2, b as Network, ct as Bell, et as ChevronRight, f as ShieldAlert, j as LayoutDashboard, l as TriangleAlert, lt as BadgeInfo, m as Search, nt as Check, o as Users, ot as Brain, p as Settings, rt as ChartColumn, t as X, w as Map, z as FileText } from "../_libs/lucide-react.mjs";
import { n as ROLE_LABELS, r as useAuth } from "./useAuth-C2tvUku-.mjs";
import { t as ksp_emblem_default } from "./ksp-emblem-ByXYWd1P.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BQmofTGD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_NOTIFICATIONS = [
	{
		id: "notif-1",
		title: "High Crime Risk Warning",
		description: "Dharwad district risk score increased to 82. Patrol frequency elevation recommended.",
		timestamp: "10 mins ago",
		priority: "High",
		category: "risk",
		read: false
	},
	{
		id: "notif-2",
		title: "New Cyber Fraud FIR Registered",
		description: "FIR/K04/000842/2026 filed at Indiranagar PS involving fake banking gateway.",
		timestamp: "1 hour ago",
		priority: "High",
		category: "fir",
		read: false
	},
	{
		id: "notif-3",
		title: "Investigation Case Update",
		description: "Forensic analysis deadline set for Case K01/000001 details checklist tomorrow.",
		timestamp: "3 hours ago",
		priority: "Medium",
		category: "investigation",
		read: false
	},
	{
		id: "notif-4",
		title: "Wanted Suspect Location Alert",
		description: "Wanted criminal Naveen Gowda reported spotted near Belagavi border checkpoint.",
		timestamp: "5 hours ago",
		priority: "High",
		category: "case",
		read: false
	},
	{
		id: "notif-5",
		title: "System Database Sync Success",
		description: "Daily automated cloud backup completed for Bengaluru district crime records.",
		timestamp: "1 day ago",
		priority: "Low",
		category: "system",
		read: true
	}
];
function NotificationCenter() {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [priorityFilter, setPriorityFilter] = (0, import_react.useState)("All");
	const panelRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("ksp_notifications");
		if (stored) setNotifications(JSON.parse(stored));
		else {
			localStorage.setItem("ksp_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
			setNotifications(INITIAL_NOTIFICATIONS);
		}
	}, []);
	const saveNotifications = (newNotifs) => {
		setNotifications(newNotifs);
		localStorage.setItem("ksp_notifications", JSON.stringify(newNotifs));
	};
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (panelRef.current && !panelRef.current.contains(event.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		return notifications.filter((n) => {
			const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase());
			const matchPriority = priorityFilter === "All" || n.priority === priorityFilter;
			return matchSearch && matchPriority;
		});
	}, [
		notifications,
		search,
		priorityFilter
	]);
	const unreadCount = (0, import_react.useMemo)(() => {
		return notifications.filter((n) => !n.read).length;
	}, [notifications]);
	const handleMarkAsRead = (id) => {
		const updated = notifications.map((n) => n.id === id ? {
			...n,
			read: true
		} : n);
		saveNotifications(updated);
	};
	const handleMarkAllAsRead = () => {
		const updated = notifications.map((n) => ({
			...n,
			read: true
		}));
		saveNotifications(updated);
	};
	const getPriorityColor = (p) => {
		switch (p) {
			case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
			case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
			case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
		}
	};
	const getCategoryIcon = (cat) => {
		switch (cat) {
			case "risk": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-red-400" });
			case "fir": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-accent" });
			case "investigation": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-amber-400" });
			case "case": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-red-400" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeInfo, { className: "h-4 w-4 text-blue-400" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref: panelRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-card/60 transition-colors hover:bg-card hover:text-foreground text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse",
				children: unreadCount
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "absolute right-0 mt-2 z-50 w-[360px] overflow-hidden border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-in sm:w-[400px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold text-foreground text-sm uppercase tracking-wider",
							children: "Alert Center"
						}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent",
							children: [unreadCount, " Unread"]
						})]
					}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleMarkAllAsRead,
						className: "text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), " Mark all read"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-b border-white/10 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search alerts...",
							className: "w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/40"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							"All",
							"High",
							"Medium",
							"Low"
						].map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPriorityFilter(filter),
							className: cn("rounded px-2.5 py-1 text-[10px] font-semibold border transition-all uppercase tracking-wider", priorityFilter === filter ? "bg-accent/15 border-accent/30 text-accent" : "bg-white/3 border-white/5 text-muted-foreground hover:bg-white/5"),
							children: filter
						}, filter))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[320px] overflow-y-auto divide-y divide-white/5",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground italic",
						children: "No alerts found matching search criteria."
					}) : filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleMarkAsRead(n.id),
						className: cn("p-3.5 transition-colors cursor-pointer flex gap-3 relative", n.read ? "bg-transparent hover:bg-white/2" : "bg-primary/5 hover:bg-primary/8 border-l-2 border-l-accent"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded-lg bg-white/3 shrink-0 h-8 w-8 flex items-center justify-center border border-white/5",
								children: getCategoryIcon(n.category)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground text-xs leading-snug",
											children: n.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground shrink-0 mt-0.5",
											children: n.timestamp
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-normal",
										children: n.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2 pt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider", getPriorityColor(n.priority)),
											children: n.priority
										})
									})
								]
							}),
							!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-3.5 bottom-3.5 h-2 w-2 rounded-full bg-accent" })
						]
					}, n.id))
				})
			]
		})]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var NAV_ITEMS = [
	{
		label: "Dashboard",
		to: "/dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Crimes",
		to: "/crimes",
		icon: ShieldAlert
	},
	{
		label: "FIR Records",
		to: "/fir",
		icon: FileText
	},
	{
		label: "Evidence Management",
		to: "/evidence",
		icon: FolderOpen
	},
	{
		label: "Criminal Timeline",
		to: "/timeline",
		icon: History
	},
	{
		label: "Districts",
		to: "/districts",
		icon: Building2
	},
	{
		label: "Crime Map",
		to: "/map",
		icon: Map
	},
	{
		label: "AI Intelligence",
		to: "/ai",
		icon: Brain,
		roles: ["admin", "analyst"]
	},
	{
		label: "Network Analysis",
		to: "/network",
		icon: Network,
		roles: ["admin", "analyst"]
	},
	{
		label: "Analytics",
		to: "/analytics",
		icon: ChartColumn
	},
	{
		label: "AI Assistant",
		to: "/assistant",
		icon: MessageSquare
	},
	{
		label: "Reports",
		to: "/reports",
		icon: FileChartColumnIncreasing
	},
	{
		label: "Admin",
		to: "/admin",
		icon: Users,
		roles: ["admin"]
	},
	{
		label: "Settings",
		to: "/settings",
		icon: Settings
	}
];
function DashboardLayout({ children }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const { profile, roles, hasAnyRole, signOut } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const visibleItems = NAV_ITEMS.filter((item) => !item.roles || hasAnyRole(item.roles));
	const initials = (profile?.full_name ?? "Officer").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/auth" });
	};
	const SidebarContent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ksp_emblem_default,
					alt: "KSP",
					className: "h-10 w-10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-bold text-foreground",
						children: "KSP Intelligence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-accent",
						children: "Crime Analytics"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 overflow-y-auto px-3 py-2",
				children: visibleItems.map((item) => {
					const active = pathname === item.to || pathname.startsWith(item.to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setMobileOpen(false),
						className: cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary/15 text-accent shadow-[inset_2px_0_0_0_hsl(var(--accent))]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4.5 w-4.5 shrink-0" }), item.label]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-white/10 p-3 text-[10px] text-muted-foreground/60",
				children: "v1.0 · Restricted Access"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-card/60 backdrop-blur-xl lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {})
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/60",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setMobileOpen((o) => !o),
							"aria-label": "Toggle navigation",
							children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Karnataka State Police"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-semibold text-foreground",
								children: "Crime Intelligence Platform"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenter, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-3 rounded-full border border-white/10 bg-card/60 py-1 pl-1 pr-3 transition-colors hover:bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden text-left sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-medium leading-tight text-foreground",
										children: profile?.full_name ?? "Officer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] leading-tight text-muted-foreground",
										children: roles.map((r) => ROLE_LABELS[r]).join(", ") || "No role"
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: profile?.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: profile?.email
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => navigate({ to: "/settings" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), " Settings"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: handleSignOut,
									className: "text-danger focus:text-danger",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
								})
							]
						})] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "p-4 sm:p-6",
					children
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
