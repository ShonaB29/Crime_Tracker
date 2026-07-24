import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { G as Database, H as Eye, O as Lock, P as Info, Q as CircleAlert, U as EyeOff, W as Download, X as CircleCheck, ct as Bell, et as ChevronRight, g as RefreshCw, n as Wifi, r as WifiOff, s as User, st as Bot, u as Shield, y as Palette, z as FileText } from "../_libs/lucide-react.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Bjv58apD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var NAV = [
	{
		id: "profile",
		label: "Profile",
		icon: User
	},
	{
		id: "security",
		label: "Account Security",
		icon: Shield
	},
	{
		id: "ai",
		label: "AI Assistant",
		icon: Bot
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		id: "privacy",
		label: "Privacy & Access",
		icon: Lock
	},
	{
		id: "appearance",
		label: "Appearance",
		icon: Palette
	},
	{
		id: "data",
		label: "Data & Reports",
		icon: FileText
	},
	{
		id: "api",
		label: "API & Database",
		icon: Database,
		adminOnly: true
	},
	{
		id: "about",
		label: "About",
		icon: Info
	}
];
function SectionTitle({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 mb-6 pb-5 border-b border-white/8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-2 rounded-lg bg-primary/15 text-accent shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: description
		})] })]
	});
}
function FieldRow({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-6 py-3 border-b border-white/5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground",
				children: label
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: hint
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children
		})]
	});
}
function StatusPill({ ok, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", ok ? "bg-success/15 text-green-400" : "bg-destructive/15 text-red-400"),
		children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { size: 11 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { size: 11 }), label]
	});
}
function RadioGroup({ options, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 flex-wrap",
		children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onChange(opt.value),
			className: cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors", value === opt.value ? "bg-primary/20 border-primary/50 text-accent" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"),
			children: opt.label
		}, opt.value))
	});
}
function ProfileSection() {
	const [name, setName] = (0, import_react.useState)("Rajesh Kumar");
	const [badge, setBadge] = (0, import_react.useState)("KSP-2024-0471");
	const [email, setEmail] = (0, import_react.useState)("rajesh.kumar@ksp.gov.in");
	const [phone, setPhone] = (0, import_react.useState)("+91 98765 43210");
	const [saved, setSaved] = (0, import_react.useState)(false);
	function save() {
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: User,
			title: "Profile Settings",
			description: "Manage your officer profile and contact information."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shrink-0",
					children: "RK"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-foreground",
					children: "Inspector Rajesh Kumar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Bengaluru Urban · Badge KSP-2024-0471"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "ml-auto text-xs",
					children: "Change Photo"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4",
			children: [
				[
					{
						label: "Full Name",
						value: name,
						set: setName,
						placeholder: "Full name"
					},
					{
						label: "Badge / Employee ID",
						value: badge,
						set: setBadge,
						placeholder: "KSP-XXXX-XXXX"
					},
					{
						label: "Official Email",
						value: email,
						set: setEmail,
						placeholder: "name@ksp.gov.in"
					},
					{
						label: "Phone Number",
						value: phone,
						set: setPhone,
						placeholder: "+91 XXXXX XXXXX"
					}
				].map(({ label, value, set, placeholder }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1.5 block",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value,
					onChange: (e) => set(e.target.value),
					placeholder
				})] }, label)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1.5 block",
					children: "Rank / Role"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
					children: [
						"Constable",
						"Head Constable",
						"ASI",
						"SI",
						"Inspector",
						"DSP",
						"ACP",
						"DCP"
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: r,
						className: "bg-card",
						children: r
					}, r))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1.5 block",
					children: "District"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
					children: [
						"Bengaluru Urban",
						"Mysuru",
						"Belagavi",
						"Kalaburagi",
						"Ballari",
						"Dakshina Kannada"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: d,
						className: "bg-card",
						children: d
					}, d))
				})] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: save,
			className: "gap-2",
			children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " Saved!"] }) : "Update Profile"
		})
	] });
}
function SecuritySection() {
	const [show, setShow] = (0, import_react.useState)(false);
	const [twoFa, setTwoFa] = (0, import_react.useState)(true);
	const [pw, setPw] = (0, import_react.useState)("");
	const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : pw.length < 14 ? 3 : 4;
	const strengthLabel = [
		"",
		"Weak",
		"Fair",
		"Good",
		"Strong"
	];
	const strengthColor = [
		"",
		"bg-red-500",
		"bg-yellow-500",
		"bg-blue-400",
		"bg-green-400"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: Shield,
			title: "Account Security",
			description: "Manage your password, 2FA, and active sessions."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1.5 block",
						children: "New Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: show ? "text" : "password",
							placeholder: "Enter new password",
							value: pw,
							onChange: (e) => setPw(e.target.value),
							className: "pr-10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShow(!show),
							className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground",
							children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 })
						})]
					}),
					pw.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								1,
								2,
								3,
								4
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1 flex-1 rounded-full transition-colors", i <= strength ? strengthColor[strength] : "bg-white/10") }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Strength: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: strengthLabel[strength]
							})]
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1.5 block",
					children: "Confirm Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Confirm new password"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					children: "Change Password"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Two-Factor Authentication",
			hint: "Require OTP on every login",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: twoFa,
				onCheckedChange: setTwoFa
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Active Sessions",
			hint: "2 devices currently logged in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs",
				children: "View Sessions"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Login History",
			hint: "Last 30 days of login activity",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 12 }), "Export"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Logout All Devices",
			hint: "Immediately revoke all active sessions",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				size: "sm",
				className: "text-xs",
				children: "Logout All"
			})
		})
	] });
}
function AiSection() {
	const [lang, setLang] = (0, import_react.useState)("english");
	const [voice, setVoice] = (0, import_react.useState)(() => localStorage.getItem("voice_enabled") === "true");
	const [voiceSpeed, setVoiceSpeed] = (0, import_react.useState)(() => Number(localStorage.getItem("voice_speed") ?? "1.0"));
	const [selectedVoice, setSelectedVoice] = (0, import_react.useState)(() => localStorage.getItem("voice_name") ?? "");
	const [availableVoices, setAvailableVoices] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const loadVoices = () => {
			const voices = window.speechSynthesis.getVoices();
			setAvailableVoices(voices.filter((v) => v.lang.startsWith("en")));
		};
		loadVoices();
		if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = loadVoices;
	}, []);
	const [mode, setMode] = (0, import_react.useState)("detailed");
	const [creativity, setCreativity] = (0, import_react.useState)([65]);
	const [showSql, setShowSql] = (0, import_react.useState)(true);
	const [reasoning, setReasoning] = (0, import_react.useState)(true);
	const [predictive, setPredictive] = (0, import_react.useState)(true);
	const handleVoiceToggle = (checked) => {
		setVoice(checked);
		localStorage.setItem("voice_enabled", String(checked));
		if (!checked) window.speechSynthesis.cancel();
	};
	const handleVoiceSpeedChange = (values) => {
		const val = values[0];
		setVoiceSpeed(val);
		localStorage.setItem("voice_speed", String(val));
	};
	const handleVoiceNameChange = (name) => {
		setSelectedVoice(name);
		localStorage.setItem("voice_name", name);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				icon: Bot,
				title: "AI Assistant Settings",
				description: "Customise how the AI assistant responds to your queries."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Preferred Language",
				hint: "Language for AI responses",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
					options: [{
						value: "english",
						label: "English"
					}, {
						value: "kannada",
						label: "ಕನ್ನಡ"
					}],
					value: lang,
					onChange: setLang
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Voice Assistant",
				hint: "Enable spoken AI responses",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: voice,
					onCheckedChange: handleVoiceToggle
				})
			}),
			voice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Voice Selection",
				hint: "Choose accent for spoken AI answers",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedVoice,
					onChange: (e) => handleVoiceNameChange(e.target.value),
					className: "flex h-8 w-48 rounded-md border border-white/10 bg-transparent px-2 text-xs text-foreground focus-visible:outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						className: "bg-card",
						children: "Default System Voice"
					}), availableVoices.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: v.name,
						className: "bg-card",
						children: [
							v.name,
							" (",
							v.lang,
							")"
						]
					}, v.name))]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Voice Speed",
				hint: `Currently: ${voiceSpeed}x`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-36",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .5,
						max: 2,
						step: .1,
						value: [voiceSpeed],
						onValueChange: handleVoiceSpeedChange
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Response Mode",
				hint: "Controls answer length and depth",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
					options: [{
						value: "short",
						label: "Short"
					}, {
						value: "detailed",
						label: "Detailed"
					}],
					value: mode,
					onChange: setMode
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "AI Creativity",
				hint: `Current: ${creativity[0]}% — higher = more exploratory answers`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-36",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 0,
						max: 100,
						step: 5,
						value: creativity,
						onValueChange: setCreativity
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Show SQL Query",
				hint: "Display generated SQL (Admin only)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showSql,
					onCheckedChange: setShowSql
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Explain AI Reasoning",
				hint: "Show step-by-step reasoning chain",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: reasoning,
					onCheckedChange: setReasoning
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				label: "Enable Predictive Insights",
				hint: "AI-generated crime forecasts and hotspot predictions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: predictive,
					onCheckedChange: setPredictive
				})
			})
		]
	});
}
function NotificationsSection() {
	const items = [
		{
			key: "crime",
			label: "Crime Alert Notifications",
			hint: "Instant alerts for new high-severity crimes"
		},
		{
			key: "hotspot",
			label: "Hotspot Detection Alerts",
			hint: "Notify when a new hotspot is predicted"
		},
		{
			key: "invest",
			label: "Investigation Updates",
			hint: "Status changes on assigned cases"
		},
		{
			key: "email",
			label: "Email Notifications",
			hint: "Send alerts to your official email"
		},
		{
			key: "sms",
			label: "SMS Notifications",
			hint: "Send alerts to your registered phone"
		},
		{
			key: "push",
			label: "Push Notifications",
			hint: "Browser / app push notifications"
		}
	];
	const [state, setState] = (0, import_react.useState)({
		crime: true,
		hotspot: true,
		invest: true,
		email: true,
		sms: false,
		push: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
		icon: Bell,
		title: "Notifications",
		description: "Control which alerts and updates you receive."
	}), items.map(({ key, label, hint }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
		label,
		hint,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: state[key],
			onCheckedChange: (v) => setState((s) => ({
				...s,
				[key]: v
			}))
		})
	}, key))] });
}
function PrivacySection() {
	const [role, setRole] = (0, import_react.useState)("investigation");
	const [timeout, setTimeout_] = (0, import_react.useState)("30");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: Lock,
			title: "Privacy & Access Control",
			description: "Manage your role, data permissions, and session settings."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "User Role",
			hint: "Your current access level on the platform",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [
					{
						value: "admin",
						label: "Admin"
					},
					{
						value: "senior",
						label: "Senior Officer"
					},
					{
						value: "investigation",
						label: "Investigation Officer"
					},
					{
						value: "station",
						label: "Station Officer"
					}
				],
				value: role,
				onChange: setRole
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Data Access Permissions",
			hint: "Districts and modules you can access",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs",
				children: "Manage"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Activity Logs",
			hint: "View your recent platform activity",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs",
				children: "View Logs"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Download Audit Logs",
			hint: "Export full audit trail as CSV",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 12 }), "Download"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Session Timeout",
			hint: "Auto-logout after inactivity",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [
					{
						value: "15",
						label: "15 min"
					},
					{
						value: "30",
						label: "30 min"
					},
					{
						value: "60",
						label: "1 hr"
					},
					{
						value: "120",
						label: "2 hr"
					}
				],
				value: timeout,
				onChange: setTimeout_
			})
		})
	] });
}
function AppearanceSection() {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	const [density, setDensity] = (0, import_react.useState)("default");
	const [fontSize, setFontSize] = (0, import_react.useState)("md");
	const ACCENTS = [
		"#42a5f5",
		"#7e57c2",
		"#26a69a",
		"#ef5350",
		"#ffa726",
		"#66bb6a"
	];
	const [accent, setAccent] = (0, import_react.useState)(ACCENTS[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: Palette,
			title: "Appearance",
			description: "Customise the look and feel of the platform."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Theme",
			hint: "Platform colour scheme",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [
					{
						value: "dark",
						label: "Dark"
					},
					{
						value: "light",
						label: "Light"
					},
					{
						value: "system",
						label: "System"
					}
				],
				value: theme,
				onChange: setTheme
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Font Size",
			hint: "Base text size across the platform",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [
					{
						value: "sm",
						label: "Small"
					},
					{
						value: "md",
						label: "Medium"
					},
					{
						value: "lg",
						label: "Large"
					}
				],
				value: fontSize,
				onChange: setFontSize
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Dashboard Density",
			hint: "Controls spacing between elements",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [
					{
						value: "compact",
						label: "Compact"
					},
					{
						value: "default",
						label: "Default"
					},
					{
						value: "comfortable",
						label: "Comfortable"
					}
				],
				value: density,
				onChange: setDensity
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Accent Colour",
			hint: "Primary highlight colour",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: ACCENTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setAccent(c),
					className: cn("h-6 w-6 rounded-full border-2 transition-transform hover:scale-110", accent === c ? "border-white scale-110" : "border-transparent"),
					style: { backgroundColor: c }
				}, c))
			})
		})
	] });
}
function DataSection() {
	const [format, setFormat] = (0, import_react.useState)("pdf");
	const [autoSave, setAutoSave] = (0, import_react.useState)(true);
	const [autoDel, setAutoDel] = (0, import_react.useState)(false);
	const [days, setDays] = (0, import_react.useState)([30]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: FileText,
			title: "Data & Reports",
			description: "Configure default report formats and conversation history."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Default Report Format",
			hint: "Format used when exporting reports",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				options: [{
					value: "pdf",
					label: "PDF"
				}, {
					value: "excel",
					label: "Excel"
				}],
				value: format,
				onChange: setFormat
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Auto Save Conversation",
			hint: "Automatically save AI chat sessions",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: autoSave,
				onCheckedChange: setAutoSave
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Auto Delete Chat History",
			hint: "Purge conversations after set days",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: autoDel,
				onCheckedChange: setAutoDel
			})
		}),
		autoDel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Delete After",
			hint: `${days[0]} days`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 7,
					max: 90,
					step: 7,
					value: days,
					onValueChange: setDays
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Download Conversation History",
			hint: "Export all saved AI conversations",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 12 }), "Export"]
			})
		})
	] });
}
function ApiSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: Database,
			title: "API & Database",
			description: "Admin-only: service health, API keys, and model management."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 mb-6",
			children: [
				{
					name: "PostgreSQL / Supabase",
					ok: true,
					detail: "jhxlidizbymrogwwecxb · prod"
				},
				{
					name: "Vector Database (RAG)",
					ok: true,
					detail: "In-memory corpus · 42 chunks"
				},
				{
					name: "LLM Engine",
					ok: true,
					detail: "Hybrid Text-to-SQL + Analysis"
				},
				{
					name: "Crime Data Store",
					ok: true,
					detail: "10,000 crimes · 5,000 FIRs"
				}
			].map(({ name, ok, detail }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/5 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-foreground",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: detail
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
					ok,
					label: ok ? "Connected" : "Offline"
				})]
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "API Keys",
			hint: "Manage service API credentials",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 12 }), "View Keys"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Test Database Connection",
			hint: "Run a live connectivity check",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { size: 12 }), "Test"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
			label: "Refresh AI Models",
			hint: "Reload model weights and corpus index",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "text-xs gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 12 }), "Refresh"]
			})
		})
	] });
}
function AboutSection() {
	const rows = [
		{
			label: "Project Name",
			value: "KSP Crime Intelligence Platform"
		},
		{
			label: "Version",
			value: "v1.0.0"
		},
		{
			label: "Last Updated",
			value: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			})
		},
		{
			label: "AI Model",
			value: "Hybrid Text-to-SQL + RAG + Analysis Engine"
		},
		{
			label: "Data Source",
			value: "NCRB Karnataka · In-memory seed"
		},
		{
			label: "Support Contact",
			value: "support@ksp-ai.gov.in"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			icon: Info,
			title: "About",
			description: "Platform information, legal, and support."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-white/8 bg-white/5 overflow-hidden mb-5",
			children: rows.map(({ label, value }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center justify-between gap-4 px-4 py-3 text-sm", i < rows.length - 1 && "border-b border-white/5"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground text-right",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "text-xs",
					children: "Privacy Policy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "text-xs",
					children: "Terms & Conditions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "text-xs gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 12 }), "Report Issue"]
				})
			]
		})
	] });
}
var SECTION_MAP = {
	profile: ProfileSection,
	security: SecuritySection,
	ai: AiSection,
	notifications: NotificationsSection,
	privacy: PrivacySection,
	appearance: AppearanceSection,
	data: DataSection,
	api: ApiSection,
	about: AboutSection
};
function SettingsPage() {
	const [active, setActive] = (0, import_react.useState)("profile");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const visibleNav = NAV.filter((n) => !n.adminOnly || true);
	const ActiveSection = SECTION_MAP[active];
	function handleSave() {
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-bold text-foreground",
			children: "Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Manage your profile, security, AI preferences, and system configuration."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-5 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "glass border-white/10 w-52 shrink-0 p-2 sticky top-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "space-y-0.5",
					children: visibleNav.map(({ id, label, icon: Icon, adminOnly }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActive(id),
						className: cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left", active === id ? "bg-primary/20 text-accent font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								size: 15,
								className: "shrink-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 truncate",
								children: label
							}),
							adminOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold uppercase tracking-wider text-yellow-500/80 bg-yellow-500/10 px-1.5 py-0.5 rounded",
								children: "Admin"
							}),
							active === id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								size: 13,
								className: "shrink-0 opacity-60"
							})
						]
					}, id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "glass border-white/10 p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveSection, {})
				}), active !== "about" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-xs text-muted-foreground",
							children: "Reset to Default"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "text-xs",
							children: "Cancel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: handleSave,
							className: "gap-1.5 text-xs",
							children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 13 }), " Saved!"] }) : "Save Changes"
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };
