"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/context/app-context";
import { Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function PomodoroTimer() {
  const router = useRouter();
  const {
    addPomodoroSession,
    getCurrentUser,
    pomodoroSettings,
    updatePomodoroSettings,
  } = useAppState();
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [workDuration, setWorkDuration] = useState(
    pomodoroSettings.workDuration.toString()
  );
  const [breakDuration, setBreakDuration] = useState(
    pomodoroSettings.breakDuration.toString()
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const user = getCurrentUser();
  const workDurationNum = Math.max(
    1,
    Number.parseInt(workDuration) || pomodoroSettings.workDuration
  );
  const breakDurationNum = Math.max(
    1,
    Number.parseInt(breakDuration) || pomodoroSettings.breakDuration
  );
  const sessionTime = isBreak ? breakDurationNum : workDurationNum;

  useEffect(() => {
    setTimeLeft(sessionTime * 60);
  }, [sessionTime, isBreak]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (!isBreak) {
            setFocusScore(
              Math.floor(
                ((workDurationNum * 60 - newTime) / (workDurationNum * 60)) *
                  100
              )
            );
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, workDurationNum]);

  const handleSessionComplete = () => {
    if (!isBreak) {
      const session = {
        id: `session_${Date.now()}`,
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
    }

    setIsBreak(!isBreak);
    setTimeLeft((isBreak ? workDurationNum : breakDurationNum) * 60);
    setFocusScore(0);

    if (!isBreak) {
      alert(
        `Session completed! +${Math.floor(workDurationNum * 40)} XP earned!`
      );
    }
  };

  const resetTimer = () => {
    setTimeLeft(workDurationNum * 60);
    setFocusScore(0);
    setIsRunning(false);
    setIsBreak(false);
  };

  const handleSaveSettings = (
    newWorkDuration: string,
    newBreakDuration: string
  ) => {
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
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="card border-orange-500/30 bg-gradient-to-br from-black via-black/90 to-black/80">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">
              {isBreak ? "Break Time" : "Focus Session"}
            </p>
            <div className="text-8xl font-bold font-mono text-transparent bg-gradient-to-r from-purple-400 via-orange-400 to-green-400 bg-clip-text">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Working on Task
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-black/50 text-gray-100 px-3 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="">No task selected</option>
              {user?.tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            {selectedTaskId && (
              <p className="text-xs text-gray-400 mt-2">
                Current task:{" "}
                {user?.tasks.find((t) => t.id === selectedTaskId)?.title}
              </p>
            )}
          </div>

          {!isBreak && (
            <div className="bg-black/50 rounded-lg p-6 border border-purple-500/20">
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 rounded-full border-4 border-purple-500/50 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Focus Score</p>
                    <p className="text-4xl font-bold text-orange-400">
                      {focusScore}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-orange-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
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
              className="px-6 py-3 rounded-lg font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Reset
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-6 py-3 rounded-lg font-medium bg-green-600/30 text-green-400 hover:bg-green-600/40 border border-green-500/50 transition-all flex items-center gap-2">
                  Settings
                  <ChevronDown size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-black/95 border border-purple-500/30">
                <DropdownMenuLabel className="text-purple-400 font-semibold">
                  Pomodoro Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-500/20" />

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                      className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                      className="w-full bg-black/50 text-gray-100 px-4 py-2 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() =>
                        handleSaveSettings(workDuration, breakDuration)
                      }
                      className="flex-1 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-orange-600 text-white hover:shadow-lg transition-all text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-gray-400">
            Sessions completed today:{" "}
            <span className="font-bold text-orange-400">{sessionsToday}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
