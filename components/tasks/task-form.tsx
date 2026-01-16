"use client";

import type React from "react";
import { useAppState } from "@/context/app-context";
import { useState } from "react";
import type { Task } from "@/context/app-context";
import { X } from "lucide-react";

interface TaskFormProps {
  onClose: () => void;
}

export default function TaskForm({ onClose }: TaskFormProps) {
  const { addTask } = useAppState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState("60");

  const handleEstimatedMinutesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      setEstimatedMinutes(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const minutes =
      estimatedMinutes === ""
        ? 0
        : Math.max(1, Number.parseInt(estimatedMinutes));

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      description,
      completed: false,
      priority,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      pomodoroCount: 0,
      estimatedMinutes: minutes,
      sessionsCompleted: 0,
      subTasks: [],
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEstimatedMinutes("60");
    onClose();
  };

  return (
    <div className="card border-purple-500/30 bg-gradient-to-br from-black via-black/90 to-black/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Create New Task</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent h-20 resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Est. Time (mins)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={estimatedMinutes}
              onChange={handleEstimatedMinutesChange}
              placeholder="60"
              className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-orange-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
