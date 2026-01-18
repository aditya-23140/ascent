"use client";

import { useState } from "react";
import {
  Wand2,
  Sparkles,
  Clock,
  Zap,
  Plus,
  Check,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { decomposeTask, type DecomposedTask } from "@/lib/ai-coach";

interface TaskDecomposerProps {
  taskTitle: string;
  onApplySubtasks: (
    subtasks: { title: string; estimatedMinutes: number }[]
  ) => void;
  onClose: () => void;
}

export default function TaskDecomposer({
  taskTitle,
  onApplySubtasks,
  onClose,
}: TaskDecomposerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [decomposition, setDecomposition] = useState<DecomposedTask | null>(
    null
  );
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<number>>(
    new Set()
  );

  const handleDecompose = () => {
    setIsGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      const result = decomposeTask(taskTitle);
      setDecomposition(result);
      // Select all by default
      setSelectedSubtasks(new Set(result.subtasks.map((_, i) => i)));
      setIsGenerating(false);
    }, 1500);
  };

  const toggleSubtask = (index: number) => {
    const newSelected = new Set(selectedSubtasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSubtasks(newSelected);
  };

  const handleApply = () => {
    if (!decomposition) return;

    const selectedSubtaskData = decomposition.subtasks
      .filter((_, i) => selectedSubtasks.has(i))
      .map((st) => ({
        title: st.title,
        estimatedMinutes: st.estimatedMinutes,
      }));

    onApplySubtasks(selectedSubtaskData);
    onClose();
  };

  const getEnergyCostColor = (cost: number) => {
    if (cost <= 1) return "text-emerald-400 bg-emerald-500/10";
    if (cost <= 2) return "text-sky-400 bg-sky-500/10";
    if (cost <= 3) return "text-amber-400 bg-amber-500/10";
    if (cost <= 4) return "text-orange-400 bg-orange-500/10";
    return "text-rose-400 bg-rose-500/10";
  };

  const getEnergyCostLabel = (cost: number) => {
    if (cost <= 1) return "Trivial";
    if (cost <= 2) return "Easy";
    if (cost <= 3) return "Moderate";
    if (cost <= 4) return "Challenging";
    return "Hard";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-violet-500/10 via-amber-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Wand2 size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                Task Goblin
                <Sparkles size={14} className="text-amber-400" />
              </h2>
              <p className="text-xs text-muted-foreground">
                Break down overwhelming tasks into tiny, doable steps
              </p>
            </div>
          </div>
        </div>

        {/* Task Title */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Breaking down:</p>
          <p className="text-lg font-medium text-foreground">{taskTitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!decomposition && !isGenerating && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Wand2 size={32} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ready to decompose?
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                The Task Goblin will break this task into small, mechanical
                actions that require minimal decision-making.
              </p>
              <button
                onClick={handleDecompose}
                className="px-6 py-3 rounded-xl font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Wand2 size={18} />
                Break It Down
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2
                size={40}
                className="animate-spin text-violet-400 mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                The goblin is working on it...
              </p>
            </div>
          )}

          {decomposition && !isGenerating && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-sky-400" />
                    <span className="text-muted-foreground">
                      Total:{" "}
                      <span className="text-foreground font-medium">
                        {decomposition.totalEstimatedMinutes} min
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap size={14} className="text-amber-400" />
                    <span className="text-muted-foreground">
                      Energy:{" "}
                      <span className="text-foreground font-medium">
                        {decomposition.totalEnergyCost} pts
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  {selectedSubtasks.size} selected
                </span>
              </div>

              {/* Subtasks */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {decomposition.subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSubtask(index)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSubtasks.has(index)
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          selectedSubtasks.has(index)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-white/20"
                        }`}
                      >
                        {selectedSubtasks.has(index) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <ChevronRight
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                          <p className="text-sm text-foreground">
                            {subtask.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {subtask.estimatedMinutes} min
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getEnergyCostColor(
                              subtask.energyCost
                            )}`}
                          >
                            {getEnergyCostLabel(subtask.energyCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDecompose}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2 size={16} />
                  Regenerate
                </button>
                <button
                  onClick={handleApply}
                  disabled={selectedSubtasks.size === 0}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add {selectedSubtasks.size} Subtasks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
