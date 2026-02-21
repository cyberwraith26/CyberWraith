import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Freelance Developer",
    country: "🇲🇽 Mexico",
    avatar: "AR",
    color: "#00ff88",
    quote:
      "FollowStack alone paid for itself in the first week. I closed two clients I'd completely forgotten to follow up with.",
  },
  {
    name: "Priya Sharma",
    role: "UX Consultant",
    country: "🇮🇳 India",
    avatar: "PS",
    color: "#00d4ff",
    quote:
      "ProposalGen is scary good. I paste in a job description and get a proposal that's better than anything I'd write myself.",
  },
  {
    name: "James Okafor",
    role: "Copywriter & Strategist",
    country: "🇳🇬 Nigeria",
    avatar: "JO",
    color: "#a855f7",
    quote:
      "The Linux server setup CyberWraith did for our agency was bulletproof. Zero downtime in 8 months. These guys know their stuff.",
  },
  {
    name: "Sara Lindqvist",
    role: "Brand Designer",
    country: "🇸🇪 Sweden",
    avatar: "SL",
    color: "#f59e0b",
    quote:
      "I spun up my portfolio on PortfolioBuilder in 20 minutes and landed a client from it the same week. Genuinely shocked.",
  },
  {
    name: "Carlos Mendes",
    role: "SaaS Founder",
    country: "🇧🇷 Brazil",
    avatar: "CM",
    color: "#ef4444",
    quote:
      "CyberWraith built our entire MVP in 6 weeks. Clean code, proper architecture, and they actually understood what we were building.",
  },
  {
    name: "Aisha Kamara",
    role: "Marketing Consultant",
    country: "🇸🇱 Sierra Leone",
    avatar: "AK",
    color: "#00ff88",
    quote:
      "LeadEnrich found 300 verified contacts in under 10 minutes. My old process for that took two days. Absolutely insane.",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] text-brand-purple tracking-[3px] block mb-4">
          // USER_FEEDBACK.load()
        </span>
        <h2
          className="font-display font-bold text-white mb-5"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          Trusted by Freelancers Globally
        </h2>
        <p className="text-white/50 font-display max-w-md mx-auto">
          From Lagos to Stockholm, professionals are using CyberWraith
          to scale their independent careers.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <Card
            key={i}
            hoverable
            className="group"
            glowColor={t.color}
          >
            <CardContent className="p-7">
              {/* Quote mark */}
              <div
                className="font-mono text-4xl leading-none mb-4 opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ color: t.color }}
              >
                "
              </div>

              {/* Quote text */}
              <p className="text-sm text-white/60 leading-relaxed mb-6 font-display italic">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className="w-9 h-9 flex items-center justify-center font-mono text-xs font-bold text-black shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-white">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] text-white/30 tracking-wide">
                    {t.role} · {t.country}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};