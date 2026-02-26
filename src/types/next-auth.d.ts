import "next-auth";
import "next-auth/jwt";
import type { UserRole } from "@/types/user";
import type { SubscriptionTier } from "@/types/subscription";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    tier: SubscriptionTier;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      tier: SubscriptionTier;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    tier: SubscriptionTier;
  }
}