import { signIn } from "next-auth/react";

export async function loginWithGoogleCase(): Promise<void> {
  try {
    await signIn("google", { callbackUrl: "/dashboard" });
  } catch (error) {
    console.error("Error ao tentar login com o Google", error);

    throw new Error("Falha ao iniciar o login com o Google");
  }
}
