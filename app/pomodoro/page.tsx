"use client";

import PomodoroTimer from "@/components/pomodoro/pomodoro-timer";
import SessionHistory from "@/components/pomodoro/session-history";

export default function PomodoroPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-1">
          Focus, work, and earn rewards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>
        <SessionHistory />
      </div>
    </div>
  );
}
