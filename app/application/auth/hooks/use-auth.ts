"use client";

import { signOut, useSession } from "next-auth/react";
import { useMemo } from "react";
import { loginWithGoogleCase } from "../useCases/login-with-google";
import { User } from "@/app/src/domains/user/entities/User";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user: User | null = useMemo(() => {
    if (session?.user) {
      return {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        avatarUrl: session.user.image || "",
      };
    }
    return null;
  }, [session]);

  const isAuthenticated = useMemo(() => status === "authenticated", [status]);
  const isLoading = useMemo(() => status === "loading", [status]);

  const loginWithGooggle = async () => {
    await loginWithGoogleCase();
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGooggle,
    logout,
    session,
    status,
  };
};
