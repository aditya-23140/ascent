"use client";

import type { Task } from "@/context/app-context";
import TaskCard from "./task-card";
import { CheckCircle2, ListTodo, Clock } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedActiveTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const completedTasks = tasks.filter((t) => t.completed);

  // Calculate total time for active tasks
  const totalActiveMinutes = sortedActiveTasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0
  );

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-8">
      {/* Active Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <ListTodo className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Active Tasks</h2>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm font-semibold">
              {sortedActiveTasks.length}
            </span>
          </div>
          {totalActiveMinutes > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
              <Clock size={14} className="text-emerald-400" />
              <span className="text-sm font-medium">
                {formatTime(totalActiveMinutes)} total
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {sortedActiveTasks.length > 0 ? (
            sortedActiveTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="bg-card border-2 border-dashed border-border rounded-2xl text-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-violet-500/10">
                  <ListTodo className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <p className="text-foreground font-medium">No active tasks</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create a new task to get started!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Completed</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
              {completedTasks.length}
            </span>
          </div>
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
