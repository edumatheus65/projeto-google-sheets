import { prisma } from "@/app/_lib/prisma";

export const allRecordsUser = async (userId: string) => {
  return await prisma.activityData.findMany({
    where: {
      user_id: userId,
    },
  });
};

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
