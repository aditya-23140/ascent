"use client";

import { useAppState } from "@/context/app-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function StatsOverview() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const chartData = [
    { week: "Mon", sessions: 5, tasks: 2 },
    { week: "Tue", sessions: 8, tasks: 3 },
    { week: "Wed", sessions: 6, tasks: 1 },
    { week: "Thu", sessions: 9, tasks: 4 },
    { week: "Fri", sessions: 7, tasks: 2 },
    { week: "Sat", sessions: 4, tasks: 1 },
    { week: "Sun", sessions: 3, tasks: 0 },
  ];

  return (
    <Card className="border-purple-500/30 bg-black/40">
      <CardHeader>
        <CardTitle className="text-xl">Weekly Activity</CardTitle>
        <CardDescription>
          Sessions and tasks completed this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sessions: {
              label: "Pomodoro Sessions",
              color: "hsl(280, 85%, 60%)",
            },
            tasks: {
              label: "Tasks Completed",
              color: "hsl(20, 95%, 55%)",
            },
          }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Legend />
              <Bar
                dataKey="sessions"
                fill="hsl(280, 85%, 60%)"
                radius={[8, 8, 0, 0]}
                name="Pomodoro Sessions"
              />
              <Bar
                dataKey="tasks"
                fill="hsl(20, 95%, 55%)"
                radius={[8, 8, 0, 0]}
                name="Tasks Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
