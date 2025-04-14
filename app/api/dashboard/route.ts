import { excelSerialToDate } from "@/app/_lib/excel-serial";
import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!userId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "User ID and startDate and endDate is required" },
      { status: 400 },
    );
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [allRecordsRaw, taskCount, mostWorkedLocation] = await Promise.all([
      prisma.activityData.findMany({
        where: {
          user_id: userId,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      getTaskIdByUser(userId, start, end),
      getMostWorkedLocation(userId, start, end),
    ]);

    const allRecords = allRecordsRaw.map((record) => ({
      ...record,
      convertedDate: excelSerialToDate(Number(record.custcol_20)),
    }));

    return NextResponse.json({ allRecords, taskCount, mostWorkedLocation });
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export const getTaskIdByUser = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT task_id) AS count
      FROM activity_data
      WHERE user_id = ${userId} AND task_id IS NOT NULL
      AND createdAt >= ${startDate}
      AND createdAt < ${endDate}
    `;

  return Number(result[0]?.count ?? 0);
};

export const getMostWorkedLocation = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<string> => {
  const result = await prisma.$queryRaw<{ locn_brcd: string; count: number }[]>`
    SELECT locn_brcd, COUNT(*) as count
    FROM activity_data
    WHERE user_id = ${userId}
    AND createdAt >= ${startDate}
    AND createdAt < ${endDate}
    GROUP BY locn_brcd
    ORDER BY count DESC
    LIMIT 1
    `;

  if (!result.length) return "Sem dados";

  const location = result[0].locn_brcd;

  if (
    ["AA", "SEGMENTOA3", "AF"].some((prefix) => location.startsWith(prefix))
  ) {
    return "Linha A";
  }

  if (["MM", "MF"].some((prefix) => location.startsWith(prefix))) {
    return "SDA";
  }

  if (["FC"].some((prefix) => location.startsWith(prefix))) {
    return "Full Case";
  }

  if (["CA", "CC", "CF"].some((prefix) => location.startsWith(prefix))) {
    return "Linha C";
  }

  return "Outro";
};
