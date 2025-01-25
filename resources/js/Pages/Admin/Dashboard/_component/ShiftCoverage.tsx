"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the shape of the chart data
interface ShiftCoverage {
  shift: string;
  total_slots: number;
  allocated: number;
}

// Define the chart configuration type
interface ChartConfigType extends ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

// Props for the component
interface BarChartCardProps {
  shiftCoverage: ShiftCoverage[]; // Pass shiftCoverage from the backend
}

export function ShiftCoverageBarChart({ shiftCoverage }: BarChartCardProps) {
  // Chart configuration
  const chartConfig: ChartConfigType = {
    total_slots: {
      label: "Total Slots",
      color: "hsl(var(--chart-1))", // Blue color
    },
    allocated: {
      label: "Allocated Slots",
      color: "hsl(var(--chart-2))", // Green color
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift Coverage</CardTitle>
        <CardDescription>Total vs Allocated Slots per Shift</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={shiftCoverage}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="shift"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar
              dataKey="total_slots"
              fill="hsl(var(--chart-1))" // Blue color
              radius={[8, 8, 0, 0]} // Rounded corners
            />
            <Bar
              dataKey="allocated"
              fill="hsl(var(--chart-2))" // Green color
              radius={[8, 8, 0, 0]} // Rounded corners
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}