"use client";

import type { Task } from "@/context/app-context";
import TaskCard from "./task-card";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedActiveTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Active Tasks
          </h2>
          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
            {sortedActiveTasks.length}
          </span>
        </div>
        <div className="space-y-3">
          {sortedActiveTasks.length > 0 ? (
            sortedActiveTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="card text-center py-12">
              <p className="text-muted-foreground">
                No active tasks. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-foreground">Completed</h2>
            <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
