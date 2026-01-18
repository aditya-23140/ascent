// Energy-Aware Scheduler - Spoon Theory Implementation
// Uses constraint satisfaction to optimize task scheduling based on energy levels

export interface EnergyProfile {
  totalDailyEnergy: number; // Total "spoons" available (default: 100)
  currentEnergy: number; // Current remaining energy
  peakHours: { start: number; end: number }[]; // Hours when focus is best (0-23)
  lowEnergyHours: number[]; // Hours to avoid demanding tasks
  postMealDip: boolean; // Whether user experiences post-lunch dip
}

export interface SchedulableTask {
  id: string;
  title: string;
  energyCost: number; // 1-100 scale
  duration: number; // minutes
  priority: "low" | "medium" | "high";
  deadline?: Date;
  requiresFocus: boolean; // Should be scheduled during peak hours
  canBeSplit: boolean; // Can be broken into multiple sessions
  preferredTimeSlot?: "morning" | "afternoon" | "evening";
  dependencies?: string[]; // Task IDs that must complete first
  category?: "deep-work" | "admin" | "creative" | "communication" | "physical";
}

export interface TimeSlot {
  start: Date;
  end: Date;
  energyLevel: "high" | "medium" | "low";
}

export interface ScheduledTask extends SchedulableTask {
  scheduledStart: Date;
  scheduledEnd: Date;
  energyAtStart: number;
  energyAtEnd: number;
}

export interface ScheduleResult {
  scheduledTasks: ScheduledTask[];
  unscheduledTasks: SchedulableTask[];
  totalEnergyUsed: number;
  remainingEnergy: number;
  warnings: string[];
  suggestions: string[];
}

// Default energy profile for ADHD users
export const DEFAULT_ENERGY_PROFILE: EnergyProfile = {
  totalDailyEnergy: 100,
  currentEnergy: 100,
  peakHours: [
    { start: 9, end: 12 }, // Morning peak
    { start: 15, end: 17 }, // Afternoon recovery
  ],
  lowEnergyHours: [13, 14], // Post-lunch dip
  postMealDip: true,
};

// Energy cost estimates by task category
export const CATEGORY_ENERGY_COSTS: Record<string, number> = {
  "deep-work": 25, // High cognitive load
  creative: 20, // Moderate-high
  communication: 15, // Phone calls, meetings drain ADHD brains
  admin: 10, // Routine tasks
  physical: 15, // Physical tasks
  default: 15,
};

// Context switching penalty
const CONTEXT_SWITCH_PENALTY = 5; // Energy cost for switching between different task types

// Calculate energy cost with ADHD-specific adjustments
export function calculateAdjustedEnergyCost(
  task: SchedulableTask,
  previousTask?: SchedulableTask,
  timeSlot?: TimeSlot
): number {
  let cost = task.energyCost;

  // Context switching penalty
  if (previousTask && previousTask.category !== task.category) {
    cost += CONTEXT_SWITCH_PENALTY;
  }

  // Time-of-day adjustments
  if (timeSlot) {
    if (timeSlot.energyLevel === "low" && task.requiresFocus) {
      cost *= 1.5; // 50% more energy during low periods for focus tasks
    } else if (timeSlot.energyLevel === "high" && !task.requiresFocus) {
      // Waste of peak hours for non-focus tasks (opportunity cost)
      cost *= 0.8; // Easier but not recommended
    }
  }

  return Math.round(cost);
}

// Generate time slots for a day with energy levels
export function generateTimeSlots(
  date: Date,
  profile: EnergyProfile,
  startHour: number = 8,
  endHour: number = 20
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(date);
    end.setHours(hour + 1, 0, 0, 0);

    let energyLevel: "high" | "medium" | "low" = "medium";

    // Check if in peak hours
    const isPeak = profile.peakHours.some(
      (peak) => hour >= peak.start && hour < peak.end
    );
    if (isPeak) energyLevel = "high";

    // Check if in low energy hours
    if (profile.lowEnergyHours.includes(hour)) {
      energyLevel = "low";
    }

    slots.push({ start, end, energyLevel });
  }

  return slots;
}

