"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { user, refreshSession } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to save");
      await refreshSession();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-green/50 tracking-[3px] mb-2">
          // SETTINGS.account()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Account Settings
        </h1>
        <p className="text-white/40 font-display">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="w-16 h-16 flex items-center justify-center bg-brand-green font-mono font-bold text-black text-xl shrink-0">
            {getInitials(user?.name ?? user?.email ?? "U")}
          </div>
          <div>
            <div className="font-display font-semibold text-white mb-1">
              {user?.name ?? "No name set"}
            </div>
            <div className="font-mono text-[11px] text-white/30 tracking-wide">
              {user?.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="mb-6">
        <CardHeader>
          <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
            // PROFILE
          </span>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email Address"
              value={user?.email ?? ""}
              disabled
              hint="Email cannot be changed. Contact support if needed."
            />

            {saveStatus === "success" && (
              <div className="border border-brand-green/30 bg-brand-green/5 px-4 py-3 font-mono text-xs text-brand-green">
                ✓ Settings saved successfully
              </div>
            )}
            {saveStatus === "error" && (
              <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-mono text-xs text-brand-red">
                ✕ Failed to save. Please try again.
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-brand-red/20">
        <CardHeader>
          <span className="font-mono text-[10px] text-brand-red/50 tracking-[3px]">
            // DANGER_ZONE
          </span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-display font-semibold text-white mb-1">
                Delete Account
              </div>
              <p className="text-sm text-white/40 font-display">
                Permanently delete your account and all data. This cannot
                be undone.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}