import { prisma } from "@/app/_lib/prisma";
import { ChartResult } from "@/app/_lib/types/charts";
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

    const [allRecords, taskCount, mostWorkedLocation, activityChartData] =
      await Promise.all([
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
        getActivityChartData(userId, start, end),
      ]);

    return NextResponse.json({
      allRecords,
      taskCount,
      mostWorkedLocation,
      activityChartData,
    });
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
      WHERE user_id = ${userId} 
      AND task_id IS NOT NULL
      AND custcol_20 >= ${startDate}
      AND custcol_20 <= ${endDate}
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
    AND custcol_20 >= ${startDate}
    AND custcol_20 <= ${endDate}
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

export async function getActivityChartData(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await prisma.$queryRaw<ChartResult[]>`
        SELECT
            DATE("custcol_20") as date,
            COUNT(*) as total
        FROM activity_data
        WHERE user_id = ${userId}
        AND custcol_20 BETWEEN ${startDate} AND ${endDate}
        GROUP BY DATE("custcol_20")
        ORDER BY date ASC 
        `;

  return result.map((item) => ({
    date: item.date.toISOString().split("T")[0],
    total: Number(item.total),
  }));
}
