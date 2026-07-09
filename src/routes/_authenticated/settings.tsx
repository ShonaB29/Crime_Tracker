import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  User, Shield, Bot, Bell, Lock, Palette, FileText,
  Database, Info, ChevronRight, CheckCircle2, AlertCircle,
  Eye, EyeOff, Download, RefreshCw, Wifi, WifiOff,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings · KSP Crime Intelligence" }] }),
  component: SettingsPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────
type Section =
  | "profile" | "security" | "ai" | "notifications"
  | "privacy" | "appearance" | "data" | "api" | "about";

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV: { id: Section; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: "profile",       label: "Profile",            icon: User },
  { id: "security",      label: "Account Security",   icon: Shield },
  { id: "ai",            label: "AI Assistant",        icon: Bot },
  { id: "notifications", label: "Notifications",       icon: Bell },
  { id: "privacy",       label: "Privacy & Access",    icon: Lock },
  { id: "appearance",    label: "Appearance",          icon: Palette },
  { id: "data",          label: "Data & Reports",      icon: FileText },
  { id: "api",           label: "API & Database",      icon: Database, adminOnly: true },
  { id: "about",         label: "About",               icon: Info },
];

// ── Small reusable primitives ─────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-5 border-b border-white/8">
      <div className="p-2 rounded-lg bg-primary/15 text-accent shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      ok ? "bg-success/15 text-green-400" : "bg-destructive/15 text-red-400")}>
      {ok ? <Wifi size={11} /> : <WifiOff size={11} />}
      {label}
    </span>
  );
}

function RadioGroup<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            value === opt.value
              ? "bg-primary/20 border-primary/50 text-accent"
              : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Section components ────────────────────────────────────────────────────────

function ProfileSection() {
  const [name, setName] = useState("Rajesh Kumar");
  const [badge, setBadge] = useState("KSP-2024-0471");
  const [email, setEmail] = useState("rajesh.kumar@ksp.gov.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div>
      <SectionTitle icon={User} title="Profile Settings" description="Manage your officer profile and contact information." />

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shrink-0">
          RK
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Inspector Rajesh Kumar</p>
          <p className="text-xs text-muted-foreground">Bengaluru Urban · Badge KSP-2024-0471</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto text-xs">Change Photo</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Full Name", value: name, set: setName, placeholder: "Full name" },
          { label: "Badge / Employee ID", value: badge, set: setBadge, placeholder: "KSP-XXXX-XXXX" },
          { label: "Official Email", value: email, set: setEmail, placeholder: "name@ksp.gov.in" },
          { label: "Phone Number", value: phone, set: setPhone, placeholder: "+91 XXXXX XXXXX" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
            <Input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} />
          </div>
        ))}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Rank / Role</label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {["Constable", "Head Constable", "ASI", "SI", "Inspector", "DSP", "ACP", "DCP"].map((r) => (
              <option key={r} value={r} className="bg-card">{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">District</label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {["Bengaluru Urban", "Mysuru", "Belagavi", "Kalaburagi", "Ballari", "Dakshina Kannada"].map((d) => (
              <option key={d} value={d} className="bg-card">{d}</option>
            ))}
          </select>
        </div>
      </div>

      <Button onClick={save} className="gap-2">
        {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Update Profile"}
      </Button>
    </div>
  );
}

function SecuritySection() {
  const [show, setShow] = useState(false);
  const [twoFa, setTwoFa] = useState(true);
  const [pw, setPw] = useState("");
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : pw.length < 14 ? 3 : 4;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-green-400"];

  return (
    <div>
      <SectionTitle icon={Shield} title="Account Security" description="Manage your password, 2FA, and active sessions." />

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">New Password</label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter new password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="pr-10"
            />
            <button onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {pw.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength ? strengthColor[strength] : "bg-white/10")} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Strength: <span className="text-foreground">{strengthLabel[strength]}</span></p>
            </div>
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Confirm Password</label>
          <Input type="password" placeholder="Confirm new password" />
        </div>
        <Button size="sm">Change Password</Button>
      </div>

      <FieldRow label="Two-Factor Authentication" hint="Require OTP on every login">
        <Switch checked={twoFa} onCheckedChange={setTwoFa} />
      </FieldRow>
      <FieldRow label="Active Sessions" hint="2 devices currently logged in">
        <Button variant="outline" size="sm" className="text-xs">View Sessions</Button>
      </FieldRow>
      <FieldRow label="Login History" hint="Last 30 days of login activity">
        <Button variant="outline" size="sm" className="text-xs gap-1"><Download size={12} />Export</Button>
      </FieldRow>
      <FieldRow label="Logout All Devices" hint="Immediately revoke all active sessions">
        <Button variant="destructive" size="sm" className="text-xs">Logout All</Button>
      </FieldRow>
    </div>
  );
}

