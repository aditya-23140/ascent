"use client";

import { useAppState } from "@/context/app-context";

export default function RecentActivity() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const recentTasks = user.tasks.slice(0, 5);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Recent Tasks
      </h2>
      <div className="space-y-3">
        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
            >
              <div className="text-xl mt-1">{task.completed ? "✅" : "⭕"}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {task.subTasks.filter((st) => st.completed).length}/
                  {task.subTasks.length} subtasks
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tasks yet. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
