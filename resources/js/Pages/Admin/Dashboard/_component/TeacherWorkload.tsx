import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { router } from '@inertiajs/react'

// Define the shape of the chart data
interface TeacherWorkload {
  id: number
  teacher: string
  allocations: number
}

// Define the chart configuration type
interface ChartConfigType extends ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

// Props for the component
interface BarChartCardProps {
  teacherWorkload: TeacherWorkload[] // Pass teacherWorkload from the backend
}

export function TeacherWorkloadChart({ teacherWorkload }: BarChartCardProps) {
  // Chart configuration
  const chartConfig: ChartConfigType = {
    allocations: {
      label: 'Allocations',
      color: 'hsl(var(--chart-1))', // Blue color
    },
  }

  function handleShowTeacherWorkLoad(teacherWorkload: TeacherWorkload) {
    router.get(route('teachers.workload', teacherWorkload.id))
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Teacher Workload</CardTitle>
        <CardDescription>Allocations per Teacher</CardDescription>
      </CardHeader>
      <CardContent>
        {' '}
        {/* Increased height to accommodate the chart */}
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teacherWorkload}
              layout="vertical" // Horizontal bar chart
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              // onClick={() => handleShowTeacherWorkLoad(teacherWorkload)}
            >
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number" // X-axis for numerical values
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}`}
              />
              <YAxis
                type="category" // Y-axis for teacher names
                dataKey="teacher"
                tickLine={false}
                axisLine={false}
                width={100} // Adjust width for teacher names
              />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="allocations"
                fill="hsl(var(--chart-1))" // Blue color
                radius={8} // Rounded corners
                onClick={e => {
                  const { payload } = e

                  handleShowTeacherWorkLoad(payload)
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
