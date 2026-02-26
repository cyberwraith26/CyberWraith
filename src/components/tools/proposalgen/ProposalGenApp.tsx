"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

interface Proposal {
  id: string;
  title: string;
  client: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  value: number;
  createdAt: string;
  content: string;
}

interface ProposalGenAppProps {
  userId: string;
  tool: Tool;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "1",
    title: "E-Commerce Website Redesign",
    client: "Acme Corp",
    status: "accepted",
    value: 4500,
    createdAt: "Jan 10, 2025",
    content: `# Website Redesign Proposal

## Understanding Your Challenge

Acme Corp is experiencing high bounce rates on their current e-commerce platform. Visitors are dropping off before completing purchases, costing the business significant revenue each month.

## Our Approach

We will redesign your e-commerce platform from the ground up with a focus on conversion optimization. This includes a complete UX audit, mobile-first redesign, and performance optimization to ensure pages load in under 2 seconds.

## Deliverables

- Full UX audit and competitor analysis
- Mobile-first responsive design for all pages
- Optimized checkout flow (target: reduce steps from 5 to 3)
- Integration with existing payment systems
- 30-day post-launch support

## Investment

Total project investment: $4,500
Timeline: 6 weeks
Payment: 50% upfront, 50% on delivery

## Why CyberWraith

We have completed 40+ e-commerce projects with an average conversion rate improvement of 34%. We are confident we can deliver measurable results for Acme Corp.`,
  },
  {
    id: "2",
    title: "Mobile App Development",
    client: "Startup IO",
    status: "sent",
    value: 8000,
    createdAt: "Jan 15, 2025",
    content: `# Mobile App Development Proposal

## Understanding Your Challenge

Startup IO needs a cross-platform mobile application to extend their web service to iOS and Android users. Current mobile experience through browser is leading to poor user retention.

## Our Approach

We will build a React Native application that shares code between iOS and Android while delivering a native-quality experience on both platforms.

## Deliverables

- React Native app for iOS and Android
- User authentication and profile management
- Core feature parity with web application
- Push notification system
- App Store and Play Store submission

## Investment

Total project investment: $8,000
Timeline: 10 weeks
Payment: 30% upfront, 40% at milestone, 30% on delivery`,
  },
];

const TEMPLATES = [
  { id: "web", label: "Web Development", icon: "◈" },
  { id: "mobile", label: "Mobile App", icon: "◉" },
  { id: "design", label: "Brand Design", icon: "✦" },
  { id: "saas", label: "SaaS Build", icon: "⚡" },
  { id: "security", label: "Security Audit", icon: "▣" },
  { id: "custom", label: "Custom Project", icon: "◷" },
];

type View = "list" | "create" | "preview";

const STATUS_COLORS = {
  draft: "ghost",
  sent: "cyan",
  accepted: "green",
  rejected: "red",
} as const;

