import { Pie, PieChart } from "recharts";
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
interface ChartData {
  name: string;
  value: number;
  fill: string;
}

// Define the chart configuration type
interface ChartConfigType extends ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

// Props for the component
interface PieChartCardProps {
  courseTypes: { [key: string]: number }; // Pass courseTypes from the backend
}

export function PieChartCard({ courseTypes }: PieChartCardProps) {
  // Transform courseTypes into chart data
  const chartData: ChartData[] = Object.keys(courseTypes).map((key, index) => ({
    name: key,
    value: courseTypes[key],
    fill: `hsl(var(--chart-${index + 1}))`, // Dynamic fill colors
  }));

  // Chart configuration
  const chartConfig: ChartConfigType = Object.keys(courseTypes).reduce(
    (config, key, index) => {
      config[key] = {
        label: key,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return config;
    },
    {} as ChartConfigType
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Course Types</CardTitle>
        <CardDescription>Distribution of Course Types</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}