"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const NO_LAYOUT_PREFIXES = [
  "/dashboard",
  "/tools",
  "/settings",
  "/admin",
  "/login",
  "/signup",
  "/forgot-password",
];

export const ConditionalLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isPublicPage = !NO_LAYOUT_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPublicPage) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-[60px]">{children}</main>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
};