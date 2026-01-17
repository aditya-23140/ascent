"use client";

import { useAppState } from "@/context/app-context";
import BadgesDisplay from "@/components/profile/badges-display";
import StatsGrid from "@/components/profile/stats-grid";
import AnalyticsCharts from "@/components/profile/analytic-charts";
import { User, Zap, Target, Trophy } from "lucide-react";

export default function ProfilePage() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="font-semibold text-foreground">Profile</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-sm text-violet-400">
                    <Target className="w-4 h-4" />
                    Level {user.level}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                    <Trophy className="w-4 h-4" />
                    Rank #{user.rank}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">
                  {user.score.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Level Progress
              </span>
              <span className="text-sm font-medium text-foreground">
                {user.currentXP}/1000 XP
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(user.currentXP / 1000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {1000 - user.currentXP} XP until Level {user.level + 1}
            </p>
          </div>
        </div>
      </div>

      <StatsGrid user={user} />
      <AnalyticsCharts user={user} />
      <BadgesDisplay badges={user.badges} />
    </div>
  );
}
