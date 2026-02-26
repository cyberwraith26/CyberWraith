"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedin: string;
  source: "linkedin" | "github" | "directory";
  tags: string[];
  verified: boolean;
  addedAt: string;
}

interface LeadEnrichAppProps {
  userId: string;
  tool: Tool;
}

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "CTO",
    company: "TechStartup Inc",
    email: "sarah@techstartup.io",
    linkedin: "linkedin.com/in/sarahjohnson",
    source: "linkedin",
    tags: ["SaaS", "Decision Maker"],
    verified: true,
    addedAt: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "Mike Chen",
    title: "Head of Engineering",
    company: "ScaleUp Co",
    email: "mike@scaleup.co",
    linkedin: "linkedin.com/in/mikechen",
    source: "github",
    tags: ["Engineering", "Open Source"],
    verified: true,
    addedAt: "Jan 14, 2025",
  },
  {
    id: "3",
    name: "Emma Williams",
    title: "Founder & CEO",
    company: "GrowthAgency",
    email: "emma@growthagency.com",
    linkedin: "linkedin.com/in/emmawilliams",
    source: "directory",
    tags: ["Agency", "Marketing"],
    verified: false,
    addedAt: "Jan 13, 2025",
  },
  {
    id: "4",
    name: "James Miller",
    title: "Product Manager",
    company: "ProductCo",
    email: "james@productco.com",
    linkedin: "linkedin.com/in/jamesmiller",
    source: "linkedin",
    tags: ["Product", "SaaS"],
    verified: true,
    addedAt: "Jan 12, 2025",
  },
  {
    id: "5",
    name: "Aisha Patel",
    title: "Marketing Director",
    company: "BrandHouse",
    email: "aisha@brandhouse.io",
    linkedin: "linkedin.com/in/aishapatel",
    source: "directory",
    tags: ["Marketing", "B2B"],
    verified: false,
    addedAt: "Jan 11, 2025",
  },
];

const SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "directory", label: "Directory" },
];

const SOURCE_COLORS = {
  linkedin: "cyan",
  github: "purple",
  directory: "amber",
} as const;

export const LeadEnrichApp = ({ tool }: LeadEnrichAppProps) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      search === "" ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesSource;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((l) => l.id));
    }
  };

  const deleteSelected = () => {
    setLeads((prev) => prev.filter((l) => !selected.includes(l.id)));
    setSelected([]);
  };

  const exportCSV = () => {
    const toExport =
      selected.length > 0
        ? leads.filter((l) => selected.includes(l.id))
        : filtered;

    const headers = [
      "Name",
      "Title",
      "Company",
      "Email",
      "LinkedIn",
      "Source",
      "Verified",
    ];
    const rows = toExport.map((l) => [
      l.name,
      l.title,
      l.company,
      l.email,
      l.linkedin,
      l.source,
      l.verified ? "Yes" : "No",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add mock enriched lead
    const newLead: Lead = {
      id: Date.now().toString(),
      name: "Alex Thompson",
      title: "VP of Engineering",
      company: searchQuery,
      email: `alex@${searchQuery.toLowerCase().replace(/\s/g, "")}.com`,
      linkedin: `linkedin.com/in/alexthompson`,
      source: "linkedin",
      tags: ["Engineering", "Leadership"],
      verified: true,
      addedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsSearching(false);
    setSearchQuery("");
    setShowSearchPanel(false);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col gap-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: leads.length, color: "#00d4ff" },
            {
              label: "Verified",
              value: leads.filter((l) => l.verified).length,
              color: "#00ff88",
            },
            {
              label: "LinkedIn",
              value: leads.filter((l) => l.source === "linkedin").length,
              color: "#00d4ff",
            },
            {
              label: "Selected",
              value: selected.length,
              color: "#a855f7",
            },
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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* Source filter */}
            {SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => setSourceFilter(source.id)}
                className={cn(
                  "font-mono text-[10px] tracking-widest uppercase px-4 py-2",
                  "border transition-all duration-200",
                  sourceFilter === source.id
                    ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                    : "border-white/10 text-white/30 hover:text-white/50"
                )}
              >
                {source.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {selected.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={deleteSelected}
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={exportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSearchPanel(!showSearchPanel)}
            >
              + Enrich Leads
            </Button>
          </div>
        </div>

        {/* Search panel */}
        {showSearchPanel && (
          <Card>
            <div className="px-6 py-4 border-b border-white/5">
              <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                // LEAD_ENRICHMENT
              </span>
            </div>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase block mb-2">
                    Company or Person to Search //
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TechStartup Inc or John Smith at Google"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={isSearching}
                    onClick={runSearch}
                  >
                    {isSearching ? "Searching..." : "◈ Enrich"}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["LinkedIn", "GitHub", "Crunchbase", "AngelList"].map(
                  (src) => (
                    <span
                      key={src}
                      className="font-mono text-[10px] text-white/20 border border-white/5 px-3 py-1"
                    >
                      {src}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search bar */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search leads by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-dark-100 border border-brand-cyan/20 text-brand-cyan font-mono text-sm px-4 py-2.5 outline-none placeholder:text-brand-cyan/25 focus:border-brand-cyan/50 transition-colors"
          />
        </div>

        {/* Leads table */}
        <Card>
          {/* Table header */}
          <div className="grid grid-cols-[32px_1fr_120px_140px_100px_80px_80px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={
                  selected.length === filtered.length &&
                  filtered.length > 0
                }
                onChange={toggleSelectAll}
                className="accent-brand-cyan cursor-pointer"
              />
            </div>
            {["Name", "Title", "Company", "Source", "Email", ""].map(
              (h) => (
                <div
                  key={h}
                  className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
                >
                  {h}
                </div>
              )
            )}
          </div>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center font-mono text-[10px] text-white/15 tracking-widest">
                NO_LEADS_FOUND
              </div>
            ) : (
              filtered.map((lead) => (
                <div
                  key={lead.id}
                  className={cn(
                    "grid grid-cols-[32px_1fr_120px_140px_100px_80px_80px] gap-4 px-6 py-4",
                    "border-b border-white/5 last:border-0",
                    "hover:bg-white/2 transition-colors items-center",
                    selected.includes(lead.id) && "bg-brand-cyan/3"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                    className="accent-brand-cyan cursor-pointer"
                  />

                  {/* Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-display text-sm text-white/80 truncate">
                        {lead.name}
                      </span>
                      {lead.verified && (
                        <span className="text-brand-green text-xs shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {lead.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] text-white/20 border border-white/5 px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <span className="font-display text-xs text-white/50 truncate">
                    {lead.title}
                  </span>

                  {/* Company */}
                  <span className="font-display text-xs text-white/50 truncate">
                    {lead.company}
                  </span>

                  {/* Source */}
                  <Badge variant={SOURCE_COLORS[lead.source]}>
                    {lead.source}
                  </Badge>

                  {/* Email */}
                  <span className="font-mono text-[10px] text-white/30 truncate">
                    {lead.email}
                  </span>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setLeads((prev) =>
                        prev.filter((l) => l.id !== lead.id)
                      )
                    }
                  >
                    ✕
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between font-mono text-[10px] text-white/20 tracking-widest">
          <span>
            {filtered.length} OF {leads.length} LEADS
            {selected.length > 0 && ` · ${selected.length} SELECTED`}
          </span>
          <span>
            {leads.filter((l) => l.verified).length} VERIFIED
          </span>
        </div>
      </div>
    </ToolLayout>
  );
};