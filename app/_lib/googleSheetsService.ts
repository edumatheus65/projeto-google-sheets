"use server";

import "dotenv/config";
import { google } from "googleapis";
import { SheetData } from "./types/sheetData";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"],
);

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "1tFvmKsmsDXfGxkNu5LATZbFUVtFZgkG4XxOgETWMrp4";

export async function getSheetData(): Promise<SheetData[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Query_123!A1:F",
    });

    const values = response.data.values ?? [];

    if (values.length === 0) return [];

    const data = values.slice(1).map((row) => ({
      id: row[0] ?? "",
      quantity: row[1] ?? 0,
      uniPrice: row[2] ?? "",
      totalPrice: row[3] ?? "",
      orderDate: row[4] ?? "",
      status: row[5] ?? "",
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

getSheetData();
