"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  color: string;
  featured: boolean;
}

interface PortfolioSettings {
  name: string;
  headline: string;
  bio: string;
  theme: string;
  domain: string;
  published: boolean;
}

interface PortfolioBuilderAppProps {
  userId: string;
  tool: Tool;
}

const THEMES = [
  { id: "cyber", label: "Cyber", color: "#00ff88", bg: "#050a0f" },
  { id: "minimal", label: "Minimal", color: "#ffffff", bg: "#111111" },
  { id: "ocean", label: "Ocean", color: "#00d4ff", bg: "#0a1520" },
  { id: "sunset", label: "Sunset", color: "#f59e0b", bg: "#1a0f00" },
  { id: "aurora", label: "Aurora", color: "#a855f7", bg: "#0d0014" },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "Full-stack online store with payment processing and inventory management.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    url: "https://example.com",
    color: "#00ff88",
    featured: true,
  },
  {
    id: "2",
    title: "Mobile Banking App",
    description:
      "React Native application for personal finance tracking and budgeting.",
    tags: ["React Native", "Node.js", "MongoDB"],
    url: "https://example.com",
    color: "#00d4ff",
    featured: true,
  },
  {
    id: "3",
    title: "Brand Identity System",
    description:
      "Complete brand identity for a SaaS startup including logo, colors, and guidelines.",
    tags: ["Figma", "Brand Design", "UI/UX"],
    url: "https://example.com",
    color: "#a855f7",
    featured: false,
  },
];

type View = "projects" | "settings" | "preview";

