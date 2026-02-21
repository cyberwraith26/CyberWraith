import type { ServiceItem } from "@/types";

export const SERVICES: ServiceItem[] = [
  {
    title: "Custom Web Development",
    icon: "⬡",
    description:
      "Full-stack web apps and marketing sites built for performance and scale. We work with Next.js, React, Node.js, and modern deployment pipelines.",
    color: "#00d4ff",
    slug: "web-development",
  },
  {
    title: "SaaS Development",
    icon: "◈",
    description:
      "From architecture to deployment — we build multi-tenant SaaS platforms with authentication, billing, analytics, and scalable infrastructure baked in from day one.",
    color: "#00ff88",
    slug: "saas-development",
  },
  {
    title: "Linux Server & Automation",
    icon: "▲",
    description:
      "Server provisioning, Bash scripting, cron automation, and hardened deployments on Debian, Ubuntu, or Arch. We set it up and make sure it stays up.",
    color: "#a855f7",
    slug: "linux-admin",
  },
  {
    title: "DevOps & CI/CD",
    icon: "⟳",
    description:
      "Docker containerization, GitHub Actions pipelines, Nginx reverse proxies, and zero-downtime deployments. Infrastructure that scales without constant babysitting.",
    color: "#f59e0b",
    slug: "devops",
  },
  {
    title: "Ethical Hacking & Security Auditing",
    icon: "☩",
    description:
      "Legal penetration testing, vulnerability assessments, and open-source security tooling for your web apps and servers. All engagements are contract-based and fully authorized.",
    color: "#ef4444",
    slug: "security-auditing",
  },
];

export const getServiceBySlug = (slug: string): ServiceItem | undefined =>
  SERVICES.find((s) => s.slug === slug);