"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAppState } from "@/context/app-context";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Target,
  Zap,
  CheckCircle2,
  ListTodo,
  Coffee,
  SkipForward,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  type = "success",
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "break";
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div
          className={`px-6 py-4 border-b border-border ${
            type === "break"
              ? "bg-gradient-to-r from-sky-500/10 to-violet-500/10"
              : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {type === "break" ? (
              <div className="p-2 rounded-lg bg-sky-500/20">
                <Coffee className="w-5 h-5 text-sky-400" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            )}
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                type === "break"
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Break Modal Component
function BreakModal({
  isOpen,
  timeLeft,
  onSkip,
}: {
  isOpen: boolean;
  timeLeft: number;
  onSkip: () => void;
}) {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-sky-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Break Time!
          </h2>
          <p className="text-muted-foreground mb-6">
            Take a moment to rest and recharge. Your next focus session will
            start after the break.
          </p>
          <div className="text-5xl font-bold font-mono text-sky-400 mb-6">
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={onSkip}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-medium bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10 transition-colors"
          >
            <SkipForward size={18} />
            Skip Break
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PomodoroTimer() {
  const {
    addPomodoroSession,
    getCurrentUser,
    pomodoroSettings,
    updatePomodoroSettings,
    completeSubTask,
  } = useAppState();

  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [workDuration, setWorkDuration] = useState(
    pomodoroSettings.workDuration.toString()
  );
  const [breakDuration, setBreakDuration] = useState(
    pomodoroSettings.breakDuration.toString()
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Subtask tracking
  const [subtaskElapsedTime, setSubtaskElapsedTime] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [pendingSubtaskComplete, setPendingSubtaskComplete] = useState(false);

  // Refs for timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionCompleteRef = useRef<() => void>(() => {});

  const user = getCurrentUser();
  const workDurationNum = Math.max(
    1,
    Number.parseInt(workDuration) || pomodoroSettings.workDuration
  );
  const breakDurationNum = Math.max(
    1,
    Number.parseInt(breakDuration) || pomodoroSettings.breakDuration
  );

  // Get selected task and auto-select current subtask
  const selectedTask = useMemo(
    () => user?.tasks.find((t) => t.id === selectedTaskId),
    [user?.tasks, selectedTaskId]
  );

  const currentSubTask = useMemo(() => {
    if (!selectedTask) return null;
    return selectedTask.subTasks.find((st) => !st.completed) || null;
  }, [selectedTask]);

  const completedSubTasksCount = useMemo(
    () => selectedTask?.subTasks.filter((st) => st.completed).length || 0,
    [selectedTask]
  );

  const totalSubTasksCount = selectedTask?.subTasks.length || 0;

  // Calculate subtask progress
  const subtaskProgress = useMemo(() => {
    if (!currentSubTask || !currentSubTask.estimatedMinutes) return 0;
    const estimatedSeconds = currentSubTask.estimatedMinutes * 60;
    return Math.min((subtaskElapsedTime / estimatedSeconds) * 100, 100);
  }, [currentSubTask, subtaskElapsedTime]);

  // Refs for tracking state in timer callback
  const currentSubTaskRef = useRef(currentSubTask);
  const pendingSubtaskCompleteRef = useRef(pendingSubtaskComplete);
  const showCompletionModalRef = useRef(showCompletionModal);
  const isBreakRef = useRef(isBreak);

  // Keep refs in sync
  useEffect(() => {
    currentSubTaskRef.current = currentSubTask;
  }, [currentSubTask]);

  useEffect(() => {
    pendingSubtaskCompleteRef.current = pendingSubtaskComplete;
  }, [pendingSubtaskComplete]);

  useEffect(() => {
    showCompletionModalRef.current = showCompletionModal;
  }, [showCompletionModal]);

  useEffect(() => {
    isBreakRef.current = isBreak;
  }, [isBreak]);

  // Handle subtask completion confirmation
  const handleSubtaskComplete = useCallback(() => {
    if (selectedTaskId && currentSubTask) {
      completeSubTask(selectedTaskId, currentSubTask.id);
      const earnedXp = 50;
      setXpGained((prev) => prev + earnedXp);
    }
    setSubtaskElapsedTime(0);
    setShowCompletionModal(false);
    setPendingSubtaskComplete(false);
    setIsRunning(true);
  }, [selectedTaskId, currentSubTask, completeSubTask]);

  // Handle subtask completion skip (continue without completing)
  const handleSubtaskSkip = useCallback(() => {
    setShowCompletionModal(false);
    setPendingSubtaskComplete(true);
    setIsRunning(true);
  }, []);

  // Session complete handler
  const handleSessionComplete = useCallback(() => {
    if (!isBreak) {
      const earnedXp = Math.floor(workDurationNum * 40);
      setXpGained((prev) => prev + earnedXp);

      const session = {
        id: `session_${crypto.randomUUID()}`,
        taskId: selectedTaskId || "general",
        duration: workDurationNum,
        breakDuration: breakDurationNum,
        completed: true,
        startTime: new Date(Date.now() - workDurationNum * 60000).toISOString(),
        endTime: new Date().toISOString(),
        focusScore: 100,
      };

      addPomodoroSession(session);
      setSessionsToday((prev) => prev + 1);

      // Start break
      setIsBreak(true);
      setShowBreakModal(true);
      setTimeLeft(breakDurationNum * 60);
    } else {
      // Break ended
      setIsBreak(false);
      setShowBreakModal(false);
      setTimeLeft(workDurationNum * 60);
      setSubtaskElapsedTime(0);
      setPendingSubtaskComplete(false);
    }
  }, [
    isBreak,
    workDurationNum,
    breakDurationNum,
    selectedTaskId,
    addPomodoroSession,
  ]);

  // Keep session complete ref updated
  useEffect(() => {
    sessionCompleteRef.current = handleSessionComplete;
  }, [handleSessionComplete]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setTimeout(() => sessionCompleteRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });

      // Track subtask elapsed time during focus sessions
      if (!isBreakRef.current) {
        setSubtaskElapsedTime((prev) => {
          const newElapsed = prev + 1;

          // Check if estimated time is reached for current subtask
          const subtask = currentSubTaskRef.current;
          if (
            subtask &&
            subtask.estimatedMinutes > 0 &&
            !pendingSubtaskCompleteRef.current &&
            !showCompletionModalRef.current &&
            newElapsed >= subtask.estimatedMinutes * 60
          ) {
            // Pause and show completion modal
            setIsRunning(false);
            setShowCompletionModal(true);
          }

          return newElapsed;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isBreak]);

  // Handle break skip
  const handleSkipBreak = useCallback(() => {
    setIsBreak(false);
    setShowBreakModal(false);
    setTimeLeft(workDurationNum * 60);
    setIsRunning(false);
    setSubtaskElapsedTime(0);
    setPendingSubtaskComplete(false);
  }, [workDurationNum]);

  const resetTimer = useCallback(() => {
    setTimeLeft(workDurationNum * 60);
    setIsRunning(false);
    setIsBreak(false);
    setSubtaskElapsedTime(0);
    setPendingSubtaskComplete(false);
    setShowBreakModal(false);
    setShowCompletionModal(false);
  }, [workDurationNum]);

  const handleSaveSettings = useCallback(
    (newWorkDuration: string, newBreakDuration: string) => {
      const workNum = Math.max(
        1,
        Number.parseInt(newWorkDuration) || pomodoroSettings.workDuration
      );
      const breakNum = Math.max(
        1,
        Number.parseInt(newBreakDuration) || pomodoroSettings.breakDuration
      );
      updatePomodoroSettings(workNum, breakNum);
      setWorkDuration(workNum.toString());
      setBreakDuration(breakNum.toString());
      setTimeLeft(workNum * 60);
    },
    [
      pomodoroSettings.workDuration,
      pomodoroSettings.breakDuration,
      updatePomodoroSettings,
    ]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const progressPercent = isBreak
    ? ((breakDurationNum * 60 - timeLeft) / (breakDurationNum * 60)) * 100
    : ((workDurationNum * 60 - timeLeft) / (workDurationNum * 60)) * 100;

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCompletionModal}
        onConfirm={handleSubtaskComplete}
        onCancel={handleSubtaskSkip}
        title="Subtask Completed?"
        message={`You've worked on "${currentSubTask?.title}" for the estimated time. Did you complete this subtask?`}
        confirmText="Yes, Complete"
        cancelText="Continue Working"
        type="success"
      />

      {/* Break Modal */}
      <BreakModal
        isOpen={showBreakModal && isBreak}
        timeLeft={timeLeft}
        onSkip={handleSkipBreak}
      />

      <div className="space-y-6">
        {/* Main Timer Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Timer Header */}
          <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isBreak ? "bg-sky-500/10" : "bg-emerald-500/10"
                  }`}
                >
                  {isBreak ? (
                    <Coffee className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Target className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    {isBreak ? "Break Time" : "Focus Session"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isBreak
                      ? "Relax and recharge"
                      : "Stay focused on your task"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Settings
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-card border border-border">
                  <DropdownMenuLabel className="text-emerald-400 font-semibold">
                    Timer Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Work Duration (minutes)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={workDuration}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setWorkDuration(value);
                          }
                        }}
                        placeholder="25"
                        className="w-full bg-white/5 text-foreground px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Break Duration (minutes)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={breakDuration}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setBreakDuration(value);
                          }
                        }}
                        placeholder="5"
                        className="w-full bg-white/5 text-foreground px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleSaveSettings(workDuration, breakDuration)
                      }
                      className="w-full px-4 py-2 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all text-sm"
                    >
                      Save Settings
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Timer Display */}
          <div className="p-8">
            <div className="text-center">
              {/* Circular Progress */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-white/5"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={
                      2 * Math.PI * 120 * (1 - progressPercent / 100)
                    }
                    className={`transition-all duration-1000 ${
                      isBreak ? "text-sky-500" : "text-emerald-500"
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold font-mono text-foreground tracking-tight">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-2">
                    {isBreak ? "Break" : "Focus"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={showBreakModal}
                  className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 ${
                    isRunning
                      ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                      : isBreak
                      ? "bg-sky-500 text-white hover:bg-sky-600"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause size={18} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Start
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 rounded-xl font-medium bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10 transition-all flex items-center gap-2"
                >
                  <RotateCcw size={18} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Selection Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <ListTodo className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Working On</h3>
                <p className="text-sm text-muted-foreground">
                  Select a task to focus on
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Custom Task Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-left group">
                  {selectedTask ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedTask.priority === "high"
                            ? "bg-rose-400"
                            : selectedTask.priority === "medium"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-foreground font-medium truncate">
                          {selectedTask.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            selectedTask.subTasks.filter((st) => st.completed)
                              .length
                          }
                          /{selectedTask.subTasks.length} subtasks
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Select a task...
                    </span>
                  )}
                  <ChevronDown
                    size={18}
                    className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border border-border rounded-xl shadow-xl p-2"
                align="start"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
                  Active Tasks
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border my-1" />
                {user?.tasks.filter((task) => !task.completed).length === 0 ? (
                  <div className="px-3 py-4 text-center">
                    <ListTodo className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No active tasks
                    </p>
                  </div>
                ) : (
                  user?.tasks
                    .filter((task) => !task.completed)
                    .map((task) => {
                      const priorityColors = {
                        high: {
                          bg: "bg-rose-500/10",
                          text: "text-rose-400",
                          dot: "bg-rose-400",
                        },
                        medium: {
                          bg: "bg-amber-500/10",
                          text: "text-amber-400",
                          dot: "bg-amber-400",
                        },
                        low: {
                          bg: "bg-emerald-500/10",
                          text: "text-emerald-400",
                          dot: "bg-emerald-400",
                        },
                      };
                      const colors = priorityColors[task.priority];
                      const completedCount = task.subTasks.filter(
                        (st) => st.completed
                      ).length;
                      const progress =
                        task.subTasks.length > 0
                          ? (completedCount / task.subTasks.length) * 100
                          : 0;

                      return (
                        <DropdownMenuItem
                          key={task.id}
                          onClick={() => {
                            setSelectedTaskId(task.id);
                            setSubtaskElapsedTime(0);
                            setPendingSubtaskComplete(false);
                          }}
                          className={`flex flex-col items-start gap-2 px-3 py-3 rounded-lg cursor-pointer transition-all ${
                            selectedTaskId === task.id
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div
                              className={`w-2 h-2 rounded-full ${colors.dot}`}
                            />
                            <span className="font-medium text-foreground flex-1 truncate">
                              {task.title}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} capitalize`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 w-full pl-5">
                            <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {completedCount}/{task.subTasks.length}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      );
                    })
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Current Task Info */}
            {selectedTask && (
              <div className="space-y-4 mt-4">
                {/* Task Progress */}
                {totalSubTasksCount > 0 && (
                  <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Task Progress
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {completedSubTasksCount}/{totalSubTasksCount} subtasks
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (completedSubTasksCount / totalSubTasksCount) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Current Subtask with Progress */}
                {currentSubTask && (
                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                          Current Focus
                        </span>
                      </div>
                      {currentSubTask.estimatedMinutes > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {formatElapsedTime(subtaskElapsedTime)} /{" "}
                          {currentSubTask.estimatedMinutes}m
                        </span>
                      )}
                    </div>
                    <p className="text-foreground font-medium mb-3">
                      {currentSubTask.title}
                    </p>

                    {/* Subtask Progress Bar */}
                    {currentSubTask.estimatedMinutes > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              subtaskProgress >= 100
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(subtaskProgress, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {Math.round(subtaskProgress)}% complete
                          </span>
                          {subtaskProgress >= 100 && (
                            <span className="text-amber-400 font-medium">
                              Est. time reached!
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* All subtasks done message */}
                {totalSubTasksCount > 0 && !currentSubTask && (
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-400 font-medium">
                      All subtasks completed!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-muted-foreground">XP Earned</span>
            </div>
            <p className="text-2xl font-bold text-foreground">+{xpGained}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Target className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {sessionsToday}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
