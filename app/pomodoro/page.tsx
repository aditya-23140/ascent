"use client";

import PomodoroTimer from "@/components/pomodoro/pomodoro-timer";
import SessionHistory from "@/components/pomodoro/session-history";
import { Clock } from "lucide-react";

export default function PomodoroPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Clock className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Focus, work, and earn rewards</p>
        </div>
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