function AiSection() {
  const [lang, setLang] = useState<"english" | "kannada">("english");
  const [voice, setVoice] = useState(false);
  const [mode, setMode] = useState<"short" | "detailed">("detailed");
  const [creativity, setCreativity] = useState([65]);
  const [showSql, setShowSql] = useState(true);
  const [reasoning, setReasoning] = useState(true);
  const [predictive, setPredictive] = useState(true);

  return (
    <div>
      <SectionTitle icon={Bot} title="AI Assistant Settings" description="Customise how the AI assistant responds to your queries." />

      <FieldRow label="Preferred Language" hint="Language for AI responses">
        <RadioGroup
          options={[{ value: "english", label: "English" }, { value: "kannada", label: "ಕನ್ನಡ" }]}
          value={lang} onChange={setLang}
        />
      </FieldRow>
      <FieldRow label="Voice Assistant" hint="Enable spoken AI responses">
        <Switch checked={voice} onCheckedChange={setVoice} />
      </FieldRow>
      <FieldRow label="Response Mode" hint="Controls answer length and depth">
        <RadioGroup
          options={[{ value: "short", label: "Short" }, { value: "detailed", label: "Detailed" }]}
          value={mode} onChange={setMode}
        />
      </FieldRow>
      <FieldRow label="AI Creativity" hint={`Current: ${creativity[0]}% — higher = more exploratory answers`}>
        <div className="w-36">
          <Slider min={0} max={100} step={5} value={creativity} onValueChange={setCreativity} />
        </div>
      </FieldRow>
      <FieldRow label="Show SQL Query" hint="Display generated SQL (Admin only)">
        <Switch checked={showSql} onCheckedChange={setShowSql} />
      </FieldRow>
      <FieldRow label="Explain AI Reasoning" hint="Show step-by-step reasoning chain">
        <Switch checked={reasoning} onCheckedChange={setReasoning} />
      </FieldRow>
      <FieldRow label="Enable Predictive Insights" hint="AI-generated crime forecasts and hotspot predictions">
        <Switch checked={predictive} onCheckedChange={setPredictive} />
      </FieldRow>
    </div>
  );
}

function NotificationsSection() {
  const items = [
    { key: "crime",       label: "Crime Alert Notifications",  hint: "Instant alerts for new high-severity crimes" },
    { key: "hotspot",     label: "Hotspot Detection Alerts",   hint: "Notify when a new hotspot is predicted" },
    { key: "invest",      label: "Investigation Updates",      hint: "Status changes on assigned cases" },
    { key: "email",       label: "Email Notifications",        hint: "Send alerts to your official email" },
    { key: "sms",         label: "SMS Notifications",          hint: "Send alerts to your registered phone" },
    { key: "push",        label: "Push Notifications",         hint: "Browser / app push notifications" },
  ];
  const [state, setState] = useState<Record<string, boolean>>({
    crime: true, hotspot: true, invest: true, email: true, sms: false, push: true,
  });

  return (
    <div>
      <SectionTitle icon={Bell} title="Notifications" description="Control which alerts and updates you receive." />
      {items.map(({ key, label, hint }) => (
        <FieldRow key={key} label={label} hint={hint}>
          <Switch checked={state[key]} onCheckedChange={(v) => setState((s) => ({ ...s, [key]: v }))} />
        </FieldRow>
      ))}
    </div>
  );
}

