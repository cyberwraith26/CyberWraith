"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

interface Step {
  id: string;
  day: number;
  subject: string;
  body: string;
  type: "email";
}

interface Sequence {
  id: string;
  name: string;
  active: boolean;
  steps: Step[];
  sent: number;
  replied: number;
  lastTriggered: string;
  createdAt: string;
}

interface FollowStackAppProps {
  userId: string;
  tool: Tool;
}

const DEFAULT_SEQUENCES: Sequence[] = [
  {
    id: "1",
    name: "Proposal Follow-Up",
    active: true,
    sent: 24,
    replied: 8,
    lastTriggered: "2 hours ago",
    createdAt: "Jan 10, 2025",
    steps: [
      {
        id: "s1",
        day: 3,
        subject: "Quick check-in on the proposal",
        body: "Hi {{name}},\n\nJust wanted to follow up on the proposal I sent over. Do you have any questions I can answer?\n\nBest,\n{{sender}}",
        type: "email",
      },
      {
        id: "s2",
        day: 7,
        subject: "A result we got for a similar client",
        body: "Hi {{name}},\n\nI wanted to share a quick case study from a recent project similar to yours. We helped them achieve X result in Y timeframe.\n\nWould love to do the same for you.\n\nBest,\n{{sender}}",
        type: "email",
      },
      {
        id: "s3",
        day: 14,
        subject: "Still interested?",
        body: "Hi {{name}},\n\nI have a spot opening up next week and thought of you. If timing works, I'd love to move forward.\n\nBest,\n{{sender}}",
        type: "email",
      },
    ],
  },
  {
    id: "2",
    name: "Cold Outreach",
    active: false,
    sent: 56,
    replied: 12,
    lastTriggered: "Yesterday",
    createdAt: "Dec 20, 2024",
    steps: [
      {
        id: "s4",
        day: 1,
        subject: "Thought this might help",
        body: "Hi {{name}},\n\nI came across your work and had a few ideas that might be useful for your team.\n\nWould you be open to a quick 15-minute call?\n\nBest,\n{{sender}}",
        type: "email",
      },
      {
        id: "s5",
        day: 5,
        subject: "Following up",
        body: "Hi {{name}},\n\nJust bumping this up in case it got buried.\n\nBest,\n{{sender}}",
        type: "email",
      },
    ],
  },
];

type View = "sequences" | "editor" | "contacts";

