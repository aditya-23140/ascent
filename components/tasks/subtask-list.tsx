"use client";

import type { SubTask } from "@/context/app-context";
import { useAppState } from "@/context/app-context";

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
}

export default function SubTaskList({ taskId, subTasks }: SubTaskListProps) {
  const { completeSubTask } = useAppState();

  return (
    <div className="space-y-2">
      {subTasks.map((subTask) => (
        <div
          key={subTask.id}
          className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80"
        >
          <input
            type="checkbox"
            checked={subTask.completed}
            onChange={() => completeSubTask(taskId, subTask.id)}
            className="w-5 h-5 rounded cursor-pointer"
          />
          <span
            className={`text-sm flex-1 ${
              subTask.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {subTask.title}
          </span>
          {subTask.completed && (
            <span className="text-xs text-success">+50 XP</span>
          )}
        </div>
      ))}
    </div>
  );
}
