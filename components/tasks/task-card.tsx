"use client";

import type React from "react";

import type { Task } from "@/context/app-context";
import { useAppState } from "@/context/app-context";
import { useState } from "react";
import SubTaskList from "./subtask-list";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask, addSubTask } = useAppState();
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleCompleteTask = () => {
    completeTask(task.id);
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTaskTitle.trim()) return;

    addSubTask(task.id, {
      id: `st_${Date.now()}`,
      title: subTaskTitle,
      completed: false,
    });
    setSubTaskTitle("");
    setShowSubTaskForm(false);
  };

  const completedSubTasks = task.subTasks.filter((st) => st.completed).length;
  const progress =
    task.subTasks.length > 0
      ? (completedSubTasks / task.subTasks.length) * 100
      : 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xl hover:opacity-70"
            >
              {expanded ? "▼" : "▶"}
            </button>
            <h3
              className={`font-semibold ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.priority === "high"
                  ? "bg-destructive text-primary-foreground"
                  : task.priority === "medium"
                  ? "bg-warning text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground ml-7">
              {task.description}
            </p>
          )}

          {task.subTasks.length > 0 && (
            <div className="ml-7 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
                  <div
                    className="bg-success h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedSubTasks}/{task.subTasks.length}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!task.completed && (
            <button
              onClick={handleCompleteTask}
              className="text-sm px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Mark Done
            </button>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            className="text-sm px-4 py-2 rounded-lg font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 ml-7 space-y-4 border-t border-border pt-4">
          {task.subTasks.length > 0 && (
            <SubTaskList taskId={task.id} subTasks={task.subTasks} />
          )}

          {!showSubTaskForm ? (
            <button
              onClick={() => setShowSubTaskForm(true)}
              className="text-sm text-primary hover:text-primary/80"
            >
              + Add Sub-task
            </button>
          ) : (
            <form onSubmit={handleAddSubTask} className="flex gap-2">
              <input
                type="text"
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                placeholder="Enter sub-task title"
                className="flex-1 bg-muted text-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="text-sm px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowSubTaskForm(false)}
                className="text-sm px-4 py-2 rounded-lg font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
