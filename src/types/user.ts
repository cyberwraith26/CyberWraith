import type { SubscriptionTier, SubscriptionStatus } from "./subscription";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  subscription?: UserSubscription;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
}

export interface UserSession {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  tier: SubscriptionTier;
}