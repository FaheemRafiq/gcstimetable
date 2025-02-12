import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Define the shape of the chart data
interface StudentEnrollment {
  program: string
  semester: number
  students: number
}

// Props for the component
interface StudentEnrollmentChartProps {
  studentEnrollment: StudentEnrollment[] // Pass studentEnrollment from the backend
}

export function StudentEnrollmentChart({ studentEnrollment }: StudentEnrollmentChartProps) {
  // Transform data for the chart
  const chartData = studentEnrollment.reduce(
    (acc, item) => {
      const program = item.program
      const semester = `Semester ${item.semester}`
      const students = item.students

      // Find or create the program entry
      let programEntry = acc.find(entry => entry.program === program)
      if (!programEntry) {
        programEntry = { program }
        acc.push(programEntry)
      }

      // Add semester data to the program entry
      programEntry[semester] = students

      return acc
    },
    [] as { program: string; [key: string]: string | number }[]
  )

  // Chart configuration
  const chartConfig: ChartConfig = {
    program: {
      label: 'Program',
    },
    'Semester 1': {
      label: 'Semester 1',
      color: 'hsl(var(--chart-1))', // Blue
    },
    'Semester 2': {
      label: 'Semester 2',
      color: 'hsl(var(--chart-2))', // Green
    },
    'Semester 3': {
      label: 'Semester 3',
      color: 'hsl(var(--chart-3))', // Red
    },
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Student Enrollment</CardTitle>
        <CardDescription>Students per Program and Semester</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="program"
                tickLine={false}
                axisLine={false}
                tickFormatter={value => value}
              />
              <YAxis tickLine={false} axisLine={false} tickFormatter={value => `${value}`} />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Legend />
              <Bar
                dataKey="Semester 1"
                fill="hsl(var(--chart-1))" // Blue
                stackId="a"
                radius={[8, 8, 0, 0]} // Rounded corners
              />
              <Bar
                dataKey="Semester 2"
                fill="hsl(var(--chart-2))" // Green
                stackId="a"
                radius={[8, 8, 0, 0]} // Rounded corners
              />
              <Bar
                dataKey="Semester 3"
                fill="hsl(var(--chart-3))" // Red
                stackId="a"
                radius={[8, 8, 0, 0]} // Rounded corners
              />
              {/* Add more bars for additional semesters */}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
