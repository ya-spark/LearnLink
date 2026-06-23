import type { User } from "@shared/schema";

export const isFrontendOnly = import.meta.env.VITE_FRONTEND_ONLY === "true";

export const devUser: User = {
  id: "frontend-dev-user",
  email: "dev@local",
  firstName: "Dev",
  lastName: "User",
  profileImageUrl: null,
  role: "student",
  subscriptionStatus: "free",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  aiCredits: null,
  instituteId: null,
  createdAt: null,
  updatedAt: null,
};
