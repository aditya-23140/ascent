"use client";

import { useAppState } from "@/context/app-context";
import { Zap, CheckCircle2, Clock, Trophy } from "lucide-react";

export default function QuickStats() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const stats = [
    {
      label: "Total XP",
      value: user.totalXP.toLocaleString(),
      icon: Zap,
      color: "amber",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      label: "Tasks Done",
      value: user.tasksCompleted,
      icon: CheckCircle2,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Sessions",
      value: user.sessionsCompleted,
      icon: Clock,
      color: "sky",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      iconColor: "text-sky-400",
    },
    {
      label: "Rank",
      value: `#${user.rank}`,
      icon: Trophy,
      color: "violet",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      iconColor: "text-violet-400",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="font-semibold text-foreground">Your Stats</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
