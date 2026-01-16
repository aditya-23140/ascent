"use client";

import { useAppState } from "@/context/app-context";
import BadgesDisplay from "@/components/profile/badges-display";
import StatsGrid from "@/components/profile/stats-grid";
import AnalyticsCharts from "@/components/profile/analytic-charts";

export default function ProfilePage() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-600/10 via-black to-black/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-orange-400 to-green-400 bg-clip-text">
              {user.name}
            </h1>
            <p className="text-gray-400 mt-2">
              Level {user.level} • Rank #{user.rank}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-orange-400">{user.score}</p>
            <p className="text-sm text-gray-400">Total Score</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400 mb-3">Level Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-black/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${(user.currentXP / 1000) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-100">
              {user.currentXP}/1000 XP
            </span>
          </div>
        </div>
      </div>

      <StatsGrid user={user} />
      <AnalyticsCharts user={user} />
      <BadgesDisplay badges={user.badges} />
    </div>
  );
}