export const PortfolioBuilderApp = ({
  tool,
}: PortfolioBuilderAppProps) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: "Your Name",
    headline: "Full-Stack Developer & Designer",
    bio: "I build clean, performant web applications and help businesses grow through great digital experiences.",
    theme: "cyber",
    domain: "",
    published: false,
  });
  const [activeView, setActiveView] = useState<View>("projects");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tags: "",
    url: "",
    color: "#00ff88",
    featured: false,
  });

  const activeTheme =
    THEMES.find((t) => t.id === settings.theme) ?? THEMES[0];

  const addProject = () => {
    if (!projectForm.title.trim()) return;
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectForm.title,
      description: projectForm.description,
      tags: projectForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      url: projectForm.url,
      color: projectForm.color,
      featured: projectForm.featured,
    };
    setProjects((prev) => [...prev, newProject]);
    setProjectForm({
      title: "",
      description: "",
      tags: "",
      url: "",
      color: "#00ff88",
      featured: false,
    });
    setShowNewProject(false);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteConfirm(false);
    setSelectedProject(null);
  };

  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  const publishPortfolio = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSettings((prev) => ({ ...prev, published: true }));
    setIsPublishing(false);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col gap-6">

        {/* View tabs */}
        <div className="flex gap-1 border border-white/10 p-1 w-fit">
          {(["projects", "settings", "preview"] as View[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "font-mono text-[10px] tracking-widest uppercase px-5 py-2",
                "transition-all duration-200",
                activeView === view
                  ? "bg-brand-amber text-black"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Publish status bar */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-5 py-3 border",
            settings.published
              ? "border-brand-green/30 bg-brand-green/5"
              : "border-white/5 bg-dark-100"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                settings.published
                  ? "bg-brand-green animate-pulse-glow"
                  : "bg-white/20"
              )}
            />
            <span className="font-mono text-[11px] text-white/50 tracking-widest">
              {settings.published
                ? `PUBLISHED · cyberwraith.app/p/${settings.name
                    .toLowerCase()
                    .replace(/\s/g, "-")}`
                : "NOT PUBLISHED · Your portfolio is not live yet"}
            </span>
          </div>
          <div className="flex gap-2">
            {settings.published && (
              <Button variant="ghost" size="sm">
                View Live →
              </Button>
            )}
            <Button
              variant={settings.published ? "secondary" : "primary"}
              size="sm"
              isLoading={isPublishing}
              onClick={publishPortfolio}
            >
              {settings.published ? "Update" : "Publish Portfolio"}
            </Button>
          </div>
        </div>

        {/* PROJECTS VIEW */}
        {activeView === "projects" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] text-white/25 tracking-[3px]">
                // PROJECTS ({projects.length})
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowNewProject(true)}
              >
                + Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <Card key={project.id} className="group relative">
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: project.color }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-8 h-8 border flex items-center justify-center font-mono text-sm"
                        style={{
                          color: project.color,
                          borderColor: `${project.color}33`,
                          background: `${project.color}11`,
                        }}
                      >
                        ▣
                      </div>
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <Badge variant="amber">Featured</Badge>
                        )}
                        <button
                          onClick={() => toggleFeatured(project.id)}
                          className="font-mono text-[10px] text-white/20 hover:text-brand-amber transition-colors"
                        >
                          ★
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/40 font-display leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] text-white/25 border border-white/5 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </Button>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary" size="sm">
                            View →
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add project placeholder */}
              <button
                onClick={() => setShowNewProject(true)}
                className="border border-dashed border-white/10 hover:border-brand-amber/30 transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 text-white/20 hover:text-brand-amber min-h-[220px]"
              >
                <span className="text-3xl">+</span>
                <span className="font-mono text-[10px] tracking-widest">
                  ADD PROJECT
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeView === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="px-6 py-4 border-b border-white/5">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // PROFILE
                </span>
              </div>
              <CardContent className="p-6 flex flex-col gap-5">
                <Input
                  label="Display Name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <Input
                  label="Headline"
                  placeholder="Full-Stack Developer & Designer"
                  value={settings.headline}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, headline: e.target.value }))
                  }
                />
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
                    Bio //
                  </label>
                  <textarea
                    rows={4}
                    value={settings.bio}
                    onChange={(e) =>
                      setSettings((p) => ({ ...p, bio: e.target.value }))
                    }
                    className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none focus:border-brand-green/50 transition-colors resize-none"
                  />
                </div>
                <Input
                  label="Custom Domain (optional)"
                  placeholder="yourname.com"
                  value={settings.domain}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, domain: e.target.value }))
                  }
                  hint="Point your domain to our servers after publishing"
                />
                <Button variant="primary" size="md">
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="px-6 py-4 border-b border-white/5">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // THEME
                </span>
              </div>
              <CardContent className="p-6 flex flex-col gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() =>
                      setSettings((p) => ({ ...p, theme: theme.id }))
                    }
                    className={cn(
                      "flex items-center gap-4 p-4 border transition-all duration-200 text-left",
                      settings.theme === theme.id
                        ? "border-brand-amber/40 bg-brand-amber/5"
                        : "border-white/5 hover:border-white/10"
                    )}
                  >
                    <div
                      className="w-10 h-10 border shrink-0 flex items-center justify-center font-mono text-[10px]"
                      style={{
                        background: theme.bg,
                        borderColor: `${theme.color}40`,
                        color: theme.color,
                      }}
                    >
                      Aa
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-semibold text-sm text-white/80">
                        {theme.label}
                      </div>
                      <div className="font-mono text-[10px] text-white/25">
                        {theme.bg} · {theme.color}
                      </div>
                    </div>
                    {settings.theme === theme.id && (
                      <span className="text-brand-amber font-mono text-sm">✓</span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* PREVIEW VIEW */}
        {activeView === "preview" && (
          <div className="flex flex-col gap-4">
            <div className="font-mono text-[10px] text-white/20 tracking-[3px]">
              // PORTFOLIO_PREVIEW
            </div>

            <div
              className="border border-white/5 overflow-hidden"
              style={{ background: activeTheme.bg }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: `${activeTheme.color}15` }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-amber/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-green/60" />
                </div>
                <div
                  className="flex-1 mx-4 text-center font-mono text-[10px] px-4 py-1 border"
                  style={{
                    color: `${activeTheme.color}60`,
                    borderColor: `${activeTheme.color}20`,
                  }}
                >
                  cyberwraith.app/p/
                  {settings.name.toLowerCase().replace(/\s/g, "-")}
                </div>
              </div>

              {/* Portfolio content */}
              <div className="p-10 min-h-[500px]">
                <div className="mb-12 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl font-mono font-bold border"
                    style={{
                      color: activeTheme.color,
                      borderColor: `${activeTheme.color}40`,
                      background: `${activeTheme.color}15`,
                    }}
                  >
                    {settings.name[0]}
                  </div>
                  <h1
                    className="font-display font-bold text-3xl mb-2"
                    style={{ color: activeTheme.color }}
                  >
                    {settings.name}
                  </h1>
                  <p
                    className="font-mono text-sm mb-4"
                    style={{ color: `${activeTheme.color}80` }}
                  >
                    {settings.headline}
                  </p>
                  <p
                    className="font-display text-sm max-w-lg mx-auto leading-relaxed"
                    style={{ color: `${activeTheme.color}50` }}
                  >
                    {settings.bio}
                  </p>
                </div>

                <div>
                  <div
                    className="font-mono text-[10px] tracking-[3px] mb-6 text-center"
                    style={{ color: `${activeTheme.color}40` }}
                  >
                    // SELECTED_WORK
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects
                      .filter((p) => p.featured)
                      .map((project) => (
                        <div
                          key={project.id}
                          className="border p-5"
                          style={{
                            borderColor: `${project.color}25`,
                            background: `${project.color}08`,
                          }}
                        >
                          <div
                            className="font-display font-bold text-sm mb-2"
                            style={{ color: project.color }}
                          >
                            {project.title}
                          </div>
                          <p
                            className="font-display text-xs leading-relaxed mb-3"
                            style={{ color: `${activeTheme.color}40` }}
                          >
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[9px] px-2 py-0.5 border"
                                style={{
                                  color: `${project.color}60`,
                                  borderColor: `${project.color}20`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
        title="Add Project"
        size="md"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Project Title"
            placeholder="E-Commerce Platform"
            value={projectForm.title}
            onChange={(e) =>
              setProjectForm((p) => ({ ...p, title: e.target.value }))
            }
          />
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
              Description //
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the project..."
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors resize-none"
            />
          </div>
          <Input
            label="Tags (comma separated)"
            placeholder="Next.js, TypeScript, PostgreSQL"
            value={projectForm.tags}
            onChange={(e) =>
              setProjectForm((p) => ({ ...p, tags: e.target.value }))
            }
          />
          <Input
            label="Project URL (optional)"
            placeholder="https://example.com"
            value={projectForm.url}
            onChange={(e) =>
              setProjectForm((p) => ({ ...p, url: e.target.value }))
            }
          />

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
              Accent Color //
            </label>
            <div className="flex gap-3 items-center">
              {["#00ff88", "#00d4ff", "#a855f7", "#f59e0b", "#ef4444"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setProjectForm((p) => ({ ...p, color }))
                    }
                    className={cn(
                      "w-7 h-7 border-2 transition-all",
                      projectForm.color === color
                        ? "border-white scale-110"
                        : "border-transparent"
                    )}
                    style={{ background: color }}
                  />
                )
              )}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={projectForm.featured}
              onChange={(e) =>
                setProjectForm((p) => ({
                  ...p,
                  featured: e.target.checked,
                }))
              }
              className="accent-brand-amber cursor-pointer"
            />
            <label
              htmlFor="featured"
              className="font-display text-sm text-white/60 cursor-pointer"
            >
              Feature this project on my portfolio
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={addProject}
            >
              Add Project
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowNewProject(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Project"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="font-display text-white/60 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">
              {selectedProject?.title}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={() =>
                selectedProject && deleteProject(selectedProject.id)
              }
            >
              Delete Project
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