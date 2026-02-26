"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "email" | "password";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email.trim(),
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setErrors({
          general: "Invalid email or password. Please try again.",
        });
        return;
      }

      if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark grid-bg flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-10 h-[60px] border-b border-white/5 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-7 h-7 group-hover:shadow-neon transition-all"
            style={{
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          <span className="font-mono text-sm tracking-[3px] text-white">
            CYBER<span className="text-brand-green">WRAITH</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Tools", href: "/#tools" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/#contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-widest uppercase text-white/30 hover:text-brand-green transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right — signup link */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/20 hidden sm:block">
            No account?
          </span>
          <Link
            href="/signup"
            className="font-mono text-[11px] text-brand-green hover:text-brand-green/80 tracking-widest transition-colors border border-brand-green/30 px-4 py-1.5 hover:border-brand-green/60"
          >
            SIGN UP →
          </Link>
        </div>
      </nav>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-3">
              // AUTH.login()
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">
              Welcome back
            </h1>
            <p className="text-white/40 font-display text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <div className="border border-white/5 bg-dark-100 p-8">

            {/* General error */}
            {errors.general && (
              <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 mb-6 font-mono text-xs text-brand-red">
                ✕ {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && (
                  <span className="font-mono text-[11px] text-brand-red">
                    ✕ {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="font-mono text-[11px] text-brand-red">
                    ✕ {errors.password}
                  </span>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-2">
                <Link
                  href="/forgot-password"
                  className="font-mono text-[11px] text-white/25 hover:text-brand-green transition-colors tracking-wide"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In →"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="font-mono text-[10px] text-white/20 tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  signIn("google", { callbackUrl: "/dashboard" })
                }
                className={cn(
                  "w-full flex items-center justify-center gap-3",
                  "border border-white/10 bg-white/3 hover:bg-white/5",
                  "font-display text-sm text-white/60 hover:text-white",
                  "py-3 transition-all duration-200"
                )}
              >
                <span className="text-base">G</span>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() =>
                  signIn("github", { callbackUrl: "/dashboard" })
                }
                className={cn(
                  "w-full flex items-center justify-center gap-3",
                  "border border-white/10 bg-white/3 hover:bg-white/5",
                  "font-display text-sm text-white/60 hover:text-white",
                  "py-3 transition-all duration-200"
                )}
              >
                <span className="text-base">⌥</span>
                Continue with GitHub
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center font-mono text-[11px] text-white/20 tracking-wide mt-6">
            No account?{" "}
            <Link
              href="/signup"
              className="text-brand-green hover:text-brand-green/80 transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}