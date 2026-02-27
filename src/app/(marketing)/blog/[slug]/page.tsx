import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

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
    content: `
      Following up with clients is the single highest-leverage activity
      a freelancer can do. Studies consistently show that 80% of sales
      require five or more follow-up touches — yet most freelancers give
      up after one.

      The problem is not motivation. It is memory and systems. When you
      are managing five active clients, three proposals in flight, and
      your own delivery work, following up consistently is nearly
      impossible without automation.

      ## Why Manual Follow-Up Fails

      Manual follow-up fails because it lives in your head. You tell
      yourself you will send that email tomorrow, tomorrow becomes next
      week, and by then the prospect has hired someone else.

      The solution is to remove the decision entirely. A good follow-up
      system fires automatically based on triggers — not on whether
      you remembered.

      ## The FollowStack Approach

      FollowStack lets you build sequences once and then forget about
      them. You define:

      - The trigger (proposal sent, meeting completed, no reply after X days)
      - The delay between touches (day 3, day 7, day 14)
      - The message content with personalization tokens
      - The stopping condition (reply detected, link clicked, manual pause)

      Once the sequence is live, every new lead that matches the trigger
      enters it automatically.

      ## Keeping It Personal

      Automation does not have to sound automated. The key is writing
      your follow-up messages in your own voice, keeping them short,
      and making each touch add value rather than just checking in.

      A good follow-up sequence looks like this:

      Day 3: Brief check-in, ask if they have questions about the proposal.
      Day 7: Share a relevant case study or result from a past project.
      Day 14: Create gentle urgency, mention your availability window.
      Day 21: Final touch, offer to jump on a quick call to address concerns.

      Each message should be two to four sentences. That is it.

      ## Getting Started

      Log into your CyberWraith dashboard, open FollowStack, and create
      your first sequence. Start with your most common scenario — a
      proposal that has not received a response after three days. Set it
      up once and it will run for every future proposal automatically.
    `,
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
    content: `
      Every time you spin up a new VPS, you are starting with a
      server that is already being scanned by bots within minutes.
      Hardening is not optional — it is the baseline.

      This checklist covers the essentials for Ubuntu 22.04 and
      Debian 12. Run through it in order on every fresh server.

      ## 1. Update Everything First

      Before anything else, update the package list and upgrade
      all installed packages.

      ## 2. Create a Non-Root User

      Never run your applications as root. Create a dedicated user,
      add them to the sudo group, and switch to that user for all
      subsequent operations.

      ## 3. Configure SSH Key Authentication

      Disable password authentication entirely. SSH key pairs are
      both more secure and more convenient once set up correctly.

      ## 4. Change the Default SSH Port

      Moving SSH off port 22 eliminates the vast majority of
      automated brute-force attempts. Port 2222 or a random port
      above 1024 works well.

      ## 5. Configure UFW Firewall

      Enable UFW and set a default deny policy on incoming traffic.
      Then explicitly allow only the ports your applications need.

      ## 6. Install Fail2Ban

      Fail2Ban monitors log files and automatically bans IPs that
      show signs of brute-force activity. Install it and configure
      it to monitor SSH and any web applications you are running.

      ## 7. Disable Root Login via SSH

      Set PermitRootLogin to no in your SSH configuration. Your
      sudo user can do everything root can do without the risk.

      ## 8. Set Up Automatic Security Updates

      Configure unattended-upgrades to automatically apply security
      patches. This protects you from vulnerabilities even when you
      are not actively monitoring the server.

      ## 9. Audit Open Ports

      Use ss or netstat to list all listening ports and close
      anything that should not be publicly accessible.

      ## 10. Set Up Log Monitoring

      Configure log rotation and consider forwarding logs to a
      centralized service so you have an audit trail if something
      goes wrong.
    `,
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
    content: `
      Most freelance proposals fail in the first paragraph.
      The client opens it, sees a wall of text about your background
      and experience, and closes the tab.

      The problem is that most freelancers write proposals about
      themselves. Winning proposals are about the client.

      ## The Three-Part Structure That Works

      A proposal that converts has three parts in this exact order.

      Part one is the problem restatement. Show the client that you
      understand their situation better than they articulated it.
      This builds immediate trust and differentiates you from every
      other applicant who copy-pasted a generic template.

      Part two is your approach. Not your credentials — your plan.
      Walk them through specifically how you would solve their problem.
      Be concrete. Use their language. Reference details from their
      brief.

      Part three is the investment. Present your pricing clearly with
      a brief justification. Include a timeline. End with a single
      clear call to action.

      ## What to Cut

      Cut your bio. Cut your list of past clients. Cut anything that
      makes the proposal about you rather than them. You can include
      one sentence about a relevant past project as social proof but
      that is the limit.

      ## Using AI Without Sounding Like AI

      ProposalGen generates a first draft based on your brief in
      under sixty seconds. The key is to treat this as a starting
      point not a finished product. Read it aloud. Replace any phrase
      that sounds formal or corporate with how you would actually
      say it in a conversation. Add one specific detail that only
      you would know from reading their project description carefully.

      That combination — AI speed plus your voice — produces
      proposals that are both fast to write and genuinely personal.
    `,
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
    content: `
      When we started building CyberWraith we made some architectural
      decisions quickly that turned out to be excellent and some that
      cost us significant refactoring time later.

      Here is what we wish someone had told us at the start.

      ## Choose Boring Technology for Infrastructure

      The infrastructure layer is not where you differentiate. Use
      proven tools with large communities and excellent documentation.
      Next.js for the frontend. PostgreSQL for the database. Stripe
      for billing. These choices let you move fast because the
      answers to your questions are already on Stack Overflow.

      ## Design for Multi-Tenancy from Day One

      If your SaaS will ever serve multiple organizations or teams,
      bake tenant isolation into your data model before you write a
      single feature. Adding it later is extraordinarily painful.

      ## Centralize Your Authorization Logic

      Every access control decision in your application should flow
      through one function. In CyberWraith this is the canAccessTool
      function in src/config/plans.ts. When the rules change you
      update one file. This sounds obvious but most early codebases
      scatter access checks everywhere and debugging permission bugs
      becomes a nightmare.

      ## Use Database Migrations from the Start

      Prisma with version-controlled migrations saved us many times.
      Never modify a production database schema by hand. Every change
      should be a migration file that can be replayed, rolled back,
      and reviewed in pull requests.

      ## Instrument Everything Before You Need It

      Add logging, error tracking, and usage analytics before you
      launch not after. Understanding how users actually use your
      product is impossible without data and the best time to
      instrument your code is when you are writing it.
    `,
  },
  {
    slug: "penetration-testing-basics-freelancers",
    title: "Penetration Testing Basics Every Freelance Developer Should Know",
    excerpt:
      "You do not need to be a security specialist to catch the most common vulnerabilities in your clients apps. Start here.",
    tag: "Security",
    tagColor: "#ef4444",
    date: "December 10, 2024",
    readTime: "10 min read",
    author: "CyberWraith Team",
    content: `
      The OWASP Top 10 has not changed dramatically in years because
      the same vulnerabilities keep appearing in production applications
      built by developers who never learned to think like attackers.

      As a freelance developer, knowing how to identify and fix the
      most common vulnerabilities makes you dramatically more valuable
      to clients and protects you from liability.

      ## The Three You Must Understand

      SQL injection, cross-site scripting, and broken authentication
      account for the majority of successful web application attacks.
      Understanding how each works and how to prevent it should be
      baseline knowledge for any developer who builds applications
      that handle user data.

      ## Always Get Written Authorization

      Before you test anything you do not own, get written permission.
      This is not optional. Penetration testing without authorization
      is illegal regardless of intent. All CyberWraith security
      engagements begin with a signed scope document.

      ## Start with Passive Reconnaissance

      Before touching the application, understand what is publicly
      visible. Check DNS records, certificate transparency logs,
      and exposed repositories. You would be surprised how much
      sensitive information leaks through these channels.

      ## Use the Right Tools

      Burp Suite Community Edition is free and covers most of what
      you need for web application testing. Nmap for network
      reconnaissance. OWASP ZAP for automated scanning. These three
      tools will take you through the majority of basic assessments.

      ## Report Findings Clearly

      The value of a penetration test is in the report. For each
      finding include the vulnerability type, how you found it,
      the potential impact, and a specific remediation recommendation.
      Clients pay for clarity not jargon.
    `,
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
    content: `
      A freelance portfolio has one job: convert a visitor into a
      lead. Everything else is secondary.

      Most portfolios fail at this job because they are designed to
      impress rather than to inform. They showcase work beautifully
      but leave the visitor unsure of exactly who this person helps,
      what they charge, and how to get started.

      ## Answer Three Questions in the First Fold

      Before a visitor scrolls, they should know who you help, what
      you do for them, and what the outcome looks like. This is your
      hero section. It should be one sentence per question maximum.

      ## Show Process Not Just Outcomes

      Screenshots of finished work are expected. What sets great
      portfolios apart is showing how you think. Include a brief
      case study for two or three projects that walks through the
      problem, your approach, and the measurable result.

      ## Make the Contact Step Obvious and Easy

      Every portfolio page should have a clear call to action that
      is visible without scrolling. Not a mailto link buried in the
      footer — a prominent button that opens a simple form or links
      directly to a booking page.

      ## Keep It Current

      A portfolio with projects from three years ago signals that
      you are not actively working. Set a quarterly reminder to add
      at least one recent project. PortfolioBuilder makes this
      straightforward — update your project list and the site
      rebuilds automatically.

      ## Speed Matters More Than Design

      A portfolio that loads in under two seconds converts better
      than a beautifully animated one that takes five. Optimize
      your images, minimize JavaScript, and test your Core Web Vitals
      before sharing the link with prospects.
    `,
  },
];

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-dark grid-bg py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/20 tracking-widest mb-12">
          <Link href="/" className="hover:text-brand-green transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-green transition-colors">
            BLOG
          </Link>
          <span>/</span>
          <span
            style={{ color: `${post.tagColor}80` }}
            className="truncate max-w-[200px]"
          >
            {post.title.toUpperCase().slice(0, 30)}...
          </span>
        </div>

        {/* Tag */}
        <span
          className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border inline-block mb-6"
          style={{
            color: post.tagColor,
            borderColor: `${post.tagColor}33`,
            background: `${post.tagColor}11`,
          }}
        >
          {post.tag}
        </span>

        {/* Title */}
        <h1
          className="font-display font-bold text-white mb-6 leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-white/25 tracking-widest mb-10 pb-10 border-b border-white/5">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-16">
          {post.content
            .trim()
            .split("\n\n")
            .map((block, i) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="font-display font-bold text-xl text-white mt-10 mb-4"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              return (
                <p
                  key={i}
                  className="text-white/60 font-display text-base leading-relaxed mb-5"
                >
                  {trimmed}
                </p>
              );
            })}
        </div>

        {/* CTA Block */}
        <div
          className="border p-8 mb-16 text-center"
          style={{
            borderColor: `${post.tagColor}30`,
            background: `${post.tagColor}08`,
          }}
        >
          <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-3">
            // TRY_CYBERWRAITH
          </div>
          <h3 className="font-display font-bold text-xl text-white mb-3">
            Ready to put this into practice?
          </h3>
          <p className="text-white/40 font-display text-sm mb-6">
            CyberWraith gives you the tools to apply everything in this
            article. Start free — no credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-brand-green text-black font-mono text-sm font-bold px-8 py-3 tracking-widest uppercase hover:bg-[#00ffaa] transition-colors"
            style={{
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            Start Free Trial →
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div>
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-6">
              // RELATED_POSTS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                  <div className="border border-white/5 bg-dark-100 p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border inline-block mb-4"
                      style={{
                        color: rel.tagColor,
                        borderColor: `${rel.tagColor}33`,
                      }}
                    >
                      {rel.tag}
                    </span>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-brand-green transition-colors mb-2">
                      {rel.title}
                    </h3>
                    <div className="font-mono text-[10px] text-white/20 tracking-widest">
                      {rel.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <Link
            href="/blog"
            className="font-mono text-[11px] text-white/20 hover:text-brand-green tracking-widest transition-colors"
          >
            ← BACK TO BLOG
          </Link>
        </div>
      </div>
    </div>
  );
}