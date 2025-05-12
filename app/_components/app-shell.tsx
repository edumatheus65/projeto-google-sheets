// app/_components/app-shell.tsx
"use client";

import React from "react";
import Sidebar from "./sidebar";
import { useAuth } from "../application/auth/hooks/use-auth";
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando Aplicação...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-1">{children}</main>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppShell;