// Greedy scheduling algorithm with energy awareness
export function scheduleTasksGreedy(
  tasks: SchedulableTask[],
  profile: EnergyProfile,
  date: Date = new Date()
): ScheduleResult {
  const slots = generateTimeSlots(date, profile);
  const scheduled: ScheduledTask[] = [];
  const unscheduled: SchedulableTask[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  let remainingEnergy = profile.currentEnergy;

  // Sort tasks by priority and deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    // Priority score
    const priorityScore = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityScore[a.priority];
    const bPriority = priorityScore[b.priority];

    if (aPriority !== bPriority) return bPriority - aPriority;

    // Deadline urgency
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;

    // Focus tasks during peak hours preference
    if (a.requiresFocus !== b.requiresFocus) {
      return a.requiresFocus ? -1 : 1;
    }

    return 0;
  });
  // Group focus tasks for peak hours
  const focusTasks = sortedTasks.filter((t) => t.requiresFocus);
  const nonFocusTasks = sortedTasks.filter((t) => !t.requiresFocus);

  // Schedule focus tasks during peak hours first
  for (const task of focusTasks) {
    const peakSlot = slots.find(
      (s) =>
        s.energyLevel === "high" &&
        !scheduled.some(
          (st) => st.scheduledStart.getTime() === s.start.getTime()
        )
    );

    if (peakSlot && remainingEnergy >= task.energyCost) {
      const scheduledTask: ScheduledTask = {
        ...task,
        scheduledStart: peakSlot.start,
        scheduledEnd: new Date(
          peakSlot.start.getTime() + task.duration * 60000
        ),
        energyAtStart: remainingEnergy,
        energyAtEnd: remainingEnergy - task.energyCost,
      };
      scheduled.push(scheduledTask);
      remainingEnergy -= task.energyCost;
    } else if (remainingEnergy < task.energyCost) {
      unscheduled.push(task);
      warnings.push(
        `"${task.title}" requires ${task.energyCost} energy but only ${remainingEnergy} remaining`
      );
    } else {
      unscheduled.push(task);
      warnings.push(`No peak hours available for focus task "${task.title}"`);
    }
  }

  // Schedule non-focus tasks in remaining slots
  for (const task of nonFocusTasks) {
    const availableSlot = slots.find(
      (s) =>
        !scheduled.some(
          (st) =>
            (st.scheduledStart.getTime() <= s.start.getTime() &&
              st.scheduledEnd.getTime() > s.start.getTime()) ||
            (st.scheduledStart.getTime() < s.end.getTime() &&
              st.scheduledEnd.getTime() >= s.end.getTime())
        )
    );

    if (availableSlot && remainingEnergy >= task.energyCost) {
      const scheduledTask: ScheduledTask = {
        ...task,
        scheduledStart: availableSlot.start,
        scheduledEnd: new Date(
          availableSlot.start.getTime() + task.duration * 60000
        ),
        energyAtStart: remainingEnergy,
        energyAtEnd: remainingEnergy - task.energyCost,
      };
      scheduled.push(scheduledTask);
      remainingEnergy -= task.energyCost;
    } else if (remainingEnergy < task.energyCost) {
      unscheduled.push(task);
    } else {
      unscheduled.push(task);
    }
  }

  // Generate suggestions
  if (remainingEnergy < 20) {
    suggestions.push(
      "Your energy is running low. Consider scheduling fewer tasks or adding breaks."
    );
  }

  if (unscheduled.length > 0) {
    suggestions.push(
      `${unscheduled.length} task(s) couldn't be scheduled. Consider moving them to tomorrow or breaking them into smaller pieces.`
    );
  }

  const focusTasksInLowPeriod = scheduled.filter(
    (t) =>
      t.requiresFocus &&
      profile.lowEnergyHours.includes(t.scheduledStart.getHours())
  );
  if (focusTasksInLowPeriod.length > 0) {
    suggestions.push(
      "Some focus tasks are scheduled during low-energy periods. Consider rescheduling."
    );
  }

  // Sort scheduled tasks by time
  scheduled.sort(
    (a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime()
  );

  return {
    scheduledTasks: scheduled,
    unscheduledTasks: unscheduled,
    totalEnergyUsed: profile.currentEnergy - remainingEnergy,
    remainingEnergy,
    warnings,
    suggestions,
  };
}