function PrivacySection() {
  const [role, setRole] = useState<"admin" | "senior" | "investigation" | "station">("investigation");
  const [timeout, setTimeout_] = useState<"15" | "30" | "60" | "120">("30");

  return (
    <div>
      <SectionTitle icon={Lock} title="Privacy & Access Control" description="Manage your role, data permissions, and session settings." />

      <FieldRow label="User Role" hint="Your current access level on the platform">
        <RadioGroup
          options={[
            { value: "admin",         label: "Admin" },
            { value: "senior",        label: "Senior Officer" },
            { value: "investigation", label: "Investigation Officer" },
            { value: "station",       label: "Station Officer" },
          ]}
          value={role} onChange={setRole}
        />
      </FieldRow>
      <FieldRow label="Data Access Permissions" hint="Districts and modules you can access">
        <Button variant="outline" size="sm" className="text-xs">Manage</Button>
      </FieldRow>
      <FieldRow label="Activity Logs" hint="View your recent platform activity">
        <Button variant="outline" size="sm" className="text-xs">View Logs</Button>
      </FieldRow>
      <FieldRow label="Download Audit Logs" hint="Export full audit trail as CSV">
        <Button variant="outline" size="sm" className="text-xs gap-1"><Download size={12} />Download</Button>
      </FieldRow>
      <FieldRow label="Session Timeout" hint="Auto-logout after inactivity">
        <RadioGroup
          options={[
            { value: "15",  label: "15 min" },
            { value: "30",  label: "30 min" },
            { value: "60",  label: "1 hr" },
            { value: "120", label: "2 hr" },
          ]}
          value={timeout} onChange={setTimeout_}
        />
      </FieldRow>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [density, setDensity] = useState<"compact" | "default" | "comfortable">("default");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const ACCENTS = ["#42a5f5", "#7e57c2", "#26a69a", "#ef5350", "#ffa726", "#66bb6a"];
  const [accent, setAccent] = useState(ACCENTS[0]);

  return (
    <div>
      <SectionTitle icon={Palette} title="Appearance" description="Customise the look and feel of the platform." />

      <FieldRow label="Theme" hint="Platform colour scheme">
        <RadioGroup
          options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }]}
          value={theme} onChange={setTheme}
        />
      </FieldRow>
      <FieldRow label="Font Size" hint="Base text size across the platform">
        <RadioGroup
          options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]}
          value={fontSize} onChange={setFontSize}
        />
      </FieldRow>
      <FieldRow label="Dashboard Density" hint="Controls spacing between elements">
        <RadioGroup
          options={[{ value: "compact", label: "Compact" }, { value: "default", label: "Default" }, { value: "comfortable", label: "Comfortable" }]}
          value={density} onChange={setDensity}
        />
      </FieldRow>
      <FieldRow label="Accent Colour" hint="Primary highlight colour">
        <div className="flex gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={cn("h-6 w-6 rounded-full border-2 transition-transform hover:scale-110", accent === c ? "border-white scale-110" : "border-transparent")}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </FieldRow>
    </div>
  );
}

function DataSection() {
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [autoSave, setAutoSave] = useState(true);
  const [autoDel, setAutoDel] = useState(false);
  const [days, setDays] = useState([30]);

  return (
    <div>
      <SectionTitle icon={FileText} title="Data & Reports" description="Configure default report formats and conversation history." />

      <FieldRow label="Default Report Format" hint="Format used when exporting reports">
        <RadioGroup
          options={[{ value: "pdf", label: "PDF" }, { value: "excel", label: "Excel" }]}
          value={format} onChange={setFormat}
        />
      </FieldRow>
      <FieldRow label="Auto Save Conversation" hint="Automatically save AI chat sessions">
        <Switch checked={autoSave} onCheckedChange={setAutoSave} />
      </FieldRow>
      <FieldRow label="Auto Delete Chat History" hint="Purge conversations after set days">
        <Switch checked={autoDel} onCheckedChange={setAutoDel} />
      </FieldRow>
      {autoDel && (
        <FieldRow label="Delete After" hint={`${days[0]} days`}>
          <div className="w-36">
            <Slider min={7} max={90} step={7} value={days} onValueChange={setDays} />
          </div>
        </FieldRow>
      )}
      <FieldRow label="Download Conversation History" hint="Export all saved AI conversations">
        <Button variant="outline" size="sm" className="text-xs gap-1"><Download size={12} />Export</Button>
      </FieldRow>
    </div>
  );
}

