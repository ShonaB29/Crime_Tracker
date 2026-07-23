import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  loginSchema,
  registerSchema,
  passwordStrength,
  KARNATAKA_DISTRICTS,
  type LoginValues,
  type RegisterValues,
} from "@/lib/auth-schemas";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In · KSP Crime Intelligence" },
      {
        name: "description",
        content:
          "Secure access to the Karnataka State Police Crime Intelligence & Analytical Platform.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    mode: search.mode === "register" ? ("register" as const) : ("login" as const),
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { redirect, mode } = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"login" | "register">(mode);

  // Redirect away once authenticated.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: redirect && redirect.startsWith("/") ? redirect : "/dashboard" });
    }
  }, [isAuthenticated, loading, navigate, redirect]);

  return (
    <AuthShell
      title={tab === "login" ? "Secure Sign In" : "Request Access"}
      subtitle={
        tab === "login"
          ? "Enter your credentials to access the intelligence platform."
          : "Register your officer credentials to request platform access."
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm onRegistered={() => setTab("login")} />
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}

function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error(
        error.message.includes("Invalid login") ? "Invalid email or password." : error.message,
      );
      return;
    }
    toast.success("Signed in successfully.");
    // AuthProvider + redirect effect handle navigation.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Official email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="officer@ksp.gov.in"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link to="/forgot-password" className="text-xs text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>
      <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Shield className="mr-2 h-4 w-4" />
        )}
        Sign In
      </Button>
    </form>
  );
}

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "police_officer" },
  });

  const pw = watch("password") ?? "";
  const strength = passwordStrength(pw);
  const role = watch("role");
  const district = watch("district");

  const onSubmit = async (values: RegisterValues) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: values.fullName,
          badge_number: values.badgeNumber || null,
          department: values.department || null,
          district: values.district || null,
          role: values.role,
        },
      },
    });

    if (error) {
      toast.error(
        error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already been registered")
          ? "An account with this email already exists."
          : error.message,
      );
      return;
    }

    // If a session was returned, the AuthProvider signs the user in automatically.
    if (data.session) {
      toast.success("Account created. Welcome aboard.");
      return;
    }

    // Otherwise attempt an immediate sign-in (auto-confirm environments).
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (signInError) {
      toast.success("Account created. Please check your email to confirm, then sign in.");
      onRegistered();
    } else {
      toast.success("Account created. Welcome aboard.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full name</Label>
        <Input id="reg-name" placeholder="Insp. A. Kumar" {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">Official email</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="officer@ksp.gov.in"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reg-badge">Badge no.</Label>
          <Input id="reg-badge" placeholder="KSP-1024" {...register("badgeNumber")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-dept">Department</Label>
          <Input id="reg-dept" placeholder="CID / Crime" {...register("department")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>District</Label>
          <Select value={district || ""} onValueChange={(v) => setValue("district", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {KARNATAKA_DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setValue("role", v as RegisterValues["role"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="police_officer">Police Officer</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPw ? "text" : "password"}
            placeholder="Create a strong password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {pw && (
          <div className="space-y-1">
            <div className="flex h-1.5 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors ${
                    i < strength.score
                      ? strength.score >= 3
                        ? "bg-success"
                        : strength.score === 2
                          ? "bg-warning"
                          : "bg-danger"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Strength: {strength.label}</p>
          </div>
        )}
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm">Confirm password</Label>
        <Input
          id="reg-confirm"
          type={showPw ? "text" : "password"}
          placeholder="Re-enter password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
