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
  Minus,
  RotateCcw,
} from "lucide-react";
import { decomposeTask, type DecomposedTask } from "@/lib/ai-coach";
import { decomposeTaskWithAI } from "@/lib/gemini-service";

interface EditableSubtask {
  title: string;
  estimatedMinutes: number;
  energyCost: number;
  originalMinutes: number; // Store original for reset
}

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
  const [editableSubtasks, setEditableSubtasks] = useState<EditableSubtask[]>(
    []
  );
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<number>>(
    new Set()
  );
  const [useAI, setUseAI] = useState(true);
  const [context, setContext] = useState("");

  const handleDecompose = async () => {
    setIsGenerating(true);

    try {
      let result: DecomposedTask;

      if (useAI) {
        // Try AI-powered decomposition with optional context
        result = await decomposeTaskWithAI(taskTitle, context || undefined);
      } else {
        // Use local pattern matching
        result = decomposeTask(taskTitle);
      }

      // Convert to editable subtasks
      const editable = result.subtasks.map((st) => ({
        ...st,
        originalMinutes: st.estimatedMinutes,
      }));

      setEditableSubtasks(editable);
      // Select all by default
      setSelectedSubtasks(new Set(result.subtasks.map((_, i) => i)));
    } catch (error) {
      console.error("Decomposition error:", error);
      // Fallback to local decomposition
      const result = decomposeTask(taskTitle);
      const editable = result.subtasks.map((st) => ({
        ...st,
        originalMinutes: st.estimatedMinutes,
      }));
      setEditableSubtasks(editable);
      setSelectedSubtasks(new Set(result.subtasks.map((_, i) => i)));
    } finally {
      setIsGenerating(false);
    }
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

  const updateSubtaskTime = (index: number, delta: number) => {
    setEditableSubtasks((prev) =>
      prev.map((st, i) => {
        if (i === index) {
          const newTime = Math.max(1, st.estimatedMinutes + delta);
          return { ...st, estimatedMinutes: newTime };
        }
        return st;
      })
    );
  };

  const setSubtaskTime = (index: number, minutes: number) => {
    setEditableSubtasks((prev) =>
      prev.map((st, i) => {
        if (i === index) {
          return { ...st, estimatedMinutes: Math.max(1, minutes) };
        }
        return st;
      })
    );
  };

  const resetSubtaskTime = (index: number) => {
    setEditableSubtasks((prev) =>
      prev.map((st, i) => {
        if (i === index) {
          return { ...st, estimatedMinutes: st.originalMinutes };
        }
        return st;
      })
    );
  };

  const handleApply = () => {
    if (editableSubtasks.length === 0) return;

    const selectedSubtaskData = editableSubtasks
      .filter((_, i) => selectedSubtasks.has(i))
      .map((st) => ({
        title: st.title,
        estimatedMinutes: st.estimatedMinutes,
      }));

    onApplySubtasks(selectedSubtaskData);
    onClose();
  };

  // Calculate totals from editable subtasks
  const totalMinutes = editableSubtasks
    .filter((_, i) => selectedSubtasks.has(i))
    .reduce((sum, st) => sum + st.estimatedMinutes, 0);

  const totalEnergy = editableSubtasks
    .filter((_, i) => selectedSubtasks.has(i))
    .reduce((sum, st) => sum + st.energyCost, 0);

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
        </div>{" "}
        {/* Task Title */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Breaking down:</p>
          <p className="text-lg font-medium text-foreground">{taskTitle}</p>
        </div>
        {/* Content */}
        <div className="p-6">
          {" "}
          {editableSubtasks.length === 0 && !isGenerating && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Wand2 size={32} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ready to decompose?
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                The Task Goblin will break this task into small, actionable
                steps tailored to your specific needs.
              </p>

              {/* Context input for AI */}
              {useAI && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Add context (e.g., 'for a college essay', 'beginner level')..."
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              )}

              {/* AI Toggle */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  onClick={() => setUseAI(true)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    useAI
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Sparkles size={14} className="inline mr-1.5" />
                  AI-Powered
                </button>
                <button
                  onClick={() => setUseAI(false)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    !useAI
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Templates
                </button>
              </div>

              <button
                onClick={handleDecompose}
                className="px-6 py-3 rounded-xl font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Wand2 size={18} />
                Break It Down
              </button>
            </div>
          )}{" "}
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
          {editableSubtasks.length > 0 && !isGenerating && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-sky-400" />
                    <span className="text-muted-foreground">
                      Total:{" "}
                      <span className="text-foreground font-medium">
                        {totalMinutes} min
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap size={14} className="text-amber-400" />
                    <span className="text-muted-foreground">
                      Energy:{" "}
                      <span className="text-foreground font-medium">
                        {totalEnergy} pts
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  {selectedSubtasks.size} selected
                </span>
              </div>{" "}
              {/* Subtasks with editable time */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {editableSubtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedSubtasks.has(index)
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleSubtask(index)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          selectedSubtasks.has(index)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {selectedSubtasks.has(index) && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
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
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getEnergyCostColor(
                              subtask.energyCost
                            )}`}
                          >
                            {getEnergyCostLabel(subtask.energyCost)}
                          </span>

                          {/* Editable time controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSubtaskTime(index, -5);
                              }}
                              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                              <input
                                type="number"
                                value={subtask.estimatedMinutes}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSubtaskTime(
                                    index,
                                    parseInt(e.target.value) || 1
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 bg-transparent text-xs text-foreground text-center focus:outline-none"
                                min={1}
                              />
                              <span className="text-xs text-muted-foreground">
                                min
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSubtaskTime(index, 5);
                              }}
                              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                            {subtask.estimatedMinutes !==
                              subtask.originalMinutes && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  resetSubtaskTime(index);
                                }}
                                className="w-6 h-6 rounded-md bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition-colors"
                                title="Reset to original"
                              >
                                <RotateCcw size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setEditableSubtasks([]);
                    setSelectedSubtasks(new Set());
                  }}
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
