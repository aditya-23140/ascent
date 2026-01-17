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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock, Target, History, Zap } from "lucide-react";

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
    { name: "Completed", value: user.tasksCompleted, fill: "#10b981" },
    {
      name: "In Progress",
      value: Math.max(0, user.tasks.filter((t) => !t.completed).length),
      fill: "#8b5cf6",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sessions by Hour Chart */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10">
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Sessions by Hour
              </h2>
              <p className="text-sm text-muted-foreground">
                Your pomodoro sessions throughout the day
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ChartContainer
            config={{
              sessions: {
                label: "Sessions",
                color: "#0ea5e9",
              },
            }}
            className="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hourlyData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
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
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: "#0ea5e9", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#0ea5e9" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Task Status Pie Chart */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Target className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Task Status</h2>
              <p className="text-sm text-muted-foreground">
                Current task completion status
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ChartContainer
            config={{
              completed: { label: "Completed", color: "#10b981" },
              inProgress: { label: "In Progress", color: "#8b5cf6" },
            }}
            className="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={0}
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Recent Sessions</h2>
              <p className="text-sm text-muted-foreground">
                Your last 10 pomodoro sessions
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {user.pomodoroSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-muted-foreground">
                  No sessions yet. Start your first pomodoro!
                </p>
              </div>
            ) : (
              user.pomodoroSessions
                .slice(-10)
                .reverse()
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Clock className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(session.startTime).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                          <span className="text-muted-foreground ml-2">
                            {new Date(session.startTime).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {session.duration} min work + {session.breakDuration}{" "}
                          min break
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">
                          {session.focusScore}% focus
                        </p>
                        <p className="text-xs text-amber-400 flex items-center justify-end gap-1 mt-0.5">
                          <Zap className="w-3 h-3" />+
                          {Math.floor(session.duration * 40)} XP
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
