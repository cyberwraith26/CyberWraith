import Link from "next/link";
import { cn } from "@/lib/utils";
import { FOOTER_NAV } from "@/config/nav";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-green/10 bg-dark">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div
                className="w-7 h-7 transition-all duration-300 group-hover:shadow-neon"
                style={{
                  background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              />
              <span className="font-mono text-base tracking-[3px] text-white">
                CYBER<span className="text-brand-green">WRAITH</span>
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6 font-display">
              The all-in-one productivity and technical solutions platform
              for modern freelancers and businesses worldwide.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { label: "GH", href: "https://github.com" },
                { label: "TW", href: "https://twitter.com" },
                { label: "LI", href: "https://linkedin.com" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center",
                    "border border-white/10 font-mono text-[10px]",
                    "text-white/40 hover:text-brand-green",
                    "hover:border-brand-green/40",
                    "transition-all duration-200"
                  )}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(FOOTER_NAV).map(([section, links]) => (
            <div key={section}>
              <div className="font-mono text-[10px] tracking-widest uppercase text-brand-green/50 mb-5">
                {section}
              </div>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-white/40 font-display",
                        "hover:text-brand-green transition-colors duration-200",
                        "relative hover:pl-2 transition-all"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] text-white/20 tracking-widest">
              © {currentYear} CYBERWRAITH // ALL RIGHTS RESERVED
            </span>

            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="font-mono text-[10px] text-white/20 hover:text-brand-green/60 tracking-widest transition-colors"
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-glow" />
              <span className="font-mono text-[10px] text-brand-green/40 tracking-widests">
                STATUS: OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};