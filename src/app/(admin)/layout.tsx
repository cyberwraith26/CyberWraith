import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ADMIN_NAV } from "@/config/nav";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const user = session.user as { role?: string };
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Admin Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-dark-100 border-r border-brand-red/10 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6"
              style={{
                background: "linear-gradient(135deg, #ef4444, #f59e0b)",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span className="font-mono text-sm tracking-[2px] text-white">
              CYBER<span className="text-brand-red">WRAITH</span>
            </span>
          </Link>
          <div className="font-mono text-[9px] text-brand-red/50 tracking-[3px] mt-2">
            // ADMIN_CONSOLE
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {ADMIN_NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5",
                "font-mono text-[11px] tracking-widest uppercase",
                "border-l-2 border-transparent",
                "text-white/30 hover:text-brand-red",
                "hover:border-brand-red hover:bg-brand-red/5",
                "transition-all duration-200"
              )}
            >
              <span className="text-brand-red/30 text-xs">
                {`0${i + 1}`}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-mono text-[10px] text-white/20 hover:text-white/50 tracking-widest transition-colors"
          >
            ← USER DASHBOARD
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[220px]">
        {/* Admin Topbar */}
        <div className="sticky top-0 z-30 bg-dark-100/95 backdrop-blur border-b border-brand-red/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-glow" />
            <span className="font-mono text-[10px] text-brand-red/60 tracking-[3px]">
              ADMIN MODE ACTIVE
            </span>
          </div>
          <div className="font-mono text-[10px] text-white/20 tracking-widest">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }).toUpperCase()}
          </div>
        </div>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}