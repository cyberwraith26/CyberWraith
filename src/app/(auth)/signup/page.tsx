"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupForm | "general", string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes("email")) {
          setErrors({
            email: "An account with this email already exists.",
          });
        } else {
          setErrors({
            general: data.error ?? "Registration failed.",
          });
        }
        return;
      }

      const signInRes = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login?registered=true");
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

        {/* Right — login link */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/20 hidden sm:block">
            Have an account?
          </span>
          <Link
            href="/login"
            className="font-mono text-[11px] text-brand-green hover:text-brand-green/80 tracking-widest transition-colors border border-brand-green/30 px-4 py-1.5 hover:border-brand-green/60"
          >
            SIGN IN →
          </Link>
        </div>
      </nav>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-3">
              // AUTH.register()
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">
              Create your account
            </h1>
            <p className="text-white/40 font-display text-sm">
              Start your 14-day free trial. No credit card required.
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
                  label="Full Name"
                  type="text"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  autoComplete="name"
                  autoFocus
                />
                {errors.name && (
                  <span className="font-mono text-[11px] text-brand-red">
                    ✕ {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
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
                    updateField("password", e.target.value)
                  }
                  autoComplete="new-password"
                  hint="Min 8 characters, one uppercase, one number"
                />
                {errors.password && (
                  <span className="font-mono text-[11px] text-brand-red">
                    ✕ {errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="font-mono text-[11px] text-brand-red">
                    ✕ {errors.confirmPassword}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account →"}
              </Button>

              <p className="font-mono text-[10px] text-white/20 text-center leading-relaxed">
                By signing up you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-brand-green/50 hover:text-brand-green transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-brand-green/50 hover:text-brand-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="font-mono text-[10px] text-white/20 tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* OAuth */}
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

          {/* Sign in link */}
          <p className="text-center font-mono text-[11px] text-white/20 tracking-wide mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-green hover:text-brand-green/80 transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}