"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetlast10minStatsQuery } from "@/apis/event-api";

export const description = "A bar chart showing last 10 minutes of data";

const chartConfig = {
  count: {
    label: "USER",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartBarLast10Minutes() {
  const { data } = useGetlast10minStatsQuery(null, {
    pollingInterval: 60000,
  });
  return (
    <Card className="col-span-2 w-full">
      <CardHeader>
        <CardTitle>Requests in Last 10 Minutes</CardTitle>
        <CardDescription>Real-time request count</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={data?.result}
              margin={{
                top: 20,
                right: 20,
                bottom: 190,
                left: 20,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="minute"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0} // Show all labels
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-desktop)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
