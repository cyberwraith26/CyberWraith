import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CyberWraith — SaaS & Tech Solutions Platform",
    template: "%s | CyberWraith",
  },
  description:
    "CyberWraith powers productivity tools and advanced technical solutions to help freelancers and businesses scale globally.",
  keywords: [
    "SaaS platform",
    "freelancer tools",
    "web development",
    "cybersecurity",
    "Linux administration",
    "productivity tools",
    "CyberWraith",
  ],
  authors: [{ name: "CyberWraith" }],
  creator: "CyberWraith",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "CyberWraith — SaaS & Tech Solutions Platform",
    description:
      "The all-in-one platform for freelancers and businesses. Productivity tools, web development, Linux systems, and cybersecurity.",
    siteName: "CyberWraith",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "CyberWraith Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberWraith — SaaS & Tech Solutions Platform",
    description:
      "Productivity tools and technical solutions for modern professionals.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body className="bg-dark text-white/80 antialiased">
        <Providers session={session}>
          <Header />
          <main className="min-h-screen pt-[60px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}