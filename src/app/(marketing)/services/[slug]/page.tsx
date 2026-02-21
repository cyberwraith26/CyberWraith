import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, SERVICES } from "@/config/services";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen bg-dark grid-bg py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/20 tracking-widest mb-12">
          <Link href="/" className="hover:text-brand-green transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-green transition-colors">SERVICES</Link>
          <span>/</span>
          <span style={{ color: service.color }}>{service.title.toUpperCase()}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-6 mb-16">
          <div
            className="w-16 h-16 flex items-center justify-center text-2xl shrink-0 border"
            style={{
              color: service.color,
              borderColor: `${service.color}33`,
              background: `${service.color}11`,
            }}
          >
            {service.icon}
          </div>
          <div>
            <h1
              className="font-display font-bold text-white mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              {service.title}
            </h1>
            <p className="text-white/50 font-display text-base leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* CTA Block */}
        <div
          className="border p-10 mb-16"
          style={{ borderColor: `${service.color}33`, background: `${service.color}08` }}
        >
          <h2 className="font-display font-bold text-xl text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-white/50 font-display text-sm mb-6 leading-relaxed">
            All service engagements begin with a free discovery call to
            understand your requirements, timeline, and budget. No
            commitment required.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact">
              <Button variant="primary" size="md">
                Request Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="ghost" size="md">
                ← All Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
