// AI Coach System - Compassionate Accountability Partner
// This module provides ADHD-focused AI coaching using LLM patterns

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: string;
  emotionalState?: EmotionalState;
  technique?: CoachingTechnique;
}

export type EmotionalState =
  | "overwhelmed"
  | "stuck"
  | "frustrated"
  | "unmotivated"
  | "anxious"
  | "neutral"
  | "motivated"
  | "accomplished";

export type CoachingTechnique =
  | "reframe"
  | "socratic"
  | "body-doubling"
  | "task-breakdown"
  | "validation"
  | "celebration"
  | "grounding";

// System prompt engineered for neurodiversity support
export const COACH_SYSTEM_PROMPT = `You are "Nexus", an ADHD Coach who helps people WANT to do their tasks by making them see the value and enjoyment in activities.

## YOUR CORE MISSION
Your job is NOT to push or pressure. It's to help users:
1. **Discover WHY** the task matters to them personally
2. **Find the enjoyable parts** - every task has something satisfying about it
3. **Connect tasks to their values** and bigger life goals
4. **Create dopamine-friendly approaches** to make work feel rewarding

## HOW TO HELP (IN ORDER)
When a user mentions a task or feels stuck:

1. **EXPLAIN THE BENEFIT** - Why does this task actually matter? What will they gain?
   - "Finishing this report means you'll have peace of mind all weekend"
   - "A clean kitchen actually helps your brain feel calmer - visual clutter = mental clutter for ADHD"
   - "This assignment done = one less thing taking up mental RAM"

2. **FIND THE ENJOYABLE ANGLE** - Help them see what could be satisfying:
   - "There's something weirdly satisfying about organizing data into neat columns"
   - "The best part of cleaning? That 'after' feeling when you walk into the room"
   - "Coding this feature means you'll see it actually WORK - that instant feedback is chef's kiss"

3. **CONNECT TO THEIR VALUES** - Link tasks to what they actually care about:
   - "You said you value being reliable - this is you showing up for yourself"
   - "This project aligns with your goal of [X]"
   - "Future you will be so grateful - think of it as a gift to yourself"

4. **MAKE IT DOPAMINE-FRIENDLY** - Specific strategies:
   - Suggest pairing with something enjoyable (music, coffee, cozy spot)
   - Recommend gamifying it (timer challenges, progress tracking)
   - Break it into "quick wins" that give completion satisfaction
   - Add novelty (new location, different approach, fun tools)

## RESPONSE STYLE
- Be specific, not vague. "This helps because..." not "You can do it!"
- Paint a picture of the positive outcome - make them FEEL the benefit
- Share genuine insights about why tasks are valuable
- Be warm and conversational, like a supportive friend who sees the bigger picture
- Keep responses focused (2-4 sentences) but make every word count

## WHAT TO AVOID
❌ Generic motivation: "You've got this!" "Just push through!"
❌ Shame or guilt: "You should have done this already"
❌ Vague advice: "Try to stay focused" "Be more organized"
❌ Dismissing their struggle: "It's not that hard"
❌ Empty questions: "What do you like about this?" (they came to YOU for insights!)

## EXAMPLE RESPONSES

User: "I need to do laundry but I can't start"
GOOD: "Laundry is actually a great ADHD task - it's mostly waiting time you can fill with something fun. The satisfying part? Opening the dryer to warm, fresh-smelling clothes. Plus, having clean clothes ready removes a daily decision from your plate. Try this: put on a podcast you love, start one load, and you've got 30 min of guilt-free listening time."

User: "I have to study for an exam"  
GOOD: "Here's the thing about studying - it's your brain literally building new neural pathways. Each concept you grasp is like leveling up a skill. The payoff? Walking into that exam feeling prepared instead of panicked. Try the Pomodoro approach: 25 min of focused review, then a reward. What topic would be most satisfying to finally 'get'?"

User: "I need to clean my room but it's overwhelming"
GOOD: "A clean room genuinely helps ADHD brains - less visual noise = easier to focus and find things. The best part? That instant calm when you walk in after. Don't clean the whole room - just clear one surface completely. Seeing ONE clear desk/nightstand gives you that dopamine hit and often kickstarts momentum."`;