export const ProposalGenApp = ({ tool }: ProposalGenAppProps) => {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [activeView, setActiveView] = useState<View>("list");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("web");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const [form, setForm] = useState({
    client: "",
    projectTitle: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    yourName: "",
  });

  const generateProposal = async () => {
    if (!form.client || !form.projectTitle || !form.projectDescription) return;
    setIsGenerating(true);
    setGeneratedContent("");

    // Simulate AI generation with streaming effect
    const template = `# ${form.projectTitle} Proposal

## Understanding Your Challenge

${form.client} requires ${form.projectDescription.toLowerCase()}. This represents a significant opportunity to improve operations and drive measurable results.

## Our Approach

Based on your requirements, we recommend a phased approach that minimizes risk while delivering value at each stage. We will begin with a thorough discovery session to align on goals, followed by iterative development with regular check-ins.

## Deliverables

- Detailed project specification and architecture document
- Full implementation of all agreed requirements
- Quality assurance and testing across all major browsers and devices
- Documentation and handover training
- ${form.timeline ? form.timeline + " post-launch" : "30-day post-launch"} support period

## Timeline & Investment

${form.timeline ? `Estimated timeline: ${form.timeline}` : "Timeline: To be confirmed after discovery"}
${form.budget ? `Project investment: ${form.budget}` : "Investment: Quoted after requirements review"}
Payment terms: 50% to commence, 50% on completion

## Why Choose Us

We bring deep technical expertise and a track record of delivering projects on time and on budget. Every engagement includes a dedicated point of contact, weekly progress updates, and a satisfaction guarantee.

Ready to get started? Reply to this proposal and we can schedule a kickoff call within 48 hours.`;

    // Simulate character-by-character streaming
    let i = 0;
    const interval = setInterval(() => {
      if (i < template.length) {
        setGeneratedContent(template.slice(0, i + 3));
        i += 3;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setGeneratedContent(template);
      }
    }, 15);
  };

  const saveProposal = () => {
    if (!generatedContent) return;
    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: form.projectTitle,
      client: form.client,
      status: "draft",
      value: parseInt(form.budget?.replace(/\D/g, "") || "0"),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content: generatedContent,
    };
    setProposals((prev) => [newProposal, ...prev]);
    setSelectedProposal(newProposal);
    setActiveView("preview");
    setForm({
      client: "",
      projectTitle: "",
      projectDescription: "",
      budget: "",
      timeline: "",
      yourName: "",
    });
    setGeneratedContent("");
  };

  const updateStatus = (
    id: string,
    status: Proposal["status"]
  ) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    if (selectedProposal?.id === id) {
      setSelectedProposal((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
              // PROPOSALS
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setGeneratedContent("");
                setActiveView("create");
              }}
            >
              + Generate
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="border border-white/5 bg-dark-100 p-3">
              <div className="font-mono text-sm font-bold text-brand-purple mb-0.5">
                {proposals.filter((p) => p.status === "accepted").length}
              </div>
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                ACCEPTED
              </div>
            </div>
            <div className="border border-white/5 bg-dark-100 p-3">
              <div className="font-mono text-sm font-bold text-brand-cyan mb-0.5">
                {proposals.filter((p) => p.status === "sent").length}
              </div>
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                PENDING
              </div>
            </div>
          </div>

          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => {
                setSelectedProposal(proposal);
                setActiveView("preview");
              }}
              className={cn(
                "w-full text-left border p-4 transition-all duration-200",
                selectedProposal?.id === proposal.id && activeView === "preview"
                  ? "border-brand-purple/40 bg-brand-purple/5"
                  : "border-white/5 bg-dark-100 hover:border-white/10"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant={STATUS_COLORS[proposal.status]}>
                  {proposal.status}
                </Badge>
                <span className="font-mono text-[10px] text-white/25">
                  {proposal.createdAt}
                </span>
              </div>
              <div className="font-display font-semibold text-sm text-white/80 truncate mb-1">
                {proposal.title}
              </div>
              <div className="font-mono text-[10px] text-white/30">
                {proposal.client}
                {proposal.value > 0 && ` · $${proposal.value.toLocaleString()}`}
              </div>
            </button>
          ))}
        </aside>

        {/* ── Main Workspace ───────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* ── LIST VIEW ──────────────────────────────── */}
          {activeView === "list" && (
            <Card className="flex-1">
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-5xl mb-6 text-brand-purple/30">✦</div>
                <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
                  // SELECT_OR_CREATE
                </div>
                <p className="text-white/30 font-display text-sm max-w-sm mb-8">
                  Select a proposal from the sidebar or generate a new
                  one using AI in under 60 seconds.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveView("create")}
                >
                  Generate New Proposal →
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── CREATE VIEW ────────────────────────────── */}
          {activeView === "create" && (
            <div className="flex flex-col gap-5">
              {/* Template selector */}
              <Card>
                <div className="px-6 py-4 border-b border-white/5">
                  <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                    // SELECT_TEMPLATE
                  </span>
                </div>
                <CardContent className="p-5">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 border transition-all duration-200",
                          selectedTemplate === tmpl.id
                            ? "border-brand-purple/40 bg-brand-purple/10 text-brand-purple"
                            : "border-white/5 text-white/30 hover:border-white/10 hover:text-white/50"
                        )}
                      >
                        <span className="text-lg">{tmpl.icon}</span>
                        <span className="font-mono text-[9px] tracking-wide text-center leading-tight">
                          {tmpl.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Brief form */}
              <Card>
                <div className="px-6 py-4 border-b border-white/5">
                  <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                    // PROJECT_BRIEF
                  </span>
                </div>
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Client Name"
                      placeholder="Acme Corp"
                      value={form.client}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, client: e.target.value }))
                      }
                    />
                    <Input
                      label="Project Title"
                      placeholder="Website Redesign"
                      value={form.projectTitle}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          projectTitle: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Budget (optional)"
                      placeholder="$5,000"
                      value={form.budget}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, budget: e.target.value }))
                      }
                    />
                    <Input
                      label="Timeline (optional)"
                      placeholder="6 weeks"
                      value={form.timeline}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, timeline: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
                      Project Description //
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe what the client needs, their pain points, and what success looks like..."
                      value={form.projectDescription}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          projectDescription: e.target.value,
                        }))
                      }
                      className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors resize-none"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    className="self-start"
                    isLoading={isGenerating}
                    onClick={generateProposal}
                  >
                    {isGenerating ? "Generating..." : "✦ Generate Proposal"}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated output */}
              {(isGenerating || generatedContent) && (
                <Card>
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                      // GENERATED_PROPOSAL
                    </span>
                    {!isGenerating && generatedContent && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={saveProposal}
                      >
                        Save Proposal →
                      </Button>
                    )}
                  </div>
                  <CardContent className="p-6">
                    {isGenerating && !generatedContent && (
                      <div className="flex items-center gap-3 font-mono text-brand-purple/60 text-sm">
                        <span className="animate-pulse">◈</span>
                        Generating your proposal...
                      </div>
                    )}
                    <pre className="font-mono text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                      {generatedContent}
                      {isGenerating && (
                        <span className="animate-blink text-brand-purple">▊</span>
                      )}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ── PREVIEW VIEW ───────────────────────────── */}
          {activeView === "preview" && selectedProposal && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("list")}
                >
                  ← All Proposals
                </Button>
                <div className="flex gap-2">
                  {selectedProposal.status === "draft" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        updateStatus(selectedProposal.id, "sent")
                      }
                    >
                      Mark as Sent
                    </Button>
                  )}
                  {selectedProposal.status === "sent" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          updateStatus(selectedProposal.id, "accepted")
                        }
                      >
                        Mark Accepted ✓
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          updateStatus(selectedProposal.id, "rejected")
                        }
                      >
                        Mark Rejected
                      </Button>
                    </>
                  )}
                  <Button variant="secondary" size="sm">
                    Export PDF
                  </Button>
                </div>
              </div>

              <Card>
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-white mb-0.5">
                      {selectedProposal.title}
                    </div>
                    <div className="font-mono text-[10px] text-white/25">
                      {selectedProposal.client} · {selectedProposal.createdAt}
                    </div>
                  </div>
                  <Badge variant={STATUS_COLORS[selectedProposal.status]}>
                    {selectedProposal.status}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <pre className="font-mono text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                    {selectedProposal.content}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};