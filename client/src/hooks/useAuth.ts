import { devUser, isFrontendOnly } from "@/lib/frontendOnly";
import type { User } from "@shared/schema";

export function useAuth(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} {
  if (isFrontendOnly) {
    return {
      user: devUser,
      isLoading: false,
      isAuthenticated: true,
    };
  }

  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}
