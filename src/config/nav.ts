import type { NavItem } from "@/types";

export const PUBLIC_NAV: NavItem[] = [
  { label: "Tools", href: "/#tools" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Tools", href: "/dashboard/tools" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Billing", href: "/dashboard/settings/billing" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Tools", href: "/admin/tools" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Analytics", href: "/admin/analytics" },
];

export const FOOTER_NAV = {
  platform: [
    { label: "Tools", href: "/#tools" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Changelog", href: "/changelog" },
  ],
  services: [
    { label: "Web Dev", href: "/services/web-development" },
    { label: "SaaS Build", href: "/services/saas-development" },
    { label: "Linux Admin", href: "/services/linux-admin" },
    { label: "Security", href: "/services/security-auditing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};