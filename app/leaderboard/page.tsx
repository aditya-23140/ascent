"use client";

import { useAppState } from "@/context/app-context";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import LeaderboardStats from "@/components/leaderboard/leaderboard-stats";

export default function LeaderboardPage() {
  const { getLeaderboard, getCurrentUser } = useAppState();
  const leaderboard = getLeaderboard();
  const currentUser = getCurrentUser();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          See how you rank against other users
        </p>
      </div>

      <LeaderboardStats />
      <LeaderboardTable
        leaderboard={leaderboard}
        currentUserId={currentUser?.id || ""}
      />
    </div>
  );
}
