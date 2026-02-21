"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signupSchema } from "@/lib/validations";
import type { SignupInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithGitHub } = useAuth();
  const [form, setForm] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setAuthError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error ?? "Registration failed");
        return;
      }

      // Auto sign in after registration
      router.push("/login?registered=true");
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            // AUTH.register()
          </span>
          <h1 className="font-display font-bold text-2xl text-white">
            Create your account
          </h1>
          <p className="text-white/40 font-display text-sm mt-2">
            14-day free trial. No credit card required.
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
              <span>G</span> Sign up with Google
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
              <span>⌥</span> Sign up with GitHub
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              error={errors.name}
            />
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
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={errors.confirmPassword}
            />

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
              Create Account →
            </Button>

            <p className="font-mono text-[10px] text-white/20 text-center tracking-wide leading-relaxed">
              BY SIGNING UP YOU AGREE TO OUR{" "}
              <Link href="/terms" className="text-brand-green/40 hover:text-brand-green transition-colors">
                TERMS
              </Link>{" "}
              AND{" "}
              <Link href="/privacy" className="text-brand-green/40 hover:text-brand-green transition-colors">
                PRIVACY POLICY
              </Link>
            </p>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center font-mono text-[11px] text-white/20 mt-6 tracking-widest">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link
            href="/login"
            className="text-brand-green/60 hover:text-brand-green transition-colors"
          >
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
}