export const FollowStackApp = ({ tool }: FollowStackAppProps) => {
  const [sequences, setSequences] = useState<Sequence[]>(DEFAULT_SEQUENCES);
  const [activeSeq, setActiveSeq] = useState<Sequence>(DEFAULT_SEQUENCES[0]);
  const [activeView, setActiveView] = useState<View>("sequences");
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  // Modals
  const [showNewSeq, setShowNewSeq] = useState(false);
  const [showNewStep, setShowNewStep] = useState(false);
  const [showEditStep, setShowEditStep] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [newSeqName, setNewSeqName] = useState("");
  const [stepForm, setStepForm] = useState({
    day: 3,
    subject: "",
    body: "",
  });

  // Sync activeSeq when sequences change
  useEffect(() => {
    setActiveSeq((prev) =>
      sequences.find((s) => s.id === prev.id) ?? sequences[0]
    );
  }, [sequences]);

  const replyRate = activeSeq.sent > 0
    ? Math.round((activeSeq.replied / activeSeq.sent) * 100)
    : 0;

  // ── Sequence actions ──────────────────────────────────
  const createSequence = () => {
    if (!newSeqName.trim()) return;
    const newSeq: Sequence = {
      id: Date.now().toString(),
      name: newSeqName.trim(),
      active: false,
      steps: [],
      sent: 0,
      replied: 0,
      lastTriggered: "Never",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setSequences((prev) => [...prev, newSeq]);
    setActiveSeq(newSeq);
    setNewSeqName("");
    setShowNewSeq(false);
  };

  const toggleSequence = (id: string) => {
    setSequences((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  const deleteSequence = (id: string) => {
    const remaining = sequences.filter((s) => s.id !== id);
    setSequences(remaining);
    if (remaining.length > 0) setActiveSeq(remaining[0]);
    setShowDeleteConfirm(false);
  };

  // ── Step actions ──────────────────────────────────────
  const addStep = () => {
    if (!stepForm.subject.trim() || !stepForm.body.trim()) return;
    const newStep: Step = {
      id: Date.now().toString(),
      day: stepForm.day,
      subject: stepForm.subject,
      body: stepForm.body,
      type: "email",
    };
    setSequences((prev) =>
      prev.map((s) =>
        s.id === activeSeq.id
          ? { ...s, steps: [...s.steps, newStep].sort((a, b) => a.day - b.day) }
          : s
      )
    );
    setStepForm({ day: 3, subject: "", body: "" });
    setShowNewStep(false);
  };

  const updateStep = () => {
    if (!activeStep) return;
    setSequences((prev) =>
      prev.map((s) =>
        s.id === activeSeq.id
          ? {
              ...s,
              steps: s.steps
                .map((st) =>
                  st.id === activeStep.id
                    ? { ...st, ...stepForm }
                    : st
                )
                .sort((a, b) => a.day - b.day),
            }
          : s
      )
    );
    setShowEditStep(false);
    setActiveStep(null);
  };

  const deleteStep = (stepId: string) => {
    setSequences((prev) =>
      prev.map((s) =>
        s.id === activeSeq.id
          ? { ...s, steps: s.steps.filter((st) => st.id !== stepId) }
          : s
      )
    );
  };

  const openEditStep = (step: Step) => {
    setActiveStep(step);
    setStepForm({
      day: step.day,
      subject: step.subject,
      body: step.body,
    });
    setShowEditStep(true);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
              // SEQUENCES
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNewSeq(true)}
            >
              + New
            </Button>
          </div>

          {/* Sequence list */}
          <div className="flex flex-col gap-2">
            {sequences.map((seq) => (
              <button
                key={seq.id}
                onClick={() => {
                  setActiveSeq(seq);
                  setActiveView("sequences");
                }}
                className={cn(
                  "w-full text-left border p-4 transition-all duration-200",
                  activeSeq.id === seq.id
                    ? "border-brand-green/40 bg-brand-green/5"
                    : "border-white/5 bg-dark-100 hover:border-white/10 hover:bg-white/2"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold text-sm text-white/80 truncate flex-1">
                    {seq.name}
                  </span>
                  <Badge variant={seq.active ? "green" : "ghost"}>
                    {seq.active ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex gap-3 font-mono text-[10px] text-white/25">
                  <span>{seq.steps.length} steps</span>
                  <span>·</span>
                  <span>{seq.sent} sent</span>
                  <span>·</span>
                  <span>{seq.replied} replied</span>
                </div>
              </button>
            ))}
          </div>

          {/* Sidebar nav */}
          <div className="mt-4 flex flex-col gap-1 border-t border-white/5 pt-4">
            {(["sequences", "editor", "contacts"] as View[]).map(
              (view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={cn(
                    "text-left px-3 py-2 font-mono text-[11px] tracking-widest uppercase",
                    "border-l-2 transition-all duration-200",
                    activeView === view
                      ? "border-brand-green text-brand-green bg-brand-green/5"
                      : "border-transparent text-white/25 hover:text-white/50 hover:border-white/20"
                  )}
                >
                  {view}
                </button>
              )
            )}
          </div>
        </aside>

        {/* ── Main Workspace ───────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* ── SEQUENCES VIEW ─────────────────────────── */}
          {activeView === "sequences" && (
            <>
              {/* Sequence header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-1">
                    {activeSeq.name}
                  </h2>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-white/25 tracking-widest">
                    <span>CREATED {activeSeq.createdAt.toUpperCase()}</span>
                    <span>·</span>
                    <span>LAST RUN: {activeSeq.lastTriggered.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant={activeSeq.active ? "danger" : "primary"}
                    size="sm"
                    onClick={() => toggleSequence(activeSeq.id)}
                  >
                    {activeSeq.active ? "⏸ Pause" : "▶ Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Emails Sent", value: activeSeq.sent, color: "#00ff88" },
                  { label: "Replies", value: activeSeq.replied, color: "#00d4ff" },
                  { label: "Reply Rate", value: `${replyRate}%`, color: "#a855f7" },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <div
                        className="font-mono text-2xl font-bold mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Steps */}
              <Card className="flex-1">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                    // SEQUENCE_STEPS ({activeSeq.steps.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStepForm({ day: 3, subject: "", body: "" });
                      setShowNewStep(true);
                    }}
                  >
                    + Add Step
                  </Button>
                </div>
                <CardContent className="p-6">
                  {activeSeq.steps.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="font-mono text-[10px] text-white/15 tracking-[3px] mb-4">
                        // NO_STEPS_YET
                      </div>
                      <p className="text-white/30 font-display text-sm mb-6 max-w-xs mx-auto">
                        Add your first follow-up step to start
                        building your sequence.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          setStepForm({ day: 3, subject: "", body: "" });
                          setShowNewStep(true);
                        }}
                      >
                        + Add First Step
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {activeSeq.steps.map((step, i) => (
                        <div key={step.id} className="flex gap-4">
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center border border-brand-green/30 font-mono text-xs text-brand-green shrink-0">
                              {i + 1}
                            </div>
                            {i < activeSeq.steps.length - 1 && (
                              <div className="w-px flex-1 bg-white/5 my-2" />
                            )}
                          </div>

                          {/* Step card */}
                          <div className="flex-1 border border-white/5 bg-dark-200 p-5 mb-2">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="cyan">
                                    Day {step.day}
                                  </Badge>
                                  <Badge variant="ghost">
                                    {step.type}
                                  </Badge>
                                </div>
                                <div className="font-display font-semibold text-sm text-white/80">
                                  {step.subject}
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditStep(step)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteStep(step.id)}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                            <pre className="font-mono text-[11px] text-white/30 leading-relaxed whitespace-pre-wrap">
                              {step.body}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* ── EDITOR VIEW ────────────────────────────── */}
          {activeView === "editor" && (
            <Card className="flex-1">
              <div className="px-6 py-4 border-b border-white/5">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // EMAIL_TEMPLATE_EDITOR
                </span>
              </div>
              <CardContent className="p-6 flex flex-col gap-5">
                <div className="border border-brand-amber/20 bg-brand-amber/5 px-4 py-3">
                  <p className="font-mono text-[11px] text-brand-amber/70 leading-relaxed">
                    ⚡ Available tokens: {"{{name}}"} {"{{sender}}"} {"{{company}}"} {"{{date}}"}
                    — These are replaced with real values when emails are sent.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
                    Subject Line //
                  </label>
                  <input
                    type="text"
                    placeholder="Your email subject..."
                    className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
                    Email Body //
                  </label>
                  <textarea
                    rows={14}
                    placeholder={`Hi {{name}},\n\nYour message here...\n\nBest,\n{{sender}}`}
                    className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" size="md">
                    Save Template
                  </Button>
                  <Button variant="secondary" size="md">
                    Preview Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── CONTACTS VIEW ──────────────────────────── */}
          {activeView === "contacts" && (
            <Card className="flex-1">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // CONTACTS
                </span>
                <Button variant="primary" size="sm">
                  + Add Contact
                </Button>
              </div>
              <CardContent className="p-0">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_120px_100px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
                  {["Name", "Email", "Sequence", "Status"].map((h) => (
                    <div
                      key={h}
                      className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Mock contacts */}
                {[
                  { name: "John Smith", email: "john@acme.com", sequence: "Proposal Follow-Up", status: "active" },
                  { name: "Sarah Lee", email: "sarah@startup.io", sequence: "Cold Outreach", status: "replied" },
                  { name: "Mike Chen", email: "mike@agency.co", sequence: "Proposal Follow-Up", status: "paused" },
                ].map((contact) => (
                  <div
                    key={contact.email}
                    className="grid grid-cols-[1fr_1fr_120px_100px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
                  >
                    <span className="font-display text-sm text-white/70">
                      {contact.name}
                    </span>
                    <span className="font-mono text-[11px] text-white/40 truncate">
                      {contact.email}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 truncate">
                      {contact.sequence}
                    </span>
                    <Badge
                      variant={
                        contact.status === "replied"
                          ? "green"
                          : contact.status === "active"
                          ? "cyan"
                          : "ghost"
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── New Sequence Modal ───────────────────────────── */}
      <Modal
        isOpen={showNewSeq}
        onClose={() => setShowNewSeq(false)}
        title="New Sequence"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Sequence Name"
            placeholder="e.g. Proposal Follow-Up"
            value={newSeqName}
            onChange={(e) => setNewSeqName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createSequence()}
          />
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={createSequence}
            >
              Create Sequence
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowNewSeq(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── New Step Modal ───────────────────────────────── */}
      <Modal
        isOpen={showNewStep}
        onClose={() => setShowNewStep(false)}
        title="Add Follow-Up Step"
        size="md"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Send on Day"
            type="number"
            value={stepForm.day.toString()}
            onChange={(e) =>
              setStepForm((prev) => ({
                ...prev,
                day: parseInt(e.target.value) || 1,
              }))
            }
            hint="Number of days after the sequence starts"
          />
          <Input
            label="Email Subject"
            placeholder="Quick follow-up on our conversation"
            value={stepForm.subject}
            onChange={(e) =>
              setStepForm((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
          />
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
              Email Body //
            </label>
            <textarea
              rows={8}
              placeholder={`Hi {{name}},\n\n...\n\nBest,\n{{sender}}`}
              value={stepForm.body}
              onChange={(e) =>
                setStepForm((prev) => ({
                  ...prev,
                  body: e.target.value,
                }))
              }
              className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={addStep}
            >
              Add Step
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowNewStep(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Step Modal ──────────────────────────────── */}
      <Modal
        isOpen={showEditStep}
        onClose={() => setShowEditStep(false)}
        title="Edit Step"
        size="md"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Send on Day"
            type="number"
            value={stepForm.day.toString()}
            onChange={(e) =>
              setStepForm((prev) => ({
                ...prev,
                day: parseInt(e.target.value) || 1,
              }))
            }
          />
          <Input
            label="Email Subject"
            value={stepForm.subject}
            onChange={(e) =>
              setStepForm((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
          />
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
              Email Body //
            </label>
            <textarea
              rows={8}
              value={stepForm.body}
              onChange={(e) =>
                setStepForm((prev) => ({
                  ...prev,
                  body: e.target.value,
                }))
              }
              className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={updateStep}
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowEditStep(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ─────────────────────────── */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Sequence"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="font-display text-white/60 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">
              {activeSeq.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={() => deleteSequence(activeSeq.id)}
            >
              Delete Sequence
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </ToolLayout>
  );
};