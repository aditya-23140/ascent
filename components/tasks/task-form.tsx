"use client";

import type React from "react";
import { useAppState } from "@/context/app-context";
import { useState, useEffect } from "react";
import type { Task, SubTask } from "@/context/app-context";
import { X, Plus, Clock, Trash2, Flag } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubTaskInput {
  id: string;
  title: string;
  estimatedMinutes: string;
}

export default function TaskForm({ isOpen, onClose }: TaskFormProps) {
  const { addTask } = useAppState();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [subTasks, setSubTasks] = useState<SubTaskInput[]>(() => [
    { id: `temp_${crypto.randomUUID()}`, title: "", estimatedMinutes: "30" },
  ]);

  // Calculate total estimated time
  const totalMinutes = subTasks.reduce((total, st) => {
    const mins = st.estimatedMinutes === "" ? 0 : parseInt(st.estimatedMinutes);
    return total + (isNaN(mins) ? 0 : mins);
  }, 0);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  const handleAddSubTask = () => {
    setSubTasks([
      ...subTasks,
      { id: `temp_${crypto.randomUUID()}`, title: "", estimatedMinutes: "30" },
    ]);
  };

  const handleRemoveSubTask = (id: string) => {
    if (subTasks.length > 1) {
      setSubTasks(subTasks.filter((st) => st.id !== id));
    }
  };

  const handleSubTaskChange = (
    id: string,
    field: "title" | "estimatedMinutes",
    value: string
  ) => {
    setSubTasks(
      subTasks.map((st) => (st.id === id ? { ...st, [field]: value } : st))
    );
  };

  const handleEstimatedMinutesChange = (id: string, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      handleSubTaskChange(id, "estimatedMinutes", value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter out empty subtasks and convert to proper format
    const validSubTasks: SubTask[] = subTasks
      .filter((st) => st.title.trim())
      .map((st) => ({
        id: `st_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: st.title.trim(),
        completed: false,
        estimatedMinutes:
          st.estimatedMinutes === ""
            ? 0
            : Math.max(1, parseInt(st.estimatedMinutes)),
      }));
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newTask: Task = {
      id: `task_${crypto.randomUUID()}`,
      title,
      description: "",
      completed: false,
      priority: priority,
      dueDate: tomorrow.toISOString(),
      pomodoroCount: 0,
      estimatedMinutes: totalMinutes,
      sessionsCompleted: 0,
      subTasks: validSubTasks,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setTitle("");
    setPriority("medium");
    setSubTasks([
      { id: `temp_${crypto.randomUUID()}`, title: "", estimatedMinutes: "30" },
    ]);
    onClose();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-violet-500/10 to-emerald-500/10">
          <h2 className="text-xl font-bold text-foreground">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Name
            </label>{" "}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="w-full bg-white/5 text-foreground px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPriority("high")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  priority === "high"
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
                }`}
              >
                <Flag size={16} />
                <span className="text-sm font-medium">High</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority("medium")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  priority === "medium"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400"
                }`}
              >
                <Flag size={16} />
                <span className="text-sm font-medium">Medium</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority("low")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  priority === "low"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                }`}
              >
                <Flag size={16} />
                <span className="text-sm font-medium">Low</span>
              </button>
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Subtasks
              </label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} className="text-emerald-400" />
                <span>
                  Total:{" "}
                  <span className="font-semibold text-emerald-400">
                    {formatTime(totalMinutes)}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {subTasks.map((subTask, index) => (
                <div
                  key={subTask.id}
                  className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 group hover:border-white/10 transition-colors"
                >
                  <span className="text-xs text-muted-foreground font-medium w-5">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={subTask.title}
                    onChange={(e) =>
                      handleSubTaskChange(subTask.id, "title", e.target.value)
                    }
                    placeholder="Subtask description"
                    className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1 border border-white/10">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={subTask.estimatedMinutes}
                      onChange={(e) =>
                        handleEstimatedMinutesChange(subTask.id, e.target.value)
                      }
                      className="w-12 bg-transparent text-foreground text-sm text-center focus:outline-none"
                      placeholder="30"
                    />
                    <span className="text-xs text-muted-foreground">min</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubTask(subTask.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    disabled={subTasks.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSubTask}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 text-muted-foreground hover:text-violet-400 transition-all"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add Subtask</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
