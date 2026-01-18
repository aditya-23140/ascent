"use client";

import type React from "react";

import type { Task } from "@/context/app-context";
import { useAppState } from "@/context/app-context";
import { useState } from "react";
import SubTaskList from "./subtask-list";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Flag,
  Wand2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import TaskDecomposer from "@/components/ai/task-decomposer";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask, addSubTask, updateTask } = useAppState();
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subTaskMinutes, setSubTaskMinutes] = useState("30");
  const [expanded, setExpanded] = useState(false);
  const [showDecomposer, setShowDecomposer] = useState(false);

  const handleCompleteTask = () => {
    completeTask(task.id);
  };

  const handlePriorityChange = (newPriority: "low" | "medium" | "high") => {
    updateTask(task.id, { priority: newPriority });
  };
  const handleApplyDecomposedSubtasks = (
    subtasks: { title: string; estimatedMinutes: number }[]
  ) => {
    // Get current subtasks and add all new ones at once to avoid stale state issues
    const currentSubtasks = task.subTasks || [];
    const newSubtasks = subtasks.map((st) => ({
      id: `st_${crypto.randomUUID()}`,
      title: st.title,
      completed: false,
      estimatedMinutes: st.estimatedMinutes,
    }));

    // Update task with all subtasks at once
    updateTask(task.id, {
      subTasks: [...currentSubtasks, ...newSubtasks],
    });
    setExpanded(true);
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTaskTitle.trim()) return;

    addSubTask(task.id, {
      id: `st_${crypto.randomUUID()}`,
      title: subTaskTitle,
      completed: false,
      estimatedMinutes: subTaskMinutes === "" ? 0 : parseInt(subTaskMinutes),
    });
    setSubTaskTitle("");
    setSubTaskMinutes("30");
    setShowSubTaskForm(false);
  };

  const completedSubTasks = task.subTasks.filter((st) => st.completed).length;
  const progress =
    task.subTasks.length > 0
      ? (completedSubTasks / task.subTasks.length) * 100
      : 0;

  const formatTime = (minutes: number) => {
    if (minutes === 0) return "No time set";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Calculate total time from subtasks
  const totalSubtaskMinutes = task.subTasks.reduce(
    (total, st) => total + (st.estimatedMinutes || 0),
    0
  );
  const displayMinutes =
    totalSubtaskMinutes > 0 ? totalSubtaskMinutes : task.estimatedMinutes;

  // Pleasant Supabase-inspired priority colors
  const priorityConfig = {
    high: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      icon: "text-rose-400",
      gradient: "from-rose-500/20 to-rose-500/5",
    },
    medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      icon: "text-amber-400",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
    low: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
  };

  const priority = priorityConfig[task.priority];

  // Progress bar color based on completion
  const getProgressColor = () => {
    if (progress === 100) return "bg-emerald-500";
    if (progress >= 60) return "bg-emerald-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-sky-500";
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
        task.completed
          ? "bg-card/50 border-border/50 opacity-70"
          : `bg-gradient-to-r ${priority.gradient} border-${
              task.priority === "high"
                ? "rose"
                : task.priority === "medium"
                ? "amber"
                : "emerald"
            }-500/20`
      }`}
    >
      {/* Priority indicator line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          task.completed
            ? "bg-muted-foreground/30"
            : priority.text.replace("text-", "bg-")
        }`}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-0.5 p-1 rounded-md hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3
                className={`font-semibold text-base ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>
              {task.completed ? (
                <div
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${priority.bg} ${priority.border} border`}
                >
                  <Flag size={12} className={priority.icon} />
                  <span className={`text-xs font-medium ${priority.text}`}>
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${priority.bg} ${priority.border} border hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      <Flag size={12} className={priority.icon} />
                      <span className={`text-xs font-medium ${priority.text}`}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                      <ChevronDown size={12} className={priority.text} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-36 bg-card border border-border rounded-xl shadow-xl p-1"
                    align="start"
                  >
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("high")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        task.priority === "high"
                          ? "bg-rose-500/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Flag size={14} className="text-rose-400" />
                      <span className="text-sm text-foreground">High</span>
                      {task.priority === "high" && (
                        <CheckCircle2
                          size={14}
                          className="text-rose-400 ml-auto"
                        />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("medium")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        task.priority === "medium"
                          ? "bg-amber-500/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Flag size={14} className="text-amber-400" />
                      <span className="text-sm text-foreground">Medium</span>
                      {task.priority === "medium" && (
                        <CheckCircle2
                          size={14}
                          className="text-amber-400 ml-auto"
                        />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("low")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        task.priority === "low"
                          ? "bg-emerald-500/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Flag size={14} className="text-emerald-400" />
                      <span className="text-sm text-foreground">Low</span>
                      {task.priority === "low" && (
                        <CheckCircle2
                          size={14}
                          className="text-emerald-400 ml-auto"
                        />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-2">
              {displayMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={14} className="text-sky-400" />
                  <span>{formatTime(displayMinutes)}</span>
                </div>
              )}
              {task.subTasks.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    <span
                      className={
                        progress === 100
                          ? "text-emerald-400"
                          : "text-foreground"
                      }
                    >
                      {completedSubTasks}
                    </span>
                    /{task.subTasks.length}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {task.description && !task.completed && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>{" "}
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!task.completed && (
              <>
                <button
                  onClick={() => setShowDecomposer(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  title="AI Task Breakdown"
                >
                  <Wand2 size={18} />
                </button>
                <button
                  onClick={handleCompleteTask}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors text-sm"
                >
                  <CheckCircle2 size={16} />
                  Done
                </button>
              </>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Section */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/5 ml-8 space-y-4">
            {task.subTasks.length > 0 && (
              <SubTaskList taskId={task.id} subTasks={task.subTasks} />
            )}

            {!task.completed && (
              <>
                {!showSubTaskForm ? (
                  <button
                    onClick={() => setShowSubTaskForm(true)}
                    className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <Plus size={16} />
                    Add Sub-task
                  </button>
                ) : (
                  <form
                    onSubmit={handleAddSubTask}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <input
                      type="text"
                      value={subTaskTitle}
                      onChange={(e) => setSubTaskTitle(e.target.value)}
                      placeholder="Enter sub-task title"
                      className="flex-1 bg-white/5 text-foreground px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                      autoFocus
                    />
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-2 border border-white/10">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={subTaskMinutes}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d+$/.test(val)) {
                            setSubTaskMinutes(val);
                          }
                        }}
                        className="w-12 bg-transparent text-foreground text-sm text-center focus:outline-none"
                        placeholder="30"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm"
                    >
                      Add
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => setShowSubTaskForm(false)}
                      className="px-4 py-2 rounded-lg font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* AI Task Decomposer Modal */}
      {showDecomposer && (
        <TaskDecomposer
          taskTitle={task.title}
          onApplySubtasks={handleApplyDecomposedSubtasks}
          onClose={() => setShowDecomposer(false)}
        />
      )}
    </div>
  );
}
