"use client";

import { useAppState } from "@/context/app-context";
import { Trophy, Hash, Zap, Users } from "lucide-react";

export default function LeaderboardStats() {
  const { getLeaderboard, getCurrentUser } = useAppState();
  const leaderboard = getLeaderboard();
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const userRank = leaderboard.findIndex((u) => u.id === currentUser.id) + 1;

  const stats = [
    {
      label: "Your Rank",
      value: `#${userRank}`,
      subtext: `${leaderboard.length - userRank} ahead of you`,
      icon: Hash,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
    },
    {
      label: "Your Score",
      value: currentUser.score.toLocaleString(),
      subtext: `+${currentUser.totalXP.toLocaleString()} total XP`,
      icon: Zap,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Top Score",
      value: leaderboard[0]?.score.toLocaleString() || "0",
      subtext: `by ${leaderboard[0]?.name || "N/A"}`,
      icon: Trophy,
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      iconColor: "text-violet-400",
      valueColor: "text-violet-400",
    },
    {
      label: "Total Players",
      value: leaderboard.length.toString(),
      subtext: "competing now",
      icon: Users,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      iconColor: "text-sky-400",
      valueColor: "text-sky-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-card border border-border rounded-2xl p-5 ${stat.bgColor.replace(
              "/10",
              "/5"
            )} hover:${stat.bgColor} transition-all`}
          >
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
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
