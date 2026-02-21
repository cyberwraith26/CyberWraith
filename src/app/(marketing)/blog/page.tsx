import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on freelancing, SaaS tools, web development, Linux systems, and cybersecurity from the CyberWraith team.",
};

const BLOG_POSTS = [
  {
    slug: "how-to-automate-client-followups",
    title: "How to Automate Client Follow-Ups Without Losing the Personal Touch",
    excerpt:
      "Most freelancers lose deals not because of bad proposals but because they forget to follow up. Here is how to fix that with FollowStack.",
    tag: "Outreach",
    tagColor: "#00ff88",
    date: "January 15, 2025",
    readTime: "6 min read",
    author: "CyberWraith Team",
  },
  {
    slug: "linux-server-hardening-checklist",
    title: "Linux Server Hardening Checklist for Freelance Developers",
    excerpt:
      "A practical, no-nonsense checklist for locking down a fresh Ubuntu or Debian server before you put anything valuable on it.",
    tag: "Linux",
    tagColor: "#a855f7",
    date: "January 8, 2025",
    readTime: "9 min read",
    author: "CyberWraith Team",
  },
  {
    slug: "how-to-write-winning-freelance-proposals",
    title: "How to Write Winning Freelance Proposals in 2025",
    excerpt:
      "The anatomy of a proposal that converts — what to include, what to cut, and how AI can help you do it faster without sounding generic.",
    tag: "AI Tools",
    tagColor: "#a855f7",
    date: "December 28, 2024",
    readTime: "8 min read",
    author: "CyberWraith Team",
  },
  {
    slug: "saas-architecture-for-solo-founders",
    title: "SaaS Architecture Decisions Every Solo Founder Should Make Early",
    excerpt:
      "The architectural choices you make in week one will either save you or haunt you at scale. Here is what we learned building CyberWraith.",
    tag: "SaaS",
    tagColor: "#00d4ff",
    date: "December 20, 2024",
    readTime: "11 min read",
    author: "CyberWraith Team",
  },
  {
    slug: "penetration-testing-basics-freelancers",
    title: "Penetration Testing Basics Every Freelance Developer Should Know",
    excerpt:
      "You do not need to be a security specialist to catch the most common vulnerabilities in your clients' apps. Start here.",
    tag: "Security",
    tagColor: "#ef4444",
    date: "December 10, 2024",
    readTime: "10 min read",
    author: "CyberWraith Team",
  },
  {
    slug: "building-a-freelance-portfolio-that-converts",
    title: "Building a Freelance Portfolio That Actually Converts Visitors",
    excerpt:
      "Most freelance portfolios look good but say nothing. Here is how to structure yours so prospects know immediately whether to hire you.",
    tag: "Publishing",
    tagColor: "#f59e0b",
    date: "November 30, 2024",
    readTime: "7 min read",
    author: "CyberWraith Team",
  },
];

const TAG_FILTERS = [
  "All",
  "Outreach",
  "Linux",
  "AI Tools",
  "SaaS",
  "Security",
  "Publishing",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-dark grid-bg py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-[11px] text-brand-green/60 tracking-[3px] block mb-4">
            // BLOG.latest()
          </span>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
          >
            Insights & Guides
          </h1>
          <p className="text-white/50 font-display text-base leading-relaxed max-w-xl">
            Practical content on freelancing, SaaS tools, Linux
            administration, and cybersecurity from the CyberWraith team.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {TAG_FILTERS.map((tag) => (
            <button
              key={tag}
              className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-white/10 text-white/30 hover:text-brand-green hover:border-brand-green/30 transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
          <div className="border border-white/5 bg-dark-100 p-10 mb-8 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border"
                style={{
                  color: BLOG_POSTS[0].tagColor,
                  borderColor: `${BLOG_POSTS[0].tagColor}33`,
                  background: `${BLOG_POSTS[0].tagColor}11`,
                }}
              >
                {BLOG_POSTS[0].tag}
              </span>
              <span className="font-mono text-[10px] text-white/20 tracking-widest">
                FEATURED
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-4 group-hover:text-brand-green transition-colors">
              {BLOG_POSTS[0].title}
            </h2>
            <p className="text-white/50 font-display leading-relaxed mb-6 max-w-2xl">
              {BLOG_POSTS[0].excerpt}
            </p>
            <div className="flex items-center gap-4 font-mono text-[10px] text-white/25 tracking-widest">
              <span>{BLOG_POSTS[0].date}</span>
              <span>·</span>
              <span>{BLOG_POSTS[0].readTime}</span>
              <span>·</span>
              <span>{BLOG_POSTS[0].author}</span>
            </div>
          </div>
        </Link>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BLOG_POSTS.slice(1).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="border border-white/5 bg-dark-100 p-7 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                {/* Tag */}
                <span
                  className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border self-start mb-5"
                  style={{
                    color: post.tagColor,
                    borderColor: `${post.tagColor}33`,
                    background: `${post.tagColor}11`,
                  }}
                >
                  {post.tag}
                </span>

                {/* Title */}
                <h2 className="font-display font-bold text-lg text-white mb-3 group-hover:text-brand-green transition-colors flex-1">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-white/40 font-display leading-relaxed mb-5">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-widest mt-auto">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load more placeholder */}
        <div className="mt-12 text-center">
          <button className="font-mono text-[11px] tracking-widest uppercase px-8 py-3 border border-white/10 text-white/30 hover:text-brand-green hover:border-brand-green/30 transition-all duration-200">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}