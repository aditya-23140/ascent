"use client";

import { useAppState } from "@/context/app-context";
import { History, Clock, Zap } from "lucide-react";

export default function SessionHistory() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const recentSessions = user.pomodoroSessions.slice(-5).reverse();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <History className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="font-semibold text-foreground">Session History</h2>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-sky-400" />
                    <span className="text-sm font-medium text-foreground">
                      {session.duration} min session
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
                    <Zap size={12} />
                    <span className="text-xs font-medium">
                      +{session.focusScore * 10} XP
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.startTime).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="p-4 rounded-full bg-white/5 w-fit mx-auto mb-3">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No sessions yet. Start focusing!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
