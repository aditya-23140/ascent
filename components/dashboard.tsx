"use client";

import { useAppState } from "@/context/app-context";
import StatsOverview from "./dashboard/stats-overview";
import RecentActivity from "./dashboard/recent-activity";
import StreakDisplay from "./dashboard/streak-display";
import QuickStats from "./dashboard/quick-stats";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track your progress and dominate the leaderboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatsOverview />
        </div>
        <StreakDisplay />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickStats />
        <RecentActivity />
      </div>
    </div>
  );
}
