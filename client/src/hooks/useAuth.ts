import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Query our database user data
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!firebaseUser) return null;
      
      const token = await firebaseUser.getIdToken();
      const userClaims = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      };
      
      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${encodeURIComponent(JSON.stringify(userClaims))}`,
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!firebaseUser && !isLoading,
    retry: false,
  });

  // Mutation to create/update user in our database
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest("POST", "/api/auth/user", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // Create user in our database when Firebase user is created
  useEffect(() => {
    if (firebaseUser && !user && !createUserMutation.isPending) {
      createUserMutation.mutate({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(" ")[0] || "",
        lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
        profileImageUrl: firebaseUser.photoURL,
      });
    }
  }, [firebaseUser, user, createUserMutation]);

  return {
    user,
    firebaseUser,
    isLoading: isLoading || createUserMutation.isPending,
    isAuthenticated: !!firebaseUser && !!user,
  };
}
