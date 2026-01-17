"use client";

import { useAppState } from "@/context/app-context";
import { Flame, Trophy } from "lucide-react";

export default function StreakDisplay() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="font-semibold text-foreground">Streak Status</h2>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl border border-amber-500/20">
          <p className="text-6xl font-bold text-amber-400">
            {user.currentStreak}
          </p>
          <p className="text-sm text-muted-foreground mt-2">🔥 days in a row</p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold text-foreground">
                {user.longestStreak} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
