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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";

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
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <BarChart3 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Weekly Activity</h2>
            <p className="text-sm text-muted-foreground">
              Sessions and tasks completed this week
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ChartContainer
          config={{
            sessions: {
              label: "Pomodoro Sessions",
              color: "#10b981",
            },
            tasks: {
              label: "Tasks Completed",
              color: "#8b5cf6",
            },
          }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="sessions"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                name="Pomodoro Sessions"
              />
              <Bar
                dataKey="tasks"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                name="Tasks Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