// Convert app Task to SchedulableTask
export function taskToSchedulable(
  task: {
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
    estimatedMinutes: number;
    dueDate?: string;
  },
  customEnergyCost?: number
): SchedulableTask {
  // Estimate energy cost based on priority and duration
  const baseCost =
    customEnergyCost || Math.min(30, Math.ceil(task.estimatedMinutes / 3));
  const priorityMultiplier = { low: 0.8, medium: 1, high: 1.2 };

  return {
    id: task.id,
    title: task.title,
    energyCost: Math.round(baseCost * priorityMultiplier[task.priority]),
    duration: task.estimatedMinutes,
    priority: task.priority,
    deadline: task.dueDate ? new Date(task.dueDate) : undefined,
    requiresFocus: task.priority === "high" || task.estimatedMinutes > 30,
    canBeSplit: task.estimatedMinutes > 25,
    category: "deep-work", // Default, can be customized
  };
}

// Energy recovery suggestions
export function getEnergyRecoverySuggestions(
  currentEnergy: number,
  targetEnergy: number
): string[] {
  const suggestions: string[] = [];
  const energyNeeded = targetEnergy - currentEnergy;

  if (energyNeeded <= 0) return ["Your energy is good! Ready to work."];

  if (energyNeeded <= 10) {
    suggestions.push("Take a 5-minute break and stretch");
    suggestions.push("Get a glass of water");
    suggestions.push("Do some deep breathing exercises");
  } else if (energyNeeded <= 25) {
    suggestions.push("Take a 15-minute power nap");
    suggestions.push("Go for a short walk outside");
    suggestions.push("Have a healthy snack");
  } else if (energyNeeded <= 50) {
    suggestions.push("Take a 30-minute break with a change of scenery");
    suggestions.push("Do some light exercise");
    suggestions.push("Consider rescheduling non-urgent tasks");
  } else {
    suggestions.push("Your energy is very low. Consider ending the work day.");
    suggestions.push("Move remaining tasks to tomorrow");
    suggestions.push("Rest is productive - you can't pour from an empty cup");
  }

  return suggestions;
}

// Spoon visualization data
export interface SpoonVisualization {
  total: number;
  used: number;
  remaining: number;
  percentRemaining: number;
  status: "full" | "good" | "low" | "critical" | "empty";
  color: string;
}

export function getSpoonVisualization(
  profile: EnergyProfile
): SpoonVisualization {
  const remaining = profile.currentEnergy;
  const total = profile.totalDailyEnergy;
  const percentRemaining = Math.round((remaining / total) * 100);

  let status: SpoonVisualization["status"];
  let color: string;

  if (percentRemaining >= 80) {
    status = "full";
    color = "#10b981"; // emerald
  } else if (percentRemaining >= 50) {
    status = "good";
    color = "#22c55e"; // green
  } else if (percentRemaining >= 25) {
    status = "low";
    color = "#f59e0b"; // amber
  } else if (percentRemaining > 0) {
    status = "critical";
    color = "#ef4444"; // red
  } else {
    status = "empty";
    color = "#6b7280"; // gray
  }

  return {
    total,
    used: total - remaining,
    remaining,
    percentRemaining,
    status,
    color,
  };
}
