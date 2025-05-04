"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: {
    date: string;
    total: number;
  }[];
}

export function ActivityChart({ data }: Props) {
  console.log("Data in the charts", data);
  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">Atividades por Dia</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="date" type="category" />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
