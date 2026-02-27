"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { contactSchema, type ContactInput } from "@/lib/validations";

const INQUIRY_OPTIONS = [
  { value: "saas", label: "SaaS Tool Support" },
  { value: "consult", label: "Service Consultation" },
  { value: "security", label: "Security Audit Request" },
  { value: "dev", label: "Web Development Project" },
];

type ContactErrors = {
  name?: string;
  email?: string;
  type?: string;
  message?: string;
};

export const ContactSection = () => {
  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    type: "saas",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: ContactErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", type: "saas", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-28 px-6" style={{ background: "rgba(0,5,10,0.8)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-[11px] text-brand-red tracking-[3px] block mb-4">
            // CONTACT.open()
          </span>
          <h2 className="font-display font-bold text-white mb-5" style={{ fontSize: "clamp(28px, 4vw, 52px)" }}>
            Get In Touch
          </h2>
          <p className="text-white/50 font-display max-w-md mx-auto">
            Questions about the platform or need a technical consultation? We respond within 24 hours.
          </p>
        </div>

        {status === "success" ? (
          <div className="border border-brand-green/30 bg-brand-green/5 p-12 text-center">
            <div className="text-4xl mb-4 text-brand-green">✓</div>
            <div className="font-mono text-sm text-brand-green tracking-widest mb-2">MESSAGE_SENT</div>
            <p className="text-white/50 font-display text-sm">We&apos;ll get back to you within 24 hours.</p>
            <button onClick={() => setStatus("idle")} className="mt-6 font-mono text-xs text-white/30 hover:text-white transition-colors underline underline-offset-4">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Name" placeholder="John_Doe" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} error={errors.name} />
              <Input label="Email" type="email" placeholder="user@domain.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} error={errors.email} />
            </div>
            <Select label="Inquiry Type" options={INQUIRY_OPTIONS} value={form.type} onChange={(value) => setForm((prev) => ({ ...prev, type: value as ContactInput["type"] }))} error={errors.type} />
            <Textarea label="Message" placeholder="Describe your project or question..." rows={6} value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} error={errors.message} />
            {status === "error" && (
              <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-mono text-xs text-brand-red">
                ✕ Something went wrong. Please try again or email us directly.
              </div>
            )}
            <div className="flex items-center gap-6">
              <Button type="submit" variant="primary" size="lg" isLoading={status === "loading"}>Send Message →</Button>
              <span className="font-mono text-[10px] text-white/20 tracking-widest">// RESPONSE WITHIN 24H</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
