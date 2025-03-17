import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    const googleSheetsResponse = await fetch(
      "https://www.googleapis.com/auth/spreadsheets",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      },
    );

    if (!googleSheetsResponse.ok) {
      throw new Error("Error ao atualizar google sheets");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error ao atualizar status" },
      { status: 500 },
    );
  }
}
