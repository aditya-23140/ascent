"use client";

import { useAppState } from "@/context/app-context";

export default function StreakDisplay() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Streak Status
      </h2>
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Current Streak
            </span>
            <span className="text-3xl font-bold text-accent">
              {user.currentStreak}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">🔥 days in a row</p>
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Longest Streak
            </span>
            <span className="text-2xl font-bold text-foreground">
              {user.longestStreak}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">your personal best</p>
        </div>
      </div>
    </div>
  );
}
