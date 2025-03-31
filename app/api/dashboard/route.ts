import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const [allRecords, taskCount, mostWorkedLocation] = await Promise.all([
      prisma.activityData.findMany({ where: { user_id: userId } }),
      getTaskIdByUser(userId),
      getMostWorkedLocation(userId),
    ]);

    return NextResponse.json({ allRecords, taskCount, mostWorkedLocation });
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export const getTaskIdByUser = async (userId: string): Promise<number> => {
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(task_id) AS count
      FROM activity_data
      WHERE user_id = ${userId} AND task_id IS NOT NULL
    `;

  return Number(result[0]?.count ?? 0);
};

export const getMostWorkedLocation = async (
  userId: string,
): Promise<string> => {
  const result = await prisma.$queryRaw<{ locn_brcd: string; count: number }[]>`
    SELECT locn_brcd, COUNT(*) as count
    FROM activity_data
    WHERE user_id = ${userId}
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
