"use client";

import { useAppState } from "@/context/app-context";
import { ListTodo, CheckCircle2, Circle } from "lucide-react";

export default function RecentActivity() {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  if (!user) return null;

  const recentTasks = user.tasks.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <ListTodo className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="font-semibold text-foreground">Recent Tasks</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-border transition-all"
              >
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium line-clamp-1 ${
                      task.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${
                            task.subTasks.length > 0
                              ? (task.subTasks.filter((st) => st.completed)
                                  .length /
                                  task.subTasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {task.subTasks.filter((st) => st.completed).length}/
                      {task.subTasks.length}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                <ListTodo className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                No tasks yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
