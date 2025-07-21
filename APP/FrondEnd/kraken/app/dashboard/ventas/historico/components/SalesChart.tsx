"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Point { date: string; total: number; }
interface Props { data: Point[]; }

export default function SalesChartCard({ data }: Props) {
  return (
    <Card className="bg-white border border-gray-300 rounded shadow-sm h-52 flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold text-gray-800">
          Ventas x Día
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `S/${v}`}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 4, borderColor: "#e5e7eb" }}
              formatter={(value: number) => `S/ ${value.toFixed(2)}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1e40af"
              strokeWidth={2}
              dot={{ r: 3, fill: "#1e40af" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
