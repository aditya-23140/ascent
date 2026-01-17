"use client";

import type { User } from "@/context/app-context";
import { Trophy, Medal, Award, Flame, Zap, Target, Clock } from "lucide-react";

interface LeaderboardTableProps {
  leaderboard: User[];
  currentUserId: string;
}

export default function LeaderboardTable({
  leaderboard,
  currentUserId,
}: LeaderboardTableProps) {
  const getRankIcon = (idx: number) => {
    if (idx === 0) return <Trophy className="w-5 h-5 text-amber-400" />;
    if (idx === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (idx === 2) return <Award className="w-5 h-5 text-orange-400" />;
    return (
      <span className="text-muted-foreground font-medium">#{idx + 1}</span>
    );
  };

  const getRankBg = (idx: number) => {
    if (idx === 0) return "bg-amber-500/10 border-amber-500/20";
    if (idx === 1) return "bg-slate-500/10 border-slate-500/20";
    if (idx === 2) return "bg-orange-500/10 border-orange-500/20";
    return "";
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.02] border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-1">Rank</div>
        <div className="col-span-3">Player</div>
        <div className="col-span-2">Level</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-1">Tasks</div>
        <div className="col-span-2">Sessions</div>
        <div className="col-span-1">Streak</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {leaderboard.map((user, idx) => {
          const isCurrentUser = user.id === currentUserId;
          const rankBg = getRankBg(idx);

          return (
            <div
              key={user.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/[0.02] ${
                isCurrentUser
                  ? "bg-emerald-500/5 border-l-2 border-l-emerald-500"
                  : ""
              } ${rankBg}`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center justify-center">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    idx < 3 ? getRankBg(idx) : "bg-white/5"
                  }`}
                >
                  {getRankIcon(idx)}
                </div>
              </div>

              {/* Player */}
              <div className="col-span-3">
                <span
                  className={`font-semibold ${
                    isCurrentUser ? "text-emerald-400" : "text-foreground"
                  }`}
                >
                  {user.name}
                </span>
                {isCurrentUser && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    You
                  </span>
                )}
              </div>

              {/* Level */}
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium">
                  <Target className="w-3.5 h-3.5" />
                  Lvl {user.level}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                  <Zap className="w-4 h-4" />
                  {user.score.toLocaleString()}
                </span>
              </div>

              {/* Tasks */}
              <div className="col-span-1 text-foreground font-medium">
                {user.tasksCompleted}
              </div>

              {/* Sessions */}
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {user.sessionsCompleted}
                </span>
              </div>

              {/* Streak */}
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1 text-orange-400">
                  <Flame className="w-4 h-4" />
                  {user.currentStreak}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
