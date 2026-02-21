import type { Tool } from "@/types";

export const TOOLS: Tool[] = [
  {
    id: "1",
    slug: "followstack",
    name: "FollowStack",
    icon: "⚡",
    tag: "Outreach",
    color: "#00ff88",
    description: "Automated client follow-up sequences that close deals while you sleep.",
    longDescription:
      "FollowStack lets you build multi-step follow-up sequences for leads and clients. Set triggers, delays, and personalized messages once — then let the system handle the rest automatically.",
    status: "live",
    requiredTier: "freelancer",
    features: [
      "Multi-step email sequences",
      "Custom delay triggers",
      "Personalization tokens",
      "Reply detection & auto-pause",
      "Open & click tracking",
    ],
    demoAvailable: true,
  },
  {
    id: "2",
    slug: "leadenrich",
    name: "LeadEnrich",
    icon: "◈",
    tag: "Lead Gen",
    color: "#00d4ff",
    description: "Scrape and enrich lead data from LinkedIn, GitHub, and directories.",
    longDescription:
      "LeadEnrich pulls contact data from multiple sources and enriches it with email addresses, social profiles, company info, and tech stack data — giving you leads that are ready to contact.",
    status: "live",
    requiredTier: "pro",
    features: [
      "Multi-source lead scraping",
      "Email finder & verification",
      "Company & tech stack enrichment",
      "CSV export",
      "CRM-ready data format",
    ],
    demoAvailable: true,
  },
  {
    id: "3",
    slug: "proposalgen",
    name: "ProposalGen",
    icon: "✦",
    tag: "AI Tools",
    color: "#a855f7",
    description: "AI-powered proposals generated from your brief in under 60 seconds.",
    longDescription:
      "Paste in a project brief or job description and ProposalGen uses AI to generate a professional, tailored proposal. Edit inline, set your rate, and send directly from the platform.",
    status: "live",
    requiredTier: "pro",
    features: [
      "AI proposal generation",
      "Brief-to-proposal in 60 seconds",
      "Inline editing",
      "Rate & timeline calculator",
      "PDF export & direct send",
    ],
    demoAvailable: true,
  },
  {
    id: "4",
    slug: "portfoliobuilder",
    name: "PortfolioBuilder",
    icon: "▣",
    tag: "Publishing",
    color: "#f59e0b",
    description: "Spin up a stunning portfolio site with custom domain in minutes.",
    longDescription:
      "PortfolioBuilder gives freelancers a beautiful, fast portfolio page with no code required. Choose a theme, add your work samples and bio, connect a custom domain, and go live instantly.",
    status: "live",
    requiredTier: "freelancer",
    features: [
      "No-code portfolio builder",
      "Custom domain connection",
      "Multiple themes",
      "Project showcase with media",
      "Contact form built-in",
    ],
    demoAvailable: true,
  },
  {
    id: "5",
    slug: "invoicepro",
    name: "InvoicePro",
    icon: "◉",
    tag: "Finance",
    color: "#ef4444",
    description: "Create, send, and track invoices with built-in payment reminders.",
    longDescription:
      "InvoicePro makes billing effortless. Generate professional invoices in seconds, send them directly to clients, and get notified when they're viewed or paid. Automatic reminders handle late payments.",
    status: "live",
    requiredTier: "freelancer",
    features: [
      "Professional invoice generation",
      "Direct client email delivery",
      "View & payment tracking",
      "Automatic payment reminders",
      "Multi-currency support",
    ],
    demoAvailable: true,
  },
  {
    id: "6",
    slug: "clientcrm",
    name: "ClientCRM",
    icon: "◎",
    tag: "CRM",
    color: "#00ff88",
    description: "A lightweight CRM built specifically for freelancers and solo operators.",
    longDescription: "",
    status: "coming_soon",
    requiredTier: "pro",
    features: [],
    demoAvailable: false,
    releaseDate: "Q2 2025",
  },
  {
    id: "7",
    slug: "contractgen",
    name: "ContractGen",
    icon: "✎",
    tag: "Automation",
    color: "#00d4ff",
    description: "Generate legally sound freelance contracts from simple project details.",
    longDescription: "",
    status: "coming_soon",
    requiredTier: "pro",
    features: [],
    demoAvailable: false,
    releaseDate: "Q2 2025",
  },
  {
    id: "8",
    slug: "timetracker",
    name: "TimeTracker",
    icon: "◷",
    tag: "Productivity",
    color: "#a855f7",
    description: "Track billable hours across projects and auto-attach to invoices.",
    longDescription: "",
    status: "coming_soon",
    requiredTier: "freelancer",
    features: [],
    demoAvailable: false,
    releaseDate: "Q3 2025",
  },
];

// Helper functions
export const getLiveTools = (): Tool[] =>
  TOOLS.filter((t) => t.status === "live");

export const getToolBySlug = (slug: string): Tool | undefined =>
  TOOLS.find((t) => t.slug === slug);

export const getToolsByTier = (tier: string): Tool[] =>
  TOOLS.filter((t) => t.requiredTier === tier);

export const getComingSoonTools = (): Tool[] =>
  TOOLS.filter((t) => t.status === "coming_soon");