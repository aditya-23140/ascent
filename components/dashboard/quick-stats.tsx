"use client";

import { useAppState } from "@/context/app-context";

export default function QuickStats() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const stats = [
    { label: "Total XP", value: user.totalXP, icon: "⭐" },
    { label: "Tasks Done", value: user.tasksCompleted, icon: "✓" },
    { label: "Sessions", value: user.sessionsCompleted, icon: "⏲️" },
    { label: "Rank", value: `#${user.rank}`, icon: "🏆" },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-foreground mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-muted rounded-lg p-4">
            <p className="text-2xl">{stat.icon}</p>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
