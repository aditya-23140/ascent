"use client";

import { useAppState } from "@/context/app-context";

export default function LeaderboardStats() {
  const { getLeaderboard, getCurrentUser } = useAppState();
  const leaderboard = getLeaderboard();
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const userRank = leaderboard.findIndex((u) => u.id === currentUser.id) + 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card">
        <p className="text-sm text-muted-foreground">Your Rank</p>
        <p className="text-3xl font-bold text-accent mt-2">#{userRank}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {leaderboard.length - userRank + 1} ahead of you
        </p>
      </div>
      <div className="card">
        <p className="text-sm text-muted-foreground">Your Score</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {currentUser.score}
        </p>
        <p className="text-xs text-success mt-2">
          +{currentUser.totalXP} total XP
        </p>
      </div>
      <div className="card">
        <p className="text-sm text-muted-foreground">Top Score</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {leaderboard[0]?.score || 0}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          by {leaderboard[0]?.name || "N/A"}
        </p>
      </div>
      <div className="card">
        <p className="text-sm text-muted-foreground">Total Players</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {leaderboard.length}
        </p>
        <p className="text-xs text-muted-foreground mt-2">competing now</p>
      </div>
    </div>
  );
}
