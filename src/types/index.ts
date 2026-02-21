// Re-export all types from one place
// so you can import from "@/types" anywhere in the app

export type {
  Tool,
  ToolTag,
  ToolStatus,
  ToolTier,
} from "./tool";

export type {
  User,
  UserRole,
  UserSession,
  UserSubscription,
} from "./user";

export type {
  Plan,
  SubscriptionTier,
  SubscriptionStatus,
  StripeWebhookEvent,
  CheckoutSessionMetadata,
} from "./subscription";

// Shared generic utility types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type ServiceItem = {
  title: string;
  icon: string;
  description: string;
  color: string;
  slug: string;
};