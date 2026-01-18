"use client";

import { useState, useMemo } from "react";
import {
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryWarning,
  Calendar,
  Clock,
  Zap,
  Sun,
  Sunset,
  Moon,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  RefreshCcw,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  type EnergyProfile,
  type SchedulableTask,
  type ScheduleResult,
  DEFAULT_ENERGY_PROFILE,
  scheduleTasksGreedy,
  taskToSchedulable,
  getSpoonVisualization,
  getEnergyRecoverySuggestions,
} from "@/lib/energy-scheduler";
import { useAppState } from "@/context/app-context";
import { getSchedulingSuggestions } from "@/lib/gemini-service";

interface EnergySchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnergyScheduler({
  isOpen,
  onClose,
}: EnergySchedulerProps) {
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  const [energyProfile, setEnergyProfile] = useState<EnergyProfile>({
    ...DEFAULT_ENERGY_PROFILE,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Convert user tasks to schedulable format
  const schedulableTasks: SchedulableTask[] = useMemo(() => {
    return (
      user?.tasks
        .filter((t) => !t.completed)
        .map((t) => taskToSchedulable(t)) || []
    );
  }, [user?.tasks]);

  // Generate schedule using useMemo instead of useEffect
  const scheduleResult: ScheduleResult | null = useMemo(() => {
    if (schedulableTasks.length > 0) {
      return scheduleTasksGreedy(schedulableTasks, energyProfile, new Date());
    }
    return null;
  }, [schedulableTasks, energyProfile]);

  // Get AI scheduling suggestions
  const handleGetAISuggestion = async () => {
    if (schedulableTasks.length === 0) return;

    setIsLoadingAI(true);
    try {
      const tasks = schedulableTasks.map((t) => ({
        title: t.title,
        priority: t.priority,
        energyCost: t.energyCost,
      }));

      const peakHours = energyProfile.peakHours.map(
        (p) => `${p.start}:00-${p.end}:00`
      );

      const suggestion = await getSchedulingSuggestions(
        tasks,
        energyProfile.currentEnergy,
        peakHours
      );

      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      setAiSuggestion(
        energyProfile.currentEnergy < 50
          ? "Your energy is low. Focus on just 1-2 easy tasks, then take a break."
          : "You have good energy! Tackle your most important task during your peak hours."
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  const spoonViz = getSpoonVisualization(energyProfile);
  const recoverySuggestions = getEnergyRecoverySuggestions(
    energyProfile.currentEnergy,
    50
  );

  const getBatteryIcon = () => {
    switch (spoonViz.status) {
      case "full":
        return <BatteryFull size={24} className="text-emerald-400" />;
      case "good":
        return <BatteryMedium size={24} className="text-green-400" />;
      case "low":
        return <BatteryLow size={24} className="text-amber-400" />;
      case "critical":
        return <BatteryWarning size={24} className="text-rose-400" />;
      default:
        return <Battery size={24} className="text-gray-400" />;
    }
  };

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12)
      return <Sun size={14} className="text-amber-400" />;
    if (hour >= 12 && hour < 18)
      return <Sunset size={14} className="text-orange-400" />;
    return <Moon size={14} className="text-violet-400" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleEnergyChange = (newEnergy: number) => {
    setEnergyProfile((prev) => ({
      ...prev,
      currentEnergy: Math.max(0, Math.min(100, newEnergy)),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Zap size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Energy-Aware Scheduler
              </h2>
              <p className="text-xs text-muted-foreground">
                Spoon Theory-based task planning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? "bg-white/10 text-foreground"
                  : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Energy Status */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getBatteryIcon()}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Energy Level
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {spoonViz.remaining} / {spoonViz.total} spoons remaining
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-2xl font-bold"
                  style={{ color: spoonViz.color }}
                >
                  {spoonViz.percentRemaining}%
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {spoonViz.status}
                </p>
              </div>
            </div>

            {/* Energy Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={energyProfile.currentEnergy}
                onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${spoonViz.color} ${spoonViz.percentRemaining}%, rgba(255,255,255,0.1) ${spoonViz.percentRemaining}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </div>
          </div>
          {/* Settings Panel */}
          {showSettings && (
            <div className="p-6 border-b border-border bg-white/[0.02]">
              <h3 className="text-sm font-medium text-foreground mb-4">
                Energy Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Peak Hours Start
                  </label>
                  <select
                    value={energyProfile.peakHours[0]?.start || 9}
                    onChange={(e) =>
                      setEnergyProfile((prev) => ({
                        ...prev,
                        peakHours: [
                          {
                            ...prev.peakHours[0],
                            start: parseInt(e.target.value),
                          },
                          ...prev.peakHours.slice(1),
                        ],
                      }))
                    }
                    className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 6).map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Peak Hours End
                  </label>
                  <select
                    value={energyProfile.peakHours[0]?.end || 12}
                    onChange={(e) =>
                      setEnergyProfile((prev) => ({
                        ...prev,
                        peakHours: [
                          {
                            ...prev.peakHours[0],
                            end: parseInt(e.target.value),
                          },
                          ...prev.peakHours.slice(1),
                        ],
                      }))
                    }
                    className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 10).map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={energyProfile.postMealDip}
                      onChange={(e) =>
                        setEnergyProfile((prev) => ({
                          ...prev,
                          postMealDip: e.target.checked,
                          lowEnergyHours: e.target.checked ? [13, 14] : [],
                        }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">
                      I experience post-lunch energy dip
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* Schedule Results */}
          <div className="p-6">
            {schedulableTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">
                  No tasks to schedule. Add some tasks first!
                </p>
              </div>
            ) : (
              <>
                {/* Warnings */}
                {scheduleResult?.warnings &&
                  scheduleResult.warnings.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">
                          Warnings
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {scheduleResult.warnings.map((warning, i) => (
                          <li
                            key={i}
                            className="text-xs text-amber-300/80 flex items-start gap-2"
                          >
                            <ChevronRight
                              size={12}
                              className="mt-0.5 shrink-0"
                            />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Suggestions */}
                {scheduleResult?.suggestions &&
                  scheduleResult.suggestions.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={14} className="text-sky-400" />
                        <span className="text-sm font-medium text-sky-400">
                          Suggestions
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {scheduleResult.suggestions.map((suggestion, i) => (
                          <li
                            key={i}
                            className="text-xs text-sky-300/80 flex items-start gap-2"
                          >
                            <ChevronRight
                              size={12}
                              className="mt-0.5 shrink-0"
                            />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Scheduled Tasks */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-400" />
                    Scheduled ({scheduleResult?.scheduledTasks.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {scheduleResult?.scheduledTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getTimeIcon(task.scheduledStart.getHours())}
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Clock size={10} />
                                {formatTime(task.scheduledStart)} -{" "}
                                {formatTime(task.scheduledEnd)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === "high"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : task.priority === "medium"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                              <Zap size={10} className="text-amber-400" />
                              {task.energyCost} energy
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unscheduled Tasks */}
                {scheduleResult?.unscheduledTasks &&
                  scheduleResult.unscheduledTasks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-400" />
                        Couldn&apos;t Schedule (
                        {scheduleResult.unscheduledTasks.length})
                      </h3>
                      <div className="space-y-2">
                        {scheduleResult.unscheduledTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/10 opacity-60"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-foreground">
                                {task.title}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                Needs {task.energyCost} energy
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>{" "}
          {/* AI Scheduling Suggestions */}
          {schedulableTasks.length > 0 && (
            <div className="p-6 border-t border-border bg-violet-500/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-violet-400 flex items-center gap-2">
                  <Sparkles size={14} />
                  AI Coach Suggestions
                </h3>
                <button
                  onClick={handleGetAISuggestion}
                  disabled={isLoadingAI}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAI ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Get AI Advice
                    </>
                  )}
                </button>
              </div>

              {aiSuggestion ? (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-violet-500/20">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {aiSuggestion}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Click &quot;Get AI Advice&quot; for personalized scheduling
                  suggestions based on your energy level and tasks.
                </p>
              )}
            </div>
          )}
          {/* Recovery Suggestions */}
          {spoonViz.percentRemaining < 50 && (
            <div className="p-6 border-t border-border bg-emerald-500/5">
              <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <RefreshCcw size={14} />
                Energy Recovery Tips
              </h3>
              <ul className="space-y-2">
                {recoverySuggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <ChevronRight
                      size={12}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
