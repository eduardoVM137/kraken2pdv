// app/dashboard/ventas/historico/components/SalesChartCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Point {
  date: string;
  total: number;
}

interface Props {
  data: Point[];
}

export default function SalesChartCard({ data }: Props) {
  return (
    <Card className="bg-white border rounded shadow-sm p-2 h-24 border-gray-600">
      <CardHeader className="p-0 mb-1">
        <CardTitle className="text-xs font-semibold uppercase text-gray-800">
          Ventas x Día
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 4, borderColor: "#e5e7eb" }}
              formatter={(v: number) => `S/ ${v.toFixed(2)}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1e40af"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
