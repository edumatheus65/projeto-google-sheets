import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.activityData.findMany({
      distinct: ["user_id"],
      select: { user_id: true, user_name: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 },
    );
  }
}
