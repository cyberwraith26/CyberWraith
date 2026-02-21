"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema } from "@/lib/validations";
import type { LoginInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { loginWithCredentials, loginWithGoogle, loginWithGitHub } = useAuth();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<LoginInput> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setAuthError("");
    setIsLoading(true);

    const res = await loginWithCredentials(form.email, form.password);
    if (!res.success) {
      setAuthError(res.error ?? "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-dark grid-bg">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div
              className="w-8 h-8 transition-all group-hover:shadow-neon"
              style={{
                background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span className="font-mono text-lg tracking-[3px] text-white">
              CYBER<span className="text-brand-green">WRAITH</span>
            </span>
          </Link>
          <span className="font-mono text-[11px] text-brand-green/60 tracking-[3px] block mb-3">
            // AUTH.login()
          </span>
          <h1 className="font-display font-bold text-2xl text-white">
            Welcome back
          </h1>
          <p className="text-white/40 font-display text-sm mt-2">
            Sign in to access your tools and dashboard
          </p>
        </div>

        {/* Card */}
        <div className="border border-brand-green/20 bg-dark-100 p-8 shadow-[0_0_40px_rgba(0,255,136,0.05)]">

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={loginWithGoogle}
              className={cn(
                "flex items-center justify-center gap-3 py-3",
                "border border-white/10 font-mono text-xs tracking-widest uppercase",
                "text-white/60 hover:text-white hover:border-white/20",
                "transition-all duration-200 hover:bg-white/3"
              )}
            >
              <span>G</span> Continue with Google
            </button>
            <button
              onClick={loginWithGitHub}
              className={cn(
                "flex items-center justify-center gap-3 py-3",
                "border border-white/10 font-mono text-xs tracking-widest uppercase",
                "text-white/60 hover:text-white hover:border-white/20",
                "transition-all duration-200 hover:bg-white/3"
              )}
            >
              <span>⌥</span> Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-[10px] text-white/20 tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="user@domain.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              error={errors.email}
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                error={errors.password}
              />
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="font-mono text-[10px] text-white/30 hover:text-brand-green tracking-widest transition-colors"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
            </div>

            {/* Auth error */}
            {authError && (
              <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-mono text-xs text-brand-red">
                ✕ {authError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In →
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center font-mono text-[11px] text-white/20 mt-6 tracking-widest">
          NO ACCOUNT?{" "}
          <Link
            href="/signup"
            className="text-brand-green/60 hover:text-brand-green transition-colors"
          >
            START FREE TRIAL
          </Link>
        </p>
      </div>
    </div>
  );
}