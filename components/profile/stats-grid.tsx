"use client";

import type { User } from "@/context/app-context";
import {
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
} from "lucide-react";

interface StatsGridProps {
  user: User;
}

export default function StatsGrid({ user }: StatsGridProps) {
  const stats = [
    {
      label: "Current Level",
      value: user.level,
      icon: BarChart3,
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      iconColor: "text-violet-400",
      valueColor: "text-violet-400",
    },
    {
      label: "Total XP",
      value: user.totalXP.toLocaleString(),
      icon: Zap,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
    },
    {
      label: "Tasks Completed",
      value: user.tasksCompleted,
      icon: CheckCircle2,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Pomodoro Sessions",
      value: user.sessionsCompleted,
      icon: Clock,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      iconColor: "text-sky-400",
      valueColor: "text-sky-400",
    },
    {
      label: "Current Streak",
      value: user.currentStreak,
      icon: Flame,
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      iconColor: "text-orange-400",
      valueColor: "text-orange-400",
    },
    {
      label: "Longest Streak",
      value: user.longestStreak,
      icon: Trophy,
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      iconColor: "text-rose-400",
      valueColor: "text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-card border ${
              stat.borderColor
            } rounded-2xl p-5 ${stat.bgColor.replace("/10", "/5")} hover:${
              stat.bgColor
            } transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${stat.valueColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
