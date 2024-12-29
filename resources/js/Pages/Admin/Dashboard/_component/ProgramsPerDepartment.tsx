import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Rectangle, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ProgramsPerDepartment as InterfaceProgramsPerDepartment } from "@/types/Admin/dashboard"

interface ProgramsPerDepartmentProps extends InterfaceProgramsPerDepartment { }

export function ProgramsPerDepartment({ data }: ProgramsPerDepartmentProps) {
    console.log("ProgramsPerDepartment => props", data);

    // Sort data by programs_count in descending order als remove with zero program count
    const sortedData = data
        .sort((a, b) => b.programs_count - a.programs_count)
        .filter((department) => department.programs_count != 0)

    // Prepare chart data
    const chartData = sortedData.map((item, index) => ({
        department_name: item.name,
        programs_count: item.programs_count,
        fill: `var(--chart-1)`,
    }))

    // Prepare chart config
    const chartConfig = chartData.reduce((acc, item, index) => {
        acc[item.department_name] = {
            label: item.department_name.charAt(0).toUpperCase() + item.department_name.slice(1),
            color: `hsl(var(--chart-1))`,
        }
        return acc
    }, {} as ChartConfig)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Programs Per Department</CardTitle>
                <CardDescription>Current Data</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis dataKey="programs_count" type="number" hide />
                        <XAxis
                            dataKey="department_name"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                String(chartConfig[value as keyof typeof chartConfig]?.label || "")
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="programs_count"
                            strokeWidth={2}
                            radius={8}
                            activeBar={({ ...props }) => {
                                return (
                                    <Rectangle
                                        {...props}
                                        fillOpacity={0.8}
                                        stroke={props.payload.fill}
                                        strokeDasharray={4}
                                        strokeDashoffset={4}
                                    />
                                )
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing total <strong>{chartData.reduce((acc, current) => acc + current.programs_count, 0)}</strong> programs of all departments.
                </div>
            </CardFooter>
        </Card>
    )
}