// Emotional state detection patterns
const EMOTIONAL_PATTERNS: Record<EmotionalState, string[]> = {
  overwhelmed: [
    "too much",
    "can't handle",
    "everything",
    "drowning",
    "impossible",
    "give up",
    "so much",
    "overwhelmed",
  ],
  stuck: [
    "can't start",
    "don't know where",
    "paralyzed",
    "frozen",
    "stuck",
    "blocked",
    "can't move",
    "procrastinating",
  ],
  frustrated: [
    "annoyed",
    "angry",
    "frustrated",
    "hate",
    "stupid",
    "ugh",
    "argh",
    "why can't I",
    "so hard",
  ],
  unmotivated: [
    "don't want to",
    "boring",
    "no point",
    "why bother",
    "don't care",
    "meh",
    "whatever",
    "unmotivated",
  ],
  anxious: [
    "worried",
    "anxious",
    "scared",
    "nervous",
    "panic",
    "stress",
    "deadline",
    "fear",
  ],
  neutral: [],
  motivated: [
    "excited",
    "ready",
    "let's go",
    "motivated",
    "pumped",
    "can do",
    "energized",
  ],
  accomplished: [
    "did it",
    "finished",
    "completed",
    "done",
    "accomplished",
    "proud",
    "finally",
  ],
};

// Detect emotional state from user message
export function detectEmotionalState(message: string): EmotionalState {
  const lowerMessage = message.toLowerCase();

  for (const [state, patterns] of Object.entries(EMOTIONAL_PATTERNS)) {
    if (patterns.some((pattern) => lowerMessage.includes(pattern))) {
      return state as EmotionalState;
    }
  }

  return "neutral";
}

// Generate contextual coaching prompts based on task and emotional state
export function generateCoachingPrompt(
  userMessage: string,
  taskContext?: {
    taskTitle?: string;
    taskDescription?: string;
    subtasks?: string[];
    isOverdue?: boolean;
  },
  emotionalState?: EmotionalState
): string {
  let contextPrompt = "";

  if (taskContext?.taskTitle) {
    contextPrompt += `\n\nCURRENT TASK CONTEXT:
Task: "${taskContext.taskTitle}"
${
  taskContext.taskDescription
    ? `Description: ${taskContext.taskDescription}`
    : ""
}
${
  taskContext.subtasks?.length
    ? `Subtasks: ${taskContext.subtasks.join(", ")}`
    : ""
}
${taskContext.isOverdue ? "⚠️ This task is overdue" : ""}`;
  }

  if (emotionalState && emotionalState !== "neutral") {
    contextPrompt += `\n\nDETECTED EMOTIONAL STATE: ${emotionalState}
Apply the appropriate therapeutic technique for this state.`;
  }

  return `${COACH_SYSTEM_PROMPT}${contextPrompt}\n\nUser message: "${userMessage}"`;
}

