"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { TOOLS } from "@/config/tools";
import type { Tool, ToolStatus, ToolTier } from "@/types";

interface ToolEditorProps {
  onToolUpdated?: () => void;
}

export const ToolEditor = ({ onToolUpdated }: ToolEditorProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [editStatus, setEditStatus] = useState<ToolStatus>("live");
  const [editTier, setEditTier] = useState<ToolTier>("freelancer");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | ToolStatus>("all");

  const displayed =
    filterStatus === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.status === filterStatus);

  const openEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setEditStatus(tool.status);
    setEditTier(tool.requiredTier);
    setEditName(tool.name);
    setEditDesc(tool.description);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedTool) return;
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      // In production this would call a real API endpoint
      // For now we simulate a save
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSaveSuccess(true);
      onToolUpdated?.();
      setTimeout(() => {
        setSelectedTool(null);
        setSaveSuccess(false);
      }, 1500);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border border-white/10 p-1 w-fit">
        {(["all", "live", "beta", "coming_soon"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "font-mono text-[10px] tracking-widest uppercase px-4 py-1.5",
                "transition-all duration-200",
                filterStatus === status
                  ? "bg-brand-green text-black"
                  : "text-white/30 hover:text-white"
              )}
            >
              {status === "coming_soon" ? "Soon" : status}
            </button>
          )
        )}
      </div>

      {/* Tools table */}
      <div className="border border-white/5 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_100px_120px_100px_80px] gap-4 px-6 py-3 bg-dark-200 border-b border-white/5">
          {["", "Tool", "Tag", "Required Tier", "Status", ""].map(
            (h, i) => (
              <div
                key={i}
                className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
              >
                {h}
              </div>
            )
          )}
        </div>

        {/* Rows */}
        {displayed.map((tool) => (
          <div
            key={tool.id}
            className="grid grid-cols-[40px_1fr_100px_120px_100px_80px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
          >
            {/* Icon */}
            <span
              className="text-lg"
              style={{ color: tool.color }}
            >
              {tool.icon}
            </span>

            {/* Name */}
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm text-white/80 mb-0.5">
                {tool.name}
              </div>
              <div className="font-mono text-[10px] text-white/25 truncate">
                /{tool.slug}
              </div>
            </div>

            {/* Tag */}
            <span className="font-mono text-[10px] text-white/30 tracking-wide">
              {tool.tag}
            </span>

            {/* Tier */}
            <Badge
              variant={
                tool.requiredTier === "agency"
                  ? "purple"
                  : tool.requiredTier === "pro"
                  ? "cyan"
                  : "green"
              }
            >
              {tool.requiredTier}
            </Badge>

            {/* Status */}
            <Badge
              variant={
                tool.status === "live"
                  ? "green"
                  : tool.status === "beta"
                  ? "amber"
                  : "ghost"
              }
            >
              {tool.status}
            </Badge>

            {/* Edit */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEdit(tool)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-4 font-mono text-[10px] text-white/20 tracking-widest">
        {displayed.length} TOOLS SHOWN // TO ADD NEW TOOLS UPDATE{" "}
        <code className="text-brand-green/40">
          src/config/tools.ts
        </code>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
        title={`Edit Tool — ${selectedTool?.name}`}
        size="md"
      >
        <div className="flex flex-col gap-5">
          {/* Tool identity (read-only) */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <span
              className="text-2xl"
              style={{ color: selectedTool?.color }}
            >
              {selectedTool?.icon}
            </span>
            <div>
              <div className="font-mono text-[10px] text-white/20 tracking-widest mb-0.5">
                SLUG: /{selectedTool?.slug}
              </div>
              <div className="font-display font-semibold text-white">
                {selectedTool?.name}
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <Input
            label="Display Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Tool name"
          />

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-widest uppercase text-brand-green/60">
              Description //
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className={cn(
                "w-full bg-dark-100 border border-brand-green/20",
                "text-brand-green font-mono text-sm px-4 py-3 outline-none",
                "placeholder:text-brand-green/30 resize-none",
                "focus:border-brand-green/50 transition-colors"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={editStatus}
              onChange={(v) => setEditStatus(v as ToolStatus)}
              options={[
                { value: "live", label: "Live" },
                { value: "beta", label: "Beta" },
                { value: "coming_soon", label: "Coming Soon" },
              ]}
            />
            <Select
              label="Required Tier"
              value={editTier}
              onChange={(v) => setEditTier(v as ToolTier)}
              options={[
                { value: "freelancer", label: "Freelancer" },
                { value: "pro", label: "Pro" },
                { value: "agency", label: "Agency" },
              ]}
            />
          </div>

          {/* Notice */}
          <div className="border border-brand-amber/20 bg-brand-amber/5 px-4 py-3 font-mono text-[10px] text-brand-amber/70 leading-relaxed">
            ⚠ Changes here update the database record only. To
            permanently update the codebase, also edit{" "}
            <code>src/config/tools.ts</code> and run{" "}
            <code>npm run db:seed</code>.
          </div>

          {/* Error / Success */}
          {saveError && (
            <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-mono text-xs text-brand-red">
              ✕ {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="border border-brand-green/30 bg-brand-green/5 px-4 py-3 font-mono text-xs text-brand-green">
              ✓ Tool updated successfully
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setSelectedTool(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};