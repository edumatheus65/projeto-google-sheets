"use client";

import { Button } from "./ui/button";
import { AiOutlineGoogle } from "react-icons/ai";

interface GoogleLoginButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

export function GoogleLoginButton({
  onClick,
  loading = false,
  label = "Login com Google",
  className = "",
}: GoogleLoginButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={className}
      variant="outline"
      size="lg"
    >
      {!loading && <AiOutlineGoogle className="mr-2 h-5 w-5" />}
      {loading ? "Carregando..." : label} {"Clique aqui"}
    </Button>
  );
}