// Pre-built responses for common scenarios (fallback when no LLM available)
export const FALLBACK_RESPONSES: Record<EmotionalState, string[]> = {
  overwhelmed: [
    "When everything feels urgent, nothing gets done - that's just how brains work. Here's the thing: finishing just ONE task will give you momentum and clear mental space. Pick the quickest win - that 'done' feeling is real relief.",
    "Your brain is in 'freeze mode' from too many inputs. The benefit of tackling just one small thing? It proves to your nervous system that you CAN make progress. That feeling of control is worth more than you'd think.",
    "Overwhelm usually means you're trying to hold too much in working memory. Writing a quick 3-item list literally frees up mental RAM. The clarity you'll feel is immediate - try it and notice the difference.",
  ],
  stuck: [
    "Being stuck usually means the first step feels too big. Here's why tiny starts work: your brain releases dopamine for ANY progress, not just big wins. A 2-minute start often turns into 20 because momentum is real.",
    "The hardest part of any task is starting - that's neuroscience, not laziness. The payoff of pushing through that initial resistance? You'll likely find the task is way easier than your brain made it seem. Your future self will thank you.",
    "Procrastination is your brain avoiding discomfort. But here's the twist: the relief of starting is usually better than the 'comfort' of avoiding. That weight-off-your-shoulders feeling? It's waiting on the other side of 2 minutes of action.",
  ],
  frustrated: [
    "Frustration is valid - ADHD makes 'simple' things genuinely harder. But here's what helps: this task you're fighting? Completing it means you won't have to think about it anymore. That mental freedom is the real reward.",
    "When tasks feel harder than they 'should' be, that gap causes frustration. The good news? Every time you push through anyway, you're building evidence that you CAN do hard things. That self-trust compounds over time.",
    "Your frustration is information - something about this task isn't working. What if you changed ONE thing about how you're approaching it? Different location, different time, or break it smaller? Sometimes novelty unsticks us.",
  ],
  unmotivated: [
    "Motivation is actually a result of action, not a prerequisite. The benefit of starting without motivation? You often FIND motivation 5 minutes in. Your brain goes 'oh, this isn't so bad' and dopamine kicks in.",
    "Low motivation usually means low dopamine. Here's a hack: pair the boring task with something enjoyable - music, a good drink, a cozy spot. The task gets associated with pleasure, and future you will find it easier.",
    "What if this task is actually a gift to future you? Tomorrow-you waking up with this DONE instead of looming? That's fewer decisions, less stress, more freedom. You're literally buying yourself peace of mind.",
  ],
  anxious: [
    "Anxiety often comes from uncertainty. The benefit of taking ANY action? It gives you real information instead of worst-case scenarios. Even a small step forward usually reveals 'oh, this is manageable.'",
    "Your brain is trying to protect you by worrying, but it's not helping. Here's what does: focus on just the NEXT action, not the whole thing. Completing one piece gives your nervous system proof that you're handling it.",
    "Anxiety makes tasks feel bigger than they are. Breaking something into tiny steps isn't just about productivity - each completed step tells your brain 'I'm safe, I'm capable.' That calm confidence builds with each small win.",
  ],
  neutral: [
    "Ready to make some progress? The satisfying thing about tackling tasks when you're feeling neutral is that you can build positive momentum. Pick something with a clear 'done' state - that completion hit is coming.",
    "Good headspace is valuable - let's use it well. What task, once finished, would give you the most relief or satisfaction? Sometimes the thing we're slightly avoiding is exactly what would feel best to complete.",
    "This is a great state to build on. Every task you complete now is one less thing competing for your attention later. Think of it as clearing space for the things you actually want to do.",
  ],
  motivated: [
    "This energy is gold - motivation is temporary so let's use it! Tackle that task you've been putting off. The satisfaction of finally doing it while you have momentum? *Chef's kiss*.",
    "Motivation like this is the perfect time to knock out something that usually feels hard. The benefit? You'll prove to yourself it's doable, making it easier next time even without the motivation boost.",
    "Ride this wave! Pick your most important task and go. The compound benefit: progress on what matters PLUS the confidence boost of using your good energy wisely.",
  ],
  accomplished: [
    "YES! This is the payoff - that accomplishment feeling is real dopamine. Take a second to actually feel it. This is evidence your brain can use: 'I do finish things, I am capable.' That belief matters.",
    "You did it! Here's the hidden benefit: every completion makes the NEXT task slightly easier to start. You're literally training your brain that effort leads to reward. Celebrate this.",
    "That done feeling? That's not just relief - it's proof. Proof you can push through resistance, proof tasks are doable. Bank this feeling and remember it next time you're stuck.",
  ],
};

