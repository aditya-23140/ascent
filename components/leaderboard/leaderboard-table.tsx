"use client";

import type { User } from "@/context/app-context";

interface LeaderboardTableProps {
  leaderboard: User[];
  currentUserId: string;
}

export default function LeaderboardTable({
  leaderboard,
  currentUserId,
}: LeaderboardTableProps) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Player
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Level
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Score
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Tasks
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Sessions
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Streak
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leaderboard.map((user, idx) => (
            <tr
              key={user.id}
              className={`hover:bg-muted transition-colors ${
                user.id === currentUserId ? "bg-primary/10" : ""
              }`}
            >
              <td className="px-6 py-4">
                <span
                  className={`text-lg font-bold ${
                    idx === 0
                      ? "text-accent"
                      : idx === 1
                      ? "text-gray-400"
                      : idx === 2
                      ? "text-orange-600"
                      : "text-foreground"
                  }`}
                >
                  {idx === 0
                    ? "🥇"
                    : idx === 1
                    ? "🥈"
                    : idx === 2
                    ? "🥉"
                    : `#${idx + 1}`}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`font-semibold ${
                    user.id === currentUserId
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="text-xs ml-2 text-primary">(You)</span>
                  )}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-foreground font-medium">
                  Lvl {user.level}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-accent font-bold">{user.score}</span>
              </td>
              <td className="px-6 py-4 text-foreground">
                {user.tasksCompleted}
              </td>
              <td className="px-6 py-4 text-foreground">
                {user.sessionsCompleted}
              </td>
              <td className="px-6 py-4">
                <span className="text-foreground">🔥 {user.currentStreak}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
