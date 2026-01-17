"use client";

import { useAppState } from "@/context/app-context";
import TaskList from "@/components/tasks/task-list";
import TaskForm from "@/components/tasks/task-form";
import { useState } from "react";
import { CheckSquare, Plus } from "lucide-react";

export default function TasksPage() {
  const { getCurrentUser } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const user = getCurrentUser();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <CheckSquare className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks and sub-tasks
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      <TaskForm isOpen={showForm} onClose={() => setShowForm(false)} />
      <TaskList tasks={user.tasks} />
    </div>
  );
}