// Get a random fallback response based on emotional state
export function getFallbackResponse(emotionalState: EmotionalState): string {
  const responses = FALLBACK_RESPONSES[emotionalState];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Task decomposition templates
export interface DecomposedTask {
  originalTask: string;
  subtasks: {
    title: string;
    estimatedMinutes: number;
    energyCost: number; // 1-5 scale
  }[];
  totalEstimatedMinutes: number;
  totalEnergyCost: number;
}

// Pre-built decomposition patterns for common tasks
export const TASK_DECOMPOSITION_PATTERNS: Record<
  string,
  DecomposedTask["subtasks"]
> = {
  "clean kitchen": [
    {
      title: "Put away any cold/perishable food",
      estimatedMinutes: 2,
      energyCost: 1,
    },
    {
      title: "Gather all trash into one bag",
      estimatedMinutes: 3,
      energyCost: 1,
    },
    {
      title: "Load dirty dishes into dishwasher",
      estimatedMinutes: 5,
      energyCost: 2,
    },
    { title: "Wipe down countertops", estimatedMinutes: 3, energyCost: 2 },
    {
      title: "Sweep or quick-mop the floor",
      estimatedMinutes: 5,
      energyCost: 2,
    },
  ],
  "do laundry": [
    {
      title: "Gather dirty clothes from bedroom",
      estimatedMinutes: 3,
      energyCost: 1,
    },
    { title: "Sort into lights and darks", estimatedMinutes: 2, energyCost: 1 },
    { title: "Start first load in washer", estimatedMinutes: 2, energyCost: 1 },
    { title: "Set timer to move to dryer", estimatedMinutes: 1, energyCost: 1 },
    { title: "Fold clothes when dry", estimatedMinutes: 10, energyCost: 2 },
    { title: "Put folded clothes away", estimatedMinutes: 5, energyCost: 2 },
  ],
  "write report": [
    { title: "Create document with title", estimatedMinutes: 1, energyCost: 1 },
    { title: "Write bullet point outline", estimatedMinutes: 5, energyCost: 2 },
    {
      title: "Expand first section into paragraphs",
      estimatedMinutes: 15,
      energyCost: 4,
    },
    { title: "Expand remaining sections", estimatedMinutes: 20, energyCost: 4 },
    { title: "Add introduction paragraph", estimatedMinutes: 5, energyCost: 3 },
    { title: "Add conclusion paragraph", estimatedMinutes: 5, energyCost: 3 },
    { title: "Proofread and fix errors", estimatedMinutes: 10, energyCost: 2 },
  ],
  email: [
    { title: "Open email app/website", estimatedMinutes: 1, energyCost: 1 },
    { title: "Write subject line", estimatedMinutes: 1, energyCost: 1 },
    {
      title: "Write first sentence (greeting + purpose)",
      estimatedMinutes: 2,
      energyCost: 2,
    },
    { title: "Write main content", estimatedMinutes: 5, energyCost: 3 },
    { title: "Add closing and signature", estimatedMinutes: 1, energyCost: 1 },
    { title: "Review and send", estimatedMinutes: 1, energyCost: 1 },
  ],
  exercise: [
    { title: "Put on workout clothes", estimatedMinutes: 3, energyCost: 1 },
    { title: "Fill water bottle", estimatedMinutes: 1, energyCost: 1 },
    { title: "5-minute warm-up stretches", estimatedMinutes: 5, energyCost: 2 },
    { title: "Main workout (20 min)", estimatedMinutes: 20, energyCost: 4 },
    { title: "5-minute cool-down", estimatedMinutes: 5, energyCost: 2 },
  ],
  study: [
    {
      title: "Gather materials (books, notes, laptop)",
      estimatedMinutes: 3,
      energyCost: 1,
    },
    {
      title: "Set up distraction-free environment",
      estimatedMinutes: 2,
      energyCost: 1,
    },
    {
      title: "Review what was covered last time",
      estimatedMinutes: 5,
      energyCost: 2,
    },
    {
      title: "Active study session (25 min)",
      estimatedMinutes: 25,
      energyCost: 4,
    },
    {
      title: "Take notes or create flashcards",
      estimatedMinutes: 10,
      energyCost: 3,
    },
    { title: "Quick self-quiz", estimatedMinutes: 5, energyCost: 2 },
  ],
};

// Find matching decomposition pattern or generate generic breakdown
export function decomposeTask(taskTitle: string): DecomposedTask {
  const lowerTitle = taskTitle.toLowerCase();

  // Check for matching patterns
  for (const [pattern, subtasks] of Object.entries(
    TASK_DECOMPOSITION_PATTERNS
  )) {
    if (lowerTitle.includes(pattern)) {
      const totalMinutes = subtasks.reduce(
        (sum, st) => sum + st.estimatedMinutes,
        0
      );
      const totalEnergy = subtasks.reduce((sum, st) => sum + st.energyCost, 0);
      return {
        originalTask: taskTitle,
        subtasks,
        totalEstimatedMinutes: totalMinutes,
        totalEnergyCost: totalEnergy,
      };
    }
  }

  // Generic breakdown for unknown tasks
  const genericSubtasks = [
    {
      title: `Gather materials needed for "${taskTitle}"`,
      estimatedMinutes: 5,
      energyCost: 1,
    },
    {
      title: `Define what "done" looks like for "${taskTitle}"`,
      estimatedMinutes: 3,
      energyCost: 2,
    },
    {
      title: `Start the first small piece`,
      estimatedMinutes: 10,
      energyCost: 3,
    },
    {
      title: `Continue working (set 15-min timer)`,
      estimatedMinutes: 15,
      energyCost: 3,
    },
    { title: `Review progress and adjust`, estimatedMinutes: 5, energyCost: 2 },
    { title: `Complete and celebrate!`, estimatedMinutes: 5, energyCost: 2 },
  ];

  return {
    originalTask: taskTitle,
    subtasks: genericSubtasks,
    totalEstimatedMinutes: 43,
    totalEnergyCost: 13,
  };
}

// Generate AI prompt for task decomposition
export function generateDecompositionPrompt(
  taskTitle: string,
  context?: string
): string {
  return `You are an ADHD task decomposition specialist. Break down the following task into small, concrete, mechanical actions. Each subtask should:
1. Be completable in 15 minutes or less
2. Have a clear "done" state
3. Require minimal decision-making
4. Be ordered from easiest to hardest (activation energy ramp-up)

Task: "${taskTitle}"
${context ? `Additional context: ${context}` : ""}

Return ONLY a JSON array in this exact format:
[
  {"title": "First small action", "estimatedMinutes": 5, "energyCost": 1},
  {"title": "Second action", "estimatedMinutes": 10, "energyCost": 2}
]

Energy cost scale: 1=trivial, 2=easy, 3=moderate, 4=challenging, 5=exhausting`;
}
