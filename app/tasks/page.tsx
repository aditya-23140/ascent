"use client";

import { useAppState } from "@/context/app-context";
import TaskList from "@/components/tasks/task-list";
import TaskForm from "@/components/tasks/task-form";
import { useState } from "react";

export default function TasksPage() {
  const { getCurrentUser } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and sub-tasks
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
      <TaskList tasks={user.tasks} />
    </div>
  );
}
