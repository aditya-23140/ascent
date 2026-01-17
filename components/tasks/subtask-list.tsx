"use client";

import type { SubTask } from "@/context/app-context";
import { useAppState } from "@/context/app-context";
import { Clock, Check, Zap } from "lucide-react";

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
}

export default function SubTaskList({ taskId, subTasks }: SubTaskListProps) {
  const { completeSubTask } = useAppState();

  const formatTime = (minutes: number) => {
    if (!minutes || minutes === 0) return "";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-2">
      {subTasks.map((subTask, index) => (
        <div
          key={subTask.id}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
            subTask.completed
              ? "bg-emerald-500/5 border border-emerald-500/20"
              : "bg-white/[0.02] border border-white/5 hover:border-white/10"
          }`}
        >
          <span className="text-xs text-muted-foreground font-medium w-5">
            {index + 1}.
          </span>
          <button
            onClick={() => completeSubTask(taskId, subTask.id)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              subTask.completed
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-white/20 hover:border-emerald-500/50"
            }`}
          >
            {subTask.completed && <Check size={12} strokeWidth={3} />}
          </button>
          <span
            className={`text-sm flex-1 ${
              subTask.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {subTask.title}
          </span>
          {subTask.estimatedMinutes > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 bg-white/5 rounded-lg">
              <Clock size={12} className="text-sky-400" />
              <span>{formatTime(subTask.estimatedMinutes)}</span>
            </div>
          )}
          {subTask.completed && (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              <Zap size={12} />
              <span>+50 XP</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
