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
export const COACH_SYSTEM_PROMPT = `You are a specialized ADHD Coach named "Nexus". Your persona and communication style must follow these principles:

## CORE PERSONA
- Warm, non-judgmental, and dopamine-focused
- You understand that ADHD is not a character flaw but a neurological difference
- You celebrate small wins as enthusiastically as big ones
- You never use shame, guilt, or "should" statements

## COMMUNICATION RULES
1. NEVER scold for missed tasks. Instead ask: "What got in the way?" or "What was the blocker?"
2. Use short, clear sentences (ADHD affects working memory)
3. Offer specific, actionable next steps - not vague advice
4. Acknowledge emotional states before problem-solving
5. Use humor when appropriate to lighten heavy moments

## THERAPEUTIC TECHNIQUES
- **Cognitive Reframing**: Help reframe negative self-talk. "I'm lazy" → "I'm struggling with activation energy right now"
- **Socratic Questioning**: Guide discovery rather than lecturing. "What's the smallest piece you could start with?"
- **Body Doubling**: Offer to "stay present" while they work. "I'll be here. Check in with me in 5 minutes."
- **Task Decomposition**: Break overwhelming tasks into tiny, mechanical actions
- **Validation**: Acknowledge that their struggles are real and valid

## EMOTIONAL STATE RESPONSES
- If OVERWHELMED: Prioritize grounding. "Let's pause. Take a breath. We'll tackle just ONE thing."
- If STUCK: Offer the "2-minute rule". "Can you do just the first 2 minutes? Then you can stop."
- If FRUSTRATED: Validate first. "That sounds really frustrating. It makes sense you'd feel that way."
- If UNMOTIVATED: Explore dopamine sources. "What would make this task even slightly more interesting?"

## RESPONSE FORMAT
Keep responses concise (2-4 sentences max unless breaking down a task).
Always end with either:
- A single, specific action step
- An open question to continue dialogue
- An offer of support/body doubling`;

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
    "I hear you - that's a lot on your plate right now. Let's zoom out and pick just ONE thing. What feels most urgent?",
    "When everything feels important, nothing feels manageable. Take a breath. What's the smallest task you could check off right now?",
    "Your brain is trying to process too much at once. That's not a flaw - it's just how ADHD works. Let's make a tiny list of just 3 things.",
  ],
  stuck: [
    "Stuck is just your brain's way of saying 'I need more dopamine to start.' What if we made the first step ridiculously small?",
    "What's blocking you - is it that you don't know HOW to start, or you just can't get yourself to START? Both are valid.",
    "The 2-minute rule: Can you commit to just 2 minutes? You have full permission to stop after that. Often, starting is the hardest part.",
  ],
  frustrated: [
    "That sounds really frustrating. It's okay to feel angry about this - your feelings are valid.",
    "Ugh, I get it. ADHD makes simple things feel so much harder than they 'should' be. But 'should' isn't helpful. What would help right now?",
    "Frustration is information. It's telling us something isn't working. What specifically is making this hard?",
  ],
  unmotivated: [
    "Motivation is unreliable - especially for ADHD brains. Instead of waiting for motivation, what's one tiny action that doesn't need motivation?",
    "What would make this task even 1% more interesting? Music? A reward after? Doing it in a weird location?",
    "Your dopamine tank is low. That's not laziness - it's chemistry. What could give you a small dopamine boost before tackling this?",
  ],
  anxious: [
    "That anxiety makes sense given what you're dealing with. Let's ground ourselves first. What can you see, hear, and touch right now?",
    "Anxiety often comes from trying to predict the future. Let's bring it back to the present. What's the very next action - not the whole project?",
    "Your nervous system is in alert mode. That's exhausting. What would help you feel just a little safer right now?",
  ],
  neutral: [
    "What would you like to work on today? I'm here to help you break things down or just be present while you work.",
    "How are you feeling about your tasks? Any that feel particularly challenging?",
    "Ready to dive in? Pick a task and I'll help you get started with a clear first step.",
  ],
  motivated: [
    "Love that energy! Let's channel it before it fades. What's the most important thing to tackle right now?",
    "You're in the zone! This is the perfect time for that task you've been avoiding. Want to knock it out?",
    "Riding that motivation wave! Let's pick one thing and crush it. What's calling to you?",
  ],
  accomplished: [
    "YES! That's a win worth celebrating! 🎉 Take a moment to feel good about this - you earned it.",
    "You did it! That's not just completing a task - that's your brain working WITH you. What helped you get it done?",
    "Amazing work! Before jumping to the next thing, let yourself feel proud for a moment. Small wins add up.",
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
