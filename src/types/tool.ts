export type ToolTag =
  | "Outreach"
  | "Lead Gen"
  | "AI Tools"
  | "Publishing"
  | "Finance"
  | "Automation"
  | "Analytics"
  | "CRM"
  | "Communication"
  | "Productivity";

export type ToolStatus = "live" | "beta" | "coming_soon";

export type ToolTier = "freelancer" | "pro" | "agency";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  icon: string;
  tag: ToolTag;
  color: string;
  description: string;
  longDescription?: string;
  status: ToolStatus;
  requiredTier: ToolTier;
  features: string[];
  demoAvailable: boolean;
  releaseDate?: string;
}