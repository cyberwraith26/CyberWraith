"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { UserSession } from "@/types";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";

  const user = session?.user as UserSession | undefined;

  const isAdmin = user?.role === "admin";

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const loginWithGitHub = async () => {
    await signIn("github", { callbackUrl: "/dashboard" });
  };

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: "Invalid email or password" };
      }

      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong. Try again." };
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const refreshSession = async () => {
    await update();
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
    loginWithGoogle,
    loginWithGitHub,
    loginWithCredentials,
    logout,
    refreshSession,
  };
};