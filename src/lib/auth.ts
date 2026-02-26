import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { TIER_RANK } from "@/config/plans";
import type { UserRole, SubscriptionTier } from "@/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            include: { subscription: true },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            tier: (user.subscription?.tier ?? "free") as SubscriptionTier,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === "google" ||
        account?.provider === "github"
      ) {
        try {
          const existing = await db.user.findUnique({
            where: { email: user.email! },
          });

          if (!existing) {
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: "user",
                subscription: {
                  create: {
                    tier: "free",
                    status: "active",
                  },
                },
              },
            });
          }
        } catch {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.tier = (user as { tier?: string }).tier ?? "free";
      }

      // Refresh role and tier from DB on every token refresh
      if (token.id) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            include: { subscription: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.tier = dbUser.subscription?.tier ?? "free";
          }
        } catch {
          // Keep existing token values if DB call fails
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role =
          token.role as string;
        (session.user as { tier?: string }).tier =
          token.tier as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

// Helper to check if user has required tier access
export const hasAccess = (
  userTier: string,
  requiredTier: string
): boolean => {
  return (
    (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[requiredTier] ?? 0)
  );
};