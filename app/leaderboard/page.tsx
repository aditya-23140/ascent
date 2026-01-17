"use client";

import { useAppState } from "@/context/app-context";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import LeaderboardStats from "@/components/leaderboard/leaderboard-stats";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { getLeaderboard, getCurrentUser } = useAppState();
  const leaderboard = getLeaderboard();
  const currentUser = getCurrentUser();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank against other users
          </p>
        </div>
      </div>

      <LeaderboardStats />
      <LeaderboardTable
        leaderboard={leaderboard}
        currentUserId={currentUser?.id || ""}
      />
    </div>
  );
}
