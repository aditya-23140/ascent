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
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  user: User;
}

export default function StatsGrid({ user }: StatsGridProps) {
  const stats = [
    {
      label: "Current Level",
      value: user.level,
      icon: BarChart3,
      color: "text-purple-400",
    },
    {
      label: "Total XP",
      value: user.totalXP,
      icon: Zap,
      color: "text-orange-400",
    },
    {
      label: "Tasks Completed",
      value: user.tasksCompleted,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      label: "Pomodoro Sessions",
      value: user.sessionsCompleted,
      icon: Clock,
      color: "text-purple-400",
    },
    {
      label: "Current Streak",
      value: user.currentStreak,
      icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Longest Streak",
      value: user.longestStreak,
      icon: Trophy,
      color: "text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-black to-orange-500/5 hover:border-purple-500/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <Icon className={`${stat.color} w-8 h-8 opacity-60`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