function ApiSection() {
  const services = [
    { name: "PostgreSQL / Supabase", ok: true,  detail: "jhxlidizbymrogwwecxb · prod" },
    { name: "Vector Database (RAG)", ok: true,  detail: "In-memory corpus · 42 chunks" },
    { name: "LLM Engine",            ok: true,  detail: "Hybrid Text-to-SQL + Analysis" },
    { name: "Crime Data Store",      ok: true,  detail: "10,000 crimes · 5,000 FIRs" },
  ];

  return (
    <div>
      <SectionTitle icon={Database} title="API & Database" description="Admin-only: service health, API keys, and model management." />

      <div className="space-y-3 mb-6">
        {services.map(({ name, ok, detail }) => (
          <div key={name} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
            <StatusPill ok={ok} label={ok ? "Connected" : "Offline"} />
          </div>
        ))}
      </div>

      <FieldRow label="API Keys" hint="Manage service API credentials">
        <Button variant="outline" size="sm" className="text-xs gap-1"><Eye size={12} />View Keys</Button>
      </FieldRow>
      <FieldRow label="Test Database Connection" hint="Run a live connectivity check">
        <Button variant="outline" size="sm" className="text-xs gap-1"><Wifi size={12} />Test</Button>
      </FieldRow>
      <FieldRow label="Refresh AI Models" hint="Reload model weights and corpus index">
        <Button variant="outline" size="sm" className="text-xs gap-1"><RefreshCw size={12} />Refresh</Button>
      </FieldRow>
    </div>
  );
}

function AboutSection() {
  const rows = [
    { label: "Project Name",    value: "KSP Crime Intelligence Platform" },
    { label: "Version",         value: "v1.0.0" },
    { label: "Last Updated",    value: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    { label: "AI Model",        value: "Hybrid Text-to-SQL + RAG + Analysis Engine" },
    { label: "Data Source",     value: "NCRB Karnataka · In-memory seed" },
    { label: "Support Contact", value: "support@ksp-ai.gov.in" },
  ];

  return (
    <div>
      <SectionTitle icon={Info} title="About" description="Platform information, legal, and support." />

      <div className="rounded-xl border border-white/8 bg-white/5 overflow-hidden mb-5">
        {rows.map(({ label, value }, i) => (
          <div key={label} className={cn("flex items-center justify-between gap-4 px-4 py-3 text-sm", i < rows.length - 1 && "border-b border-white/5")}>
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" size="sm" className="text-xs">Privacy Policy</Button>
        <Button variant="outline" size="sm" className="text-xs">Terms & Conditions</Button>
        <Button variant="outline" size="sm" className="text-xs gap-1"><AlertCircle size={12} />Report Issue</Button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const SECTION_MAP: Record<Section, React.ComponentType> = {
  profile:       ProfileSection,
  security:      SecuritySection,
  ai:            AiSection,
  notifications: NotificationsSection,
  privacy:       PrivacySection,
  appearance:    AppearanceSection,
  data:          DataSection,
  api:           ApiSection,
  about:         AboutSection,
};

// Simulate role — in a real app this comes from auth context
const USER_ROLE: "admin" | "officer" = "admin";

function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);

  const visibleNav = NAV.filter((n) => !n.adminOnly || USER_ROLE === "admin");
  const ActiveSection = SECTION_MAP[active];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, security, AI preferences, and system configuration.
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Sidebar */}
        <Card className="glass border-white/10 w-52 shrink-0 p-2 sticky top-4">
          <nav className="space-y-0.5">
            {visibleNav.map(({ id, label, icon: Icon, adminOnly }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                  active === id
                    ? "bg-primary/20 text-accent font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon size={15} className="shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {adminOnly && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-500/80 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
                {active === id && <ChevronRight size={13} className="shrink-0 opacity-60" />}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          <Card className="glass border-white/10 p-6">
            <ActiveSection />
          </Card>

          {/* Bottom action bar */}
          {active !== "about" && (
            <div className="flex items-center gap-3 justify-end">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Reset to Default
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs">
                {saved ? <><CheckCircle2 size={13} /> Saved!</> : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
