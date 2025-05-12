"use client";

import { GoogleLoginButton } from "@/app/_components/google-login-button";
import { useAuth } from "@/app/application/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const LoginPage = () => {
  const { loginWithGooggle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Usuário já autenticado, redirecionando para a dashboard...");
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Faça seu Login</h1>
      <GoogleLoginButton onClick={loginWithGooggle} loading={isLoading} />
    </div>
  );
};
