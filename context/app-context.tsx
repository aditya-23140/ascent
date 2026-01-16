"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, Brain, Flame, Star, Crown } from "lucide-react";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subTasks: SubTask[];
  priority: "low" | "medium" | "high";
  dueDate: string;
  pomodoroCount: number;
  estimatedMinutes: number;
  sessionsCompleted: number;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  duration: number;
  breakDuration: number;
  completed: boolean;
  startTime: string;
  endTime?: string;
  focusScore: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  unlockedAt?: string;
}

export interface User {
  id: string;
  name: string;
  level: number;
  totalXP: number;
  currentXP: number;
  rank: number;
  score: number;
  tasksCompleted: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  badges: Badge[];
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  sessionsByHour: Record<string, number>;
}

export interface AppState {
  users: User[];
  currentUserId: string;
  currentComboMultiplier: number;
  lastComboTime: number;
  pomodoroSettings: {
    workDuration: number;
    breakDuration: number;
  };
}

interface AppContextType extends AppState {
  initializeDemoData: () => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addSubTask: (taskId: string, subTask: SubTask) => void;
  updateSubTask: (
    taskId: string,
    subTaskId: string,
    updates: Partial<SubTask>
  ) => void;
  completeTask: (taskId: string) => void;
  completeSubTask: (taskId: string, subTaskId: string) => void;
  addPomodoroSession: (session: PomodoroSession) => void;
  addXP: (xp: number, source: string) => void;
  getCurrentUser: () => User | undefined;
  getAllUsers: () => User[];
  getLeaderboard: () => User[];
  updatePomodoroSettings: (workDuration: number, breakDuration: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const ICON_MAP = {
  CheckCircle2,
  Brain,
  Flame,
  Star,
  Crown,
};

type IconName = keyof typeof ICON_MAP;

const DEMO_BADGES: Badge[] = [
  {
    id: "1",
    name: "First Task",
    icon: "CheckCircle2",
    description: "Complete your first task",
  },
  {
    id: "2",
    name: "Focused Mind",
    icon: "Brain",
    description: "Complete 5 pomodoro sessions",
  },
  {
    id: "3",
    name: "On Fire",
    icon: "Flame",
    description: "Maintain a 7-day streak",
  },
  { id: "4", name: "Level 10", icon: "Star", description: "Reach level 10" },
  {
    id: "5",
    name: "Productivity Master",
    icon: "Crown",
    description: "Complete 50 tasks",
  },
];

const DEMO_USERS: User[] = [
  {
    id: "user_1",
    name: "Alex Chen",
    level: 15,
    totalXP: 8500,
    currentXP: 650,
    rank: 1,
    score: 4250,
    tasksCompleted: 87,
    sessionsCompleted: 156,
    currentStreak: 12,
    longestStreak: 21,
    lastSessionDate: new Date().toISOString(),
    badges: DEMO_BADGES.slice(0, 4),
    tasks: [],
    pomodoroSessions: [],
    sessionsByHour: {
      "09:00": 5,
      "10:00": 8,
      "14:00": 6,
      "15:00": 7,
      "16:00": 4,
    },
  },
  {
    id: "user_2",
    name: "Jordan Smith",
    level: 12,
    totalXP: 6200,
    currentXP: 200,
    rank: 2,
    score: 3100,
    tasksCompleted: 64,
    sessionsCompleted: 120,
    currentStreak: 8,
    longestStreak: 15,
    lastSessionDate: new Date().toISOString(),
    badges: DEMO_BADGES.slice(0, 3),
    tasks: [],
    pomodoroSessions: [],
    sessionsByHour: { "09:00": 4, "11:00": 6, "14:00": 5, "16:00": 5 },
  },
  {
    id: "user_3",
    name: "Sam Rodriguez",
    level: 10,
    totalXP: 4900,
    currentXP: 900,
    rank: 3,
    score: 2450,
    tasksCompleted: 52,
    sessionsCompleted: 95,
    currentStreak: 5,
    longestStreak: 10,
    lastSessionDate: new Date().toISOString(),
    badges: DEMO_BADGES.slice(0, 2),
    tasks: [],
    pomodoroSessions: [],
    sessionsByHour: { "10:00": 3, "14:00": 4, "15:00": 4 },
  },
  {
    id: "user_demo",
    name: "You",
    level: 8,
    totalXP: 3500,
    currentXP: 500,
    rank: 4,
    score: 1750,
    tasksCompleted: 28,
    sessionsCompleted: 52,
    currentStreak: 3,
    longestStreak: 7,
    lastSessionDate: new Date().toISOString(),
    badges: [DEMO_BADGES[0]],
    tasks: [],
    pomodoroSessions: [],
    sessionsByHour: { "09:00": 2, "14:00": 3, "15:00": 2 },
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>({
    users: DEMO_USERS,
    currentUserId: "user_demo",
    currentComboMultiplier: 1,
    lastComboTime: 0,
    pomodoroSettings: {
      workDuration: 25,
      breakDuration: 5,
    },
  });

  const getCurrentUser = useCallback(() => {
    return appState.users.find((u) => u.id === appState.currentUserId);
  }, [appState.users, appState.currentUserId]);

  const getAllUsers = useCallback(() => {
    return appState.users;
  }, [appState.users]);

  const getLeaderboard = useCallback(() => {
    return [...appState.users].sort((a, b) => b.score - a.score);
  }, [appState.users]);

  const calculateComboMultiplier = useCallback(() => {
    const currentTime = Date.now();
    const timeSinceLastCombo = currentTime - appState.lastComboTime;
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (timeSinceLastCombo > oneDayMs) {
      return 1;
    }

    const hoursSinceCombo = timeSinceLastCombo / (60 * 60 * 1000);
    return Math.max(1, 3 - hoursSinceCombo * 0.5);
  }, [appState.lastComboTime]);

  const addXP = useCallback(
    (xp: number, source: string) => {
      setAppState((prev) => {
        const users = prev.users.map((user) => {
          if (user.id === prev.currentUserId) {
            const multiplier = calculateComboMultiplier();
            const xpGained = Math.floor(xp * multiplier);
            const newTotalXP = user.totalXP + xpGained;
            let newCurrentXP = (user.currentXP + xpGained) % 1000;
            let newLevel = user.level;

            if (user.currentXP + xpGained >= 1000) {
              newLevel += Math.floor((user.currentXP + xpGained) / 1000);
              newCurrentXP = (user.currentXP + xpGained) % 1000;
            }

            return {
              ...user,
              totalXP: newTotalXP,
              currentXP: newCurrentXP,
              level: newLevel,
              score: user.score + xpGained,
            };
          }
          return user;
        });

        return {
          ...prev,
          users,
          currentComboMultiplier: calculateComboMultiplier(),
          lastComboTime: Date.now(),
        };
      });
    },
    [calculateComboMultiplier]
  );

  const addTask = useCallback((task: Task) => {
    setAppState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId
          ? { ...user, tasks: [...user.tasks, task] }
          : user
      ),
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setAppState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId
          ? {
              ...user,
              tasks: user.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : user
      ),
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId
          ? { ...user, tasks: user.tasks.filter((t) => t.id !== taskId) }
          : user
      ),
    }));
  }, []);

  const addSubTask = useCallback(
    (taskId: string, subTask: SubTask) => {
      updateTask(taskId, {
        subTasks: [
          ...(getCurrentUser()?.tasks.find((t) => t.id === taskId)?.subTasks ||
            []),
          subTask,
        ],
      });
    },
    [updateTask, getCurrentUser]
  );

  const updateSubTask = useCallback(
    (taskId: string, subTaskId: string, updates: Partial<SubTask>) => {
      const task = getCurrentUser()?.tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, {
          subTasks: task.subTasks.map((st) =>
            st.id === subTaskId ? { ...st, ...updates } : st
          ),
        });
      }
    },
    [updateTask, getCurrentUser]
  );

  const completeSubTask = useCallback(
    (taskId: string, subTaskId: string) => {
      const task = getCurrentUser()?.tasks.find((t) => t.id === taskId);
      if (task) {
        const subTask = task.subTasks.find((st) => st.id === subTaskId);
        if (subTask && !subTask.completed) {
          updateSubTask(taskId, subTaskId, { completed: true });
          addXP(50, "subtask_completion");
        }
      }
    },
    [getCurrentUser, updateSubTask, addXP]
  );

  const completeTask = useCallback(
    (taskId: string) => {
      const task = getCurrentUser()?.tasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        const subTasksCompleted = task.subTasks.filter(
          (st) => st.completed
        ).length;
        const allSubTasksCompleted =
          task.subTasks.length === 0 ||
          subTasksCompleted === task.subTasks.length;

        if (!allSubTasksCompleted) return;

        const priorityMultiplier =
          task.priority === "high" ? 1.5 : task.priority === "medium" ? 1.2 : 1;
        const xpReward = Math.floor(200 * priorityMultiplier);

        updateTask(taskId, { completed: true });
        addXP(xpReward, "task_completion");

        setAppState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === prev.currentUserId
              ? { ...user, tasksCompleted: user.tasksCompleted + 1 }
              : user
          ),
        }));
      }
    },
    [getCurrentUser, updateTask, addXP]
  );

  const addPomodoroSession = useCallback(
    (session: PomodoroSession) => {
      const xpReward = session.focusScore * 10;
      addXP(xpReward, "pomodoro_session");

      setAppState((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === prev.currentUserId
            ? {
                ...user,
                pomodoroSessions: [...user.pomodoroSessions, session],
                sessionsCompleted: user.sessionsCompleted + 1,
                lastSessionDate: new Date().toISOString(),
              }
            : user
        ),
      }));
    },
    [addXP]
  );

  const updatePomodoroSettings = useCallback(
    (workDuration: number, breakDuration: number) => {
      setAppState((prev) => ({
        ...prev,
        pomodoroSettings: {
          workDuration,
          breakDuration,
        },
      }));
    },
    []
  );

  const initializeDemoData = useCallback(() => {
    const demoTask: Task = {
      id: "task_1",
      title: "Design new dashboard",
      description:
        "Create wireframes and mockups for the new analytics dashboard",
      completed: false,
      priority: "high",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      pomodoroCount: 0,
      estimatedMinutes: 120,
      sessionsCompleted: 0,
      subTasks: [
        { id: "st_1", title: "Create wireframes", completed: false },
        { id: "st_2", title: "Design mockups", completed: false },
        { id: "st_3", title: "Gather feedback", completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === "user_demo" ? { ...user, tasks: [demoTask] } : user
      ),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...appState,
        initializeDemoData,
        addTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        completeTask,
        completeSubTask,
        addPomodoroSession,
        addXP,
        getCurrentUser,
        getAllUsers,
        getLeaderboard,
        updatePomodoroSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
