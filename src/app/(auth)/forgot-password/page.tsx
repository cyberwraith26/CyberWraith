"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError("");
    setStatus("loading");

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-dark grid-bg">
      <div className="w-full max-w-md">
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
            // AUTH.reset()
          </span>
          <h1 className="font-display font-bold text-2xl text-white">
            Reset your password
          </h1>
          <p className="text-white/40 font-display text-sm mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="border border-brand-green/20 bg-dark-100 p-8">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="text-3xl text-brand-green mb-4">✓</div>
              <div className="font-mono text-sm text-brand-green tracking-widest mb-3">
                CHECK YOUR EMAIL
              </div>
              <p className="text-white/40 font-display text-sm leading-relaxed">
                If an account exists for{" "}
                <span className="text-white/70">{email}</span>, you will
                receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="inline-block mt-6 font-mono text-xs text-white/30 hover:text-brand-green tracking-widest transition-colors"
              >
                ← BACK TO LOGIN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="user@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={status === "loading"}
              >
                Send Reset Link →
              </Button>
              <Link
                href="/login"
                className="text-center font-mono text-[10px] text-white/20 hover:text-white/40 tracking-widest transition-colors"
              >
                ← BACK TO LOGIN
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}