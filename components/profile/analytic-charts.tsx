"use client";

import type { User } from "@/context/app-context";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import { Clock } from "lucide-react";

interface AnalyticsChartsProps {
  user: User;
}

export default function AnalyticsCharts({ user }: AnalyticsChartsProps) {
  const hourlyData = Object.entries(user.sessionsByHour).map(
    ([hour, count]) => ({
      hour: `${Number.parseInt(hour)}h`,
      sessions: count,
    })
  );

  const taskStats = [
    { name: "Completed", value: user.tasksCompleted, fill: "#22c55e" },
    {
      name: "In Progress",
      value: Math.max(0, user.tasks.filter((t) => !t.completed).length),
      fill: "#a855f7",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-purple-500/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Sessions by Hour
          </CardTitle>
          <CardDescription>
            Your pomodoro sessions throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sessions: {
                label: "Sessions",
                color: "hsl(280, 85%, 60%)",
              },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hourlyData}
                margin={{ top: 5, right: 100, left: -30, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="hour"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="hsl(280, 85%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(280, 85%, 60%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-orange-500/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-lg">Task Status</CardTitle>
          <CardDescription>Current task completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completed: { label: "Completed", color: "#22c55e" },
              inProgress: { label: "In Progress", color: "#a855f7" },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-green-500/30 bg-black/40 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
          <CardDescription>Your last 10 pomodoro sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-purple-500/50">
            {user.pomodoroSessions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No sessions yet. Start your first pomodoro!
              </p>
            ) : (
              user.pomodoroSessions
                .slice(-10)
                .reverse()
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 via-transparent to-orange-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-300">
                        {new Date(session.startTime).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.duration} min work + {session.breakDuration}{" "}
                        min break
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">
                        {session.focusScore}% focus
                      </p>
                      <p className="text-xs text-orange-400 mt-1">
                        +{Math.floor(session.duration * 40)} XP
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
