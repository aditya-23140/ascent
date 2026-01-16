"use client";

import { useAppState } from "@/context/app-context";

export default function SessionHistory() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const recentSessions = user.pomodoroSessions.slice(-5).reverse();

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Session History
      </h2>
      <div className="space-y-3">
        {recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <div key={session.id} className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {session.duration} min session
                </span>
                <span className="text-xs bg-success text-primary-foreground px-2 py-1 rounded">
                  +{session.focusScore * 10} XP
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Focus: {session.focusScore}% •{" "}
                {new Date(session.startTime).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No sessions yet
          </p>
        )}
      </div>
    </div>
  );
}
