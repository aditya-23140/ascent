"use client";

import { useAppState } from "@/context/app-context";
import StatsOverview from "./dashboard/stats-overview";
import RecentActivity from "./dashboard/recent-activity";
import StreakDisplay from "./dashboard/streak-display";
import QuickStats from "./dashboard/quick-stats";

export default function Dashboard() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and dominate the leaderboard
        </p>
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
