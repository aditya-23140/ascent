// Gemini AI Service - Integration with Google's Gemini Flash 2.5
// Provides LLM capabilities for AI Coach and Task Decomposition

import {
  COACH_SYSTEM_PROMPT,
  generateCoachingPrompt,
  type EmotionalState,
  type DecomposedTask,
  getFallbackResponse,
  decomposeTask as localDecomposeTask,
} from "./ai-coach";

// Gemini API configuration
// Using gemini-2.5-flash - the latest model with free tier support
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
    finishReason: string;
  }[];
  error?: {
    message: string;
    code: number;
  };
}

// Configuration for different AI tasks
export const AI_CONFIG = {
  coach: {
    temperature: 0.8, // Higher for more creative, empathetic responses
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 500, // Keep responses concise for ADHD
  },
  decomposer: {
    temperature: 0.4, // Slightly higher for more varied outputs
    topP: 0.85,
    topK: 30,
    maxOutputTokens: 2000, // Increased to prevent truncation
  },
  scheduler: {
    temperature: 0.2, // Very low for analytical tasks
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 800,
  },
};

// Build conversation history for context
function buildConversationHistory(
  messages: { role: "user" | "coach"; content: string }[]
): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === "coach" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

// Call Gemini API
async function callGemini(
  prompt: string,
  config: (typeof AI_CONFIG)["coach"],
  conversationHistory?: GeminiMessage[],
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!key) {
    throw new Error("Gemini API key not configured");
  }

  const contents: GeminiMessage[] = conversationHistory
    ? [
        ...conversationHistory,
        { role: "user" as const, parts: [{ text: prompt }] },
      ]
    : [{ role: "user" as const, parts: [{ text: prompt }] }];

  const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: COACH_SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        maxOutputTokens: config.maxOutputTokens,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Gemini API request failed");
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No response generated");
  }

  return data.candidates[0].content.parts[0].text;
}

// AI Coach - Get coaching response
export async function getCoachResponse(
  userMessage: string,
  emotionalState: EmotionalState,
  conversationHistory?: { role: "user" | "coach"; content: string }[],
  taskContext?: {
    taskTitle?: string;
    taskDescription?: string;
    subtasks?: string[];
    isOverdue?: boolean;
  }
): Promise<string> {
  try {
    const prompt = generateCoachingPrompt(
      userMessage,
      taskContext,
      emotionalState
    );

    const history = conversationHistory
      ? buildConversationHistory(conversationHistory)
      : undefined;

    const response = await callGemini(prompt, AI_CONFIG.coach, history);
    return response;
  } catch (error) {
    console.error("Gemini API error, using fallback:", error);
    // Fallback to pre-built responses if API fails
    return getFallbackResponse(emotionalState);
  }
}

// Task Decomposer - Break down tasks using AI
export async function decomposeTaskWithAI(
  taskTitle: string,
  context?: string
): Promise<DecomposedTask> {
  try {
    // Concise prompt to reduce token usage
    const userPrompt = `Break down this task into 5-6 actionable subtasks:

TASK: "${taskTitle}"${context ? ` (${context})` : ""}

Return ONLY a JSON array with short, specific actions. Keep titles under 50 characters.
Example format: [{"title":"Open browser","estimatedMinutes":2,"energyCost":1}]`;

    // Simplified system prompt
    const decompositionSystemPrompt = `You break tasks into small steps for ADHD users. Rules:
- 5-6 subtasks max, short titles (under 50 chars)
- Vary times: quick (2-5min), medium (8-15min), longer (15-20min)
- Start with easiest tasks first
- energyCost: 1=trivial, 2=easy, 3=moderate, 4=hard, 5=intense
- Return ONLY valid JSON array, no markdown, no extra text`;

    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) {
      throw new Error("API key not configured");
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: {
          parts: [{ text: decompositionSystemPrompt }],
        },
        generationConfig: {
          temperature: AI_CONFIG.decomposer.temperature,
          topP: AI_CONFIG.decomposer.topP,
          topK: AI_CONFIG.decomposer.topK,
          maxOutputTokens: AI_CONFIG.decomposer.maxOutputTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from AI");
    }
    const jsonText = data.candidates[0].content.parts[0].text;

    if (!jsonText || jsonText.trim() === "") {
      throw new Error("Empty response from AI");
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedJson = jsonText.trim();

    // Remove markdown code blocks
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.slice(7);
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.slice(3);
    }
    if (cleanedJson.endsWith("```")) {
      cleanedJson = cleanedJson.slice(0, -3);
    }
    cleanedJson = cleanedJson.trim();

    // Try to extract JSON array if there's extra text
    const jsonArrayMatch = cleanedJson.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch) {
      cleanedJson = jsonArrayMatch[0];
    }

    // Handle truncated JSON - try to fix incomplete arrays
    if (!cleanedJson.endsWith("]")) {
      console.warn("JSON appears truncated, attempting to fix...");
      // Find the last complete object
      const lastCompleteObjMatch = cleanedJson.match(
        /^([\s\S]*\})\s*,?\s*[\s\S]*$/
      );
      if (lastCompleteObjMatch) {
        cleanedJson = lastCompleteObjMatch[1] + "]";
      } else {
        // Can't salvage it, fall back
        throw new Error("Truncated JSON response");
      }
    }

    // Parse the JSON response
    let subtasks: {
      title: string;
      estimatedMinutes: number;
      energyCost: number;
    }[];

    try {
      subtasks = JSON.parse(cleanedJson);
    } catch {
      console.error("JSON parse error. Raw response:", jsonText);
      console.error("Cleaned response:", cleanedJson);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate the structure
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
      throw new Error("Invalid subtasks format from AI");
    }

    // Ensure each subtask has required fields with defaults
    subtasks = subtasks.map((st, index) => ({
      title: st.title || `Step ${index + 1}`,
      estimatedMinutes:
        typeof st.estimatedMinutes === "number" ? st.estimatedMinutes : 10,
      energyCost: typeof st.energyCost === "number" ? st.energyCost : 2,
    }));

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
  } catch (error) {
    console.error("AI decomposition failed, using local fallback:", error);
    // Fallback to local pattern matching
    return localDecomposeTask(taskTitle);
  }
}

// Energy-aware scheduling suggestions
export async function getSchedulingSuggestions(
  tasks: { title: string; priority: string; energyCost: number }[],
  currentEnergy: number,
  peakHours: string[]
): Promise<string> {
  try {
    const prompt = `Given my current energy level of ${currentEnergy}/100 and my peak focus hours at ${peakHours.join(
      ", "
    )}, help me prioritize these tasks:

${tasks
  .map(
    (t, i) =>
      `${i + 1}. "${t.title}" - Priority: ${t.priority}, Energy needed: ${
        t.energyCost
      }`
  )
  .join("\n")}

Provide a brief, actionable scheduling suggestion (2-3 sentences max). Consider:
- Match high-energy tasks to peak hours
- Start with easier tasks if energy is low
- Don't overcommit if energy is below 50%`;

    const response = await callGemini(prompt, AI_CONFIG.scheduler);
    return response;
  } catch (error) {
    console.error("Scheduling suggestion failed:", error);
    return currentEnergy < 50
      ? "Your energy is low. Focus on just 1-2 easy tasks, then take a break."
      : "You have good energy! Tackle your most important task during your peak hours.";
  }
}

// Body doubling check-in messages
export async function getBodyDoublingMessage(
  minutesElapsed: number,
  taskTitle: string
): Promise<string> {
  const checkInPrompts = [
    `${minutesElapsed} minutes into "${taskTitle}". Quick check-in - how's it going? Keep up the great work! 💪`,
    `You've been working on "${taskTitle}" for ${minutesElapsed} minutes! That's real progress. Need anything?`,
    `Check-in time! ${minutesElapsed} minutes of focus on "${taskTitle}". You're doing amazing. Take a breath if you need one.`,
    `Hey! ${minutesElapsed} minutes in. Just here, working alongside you on "${taskTitle}". You've got this! 🌟`,
  ];

  return checkInPrompts[Math.floor(Math.random() * checkInPrompts.length)];
}

// Motivational nudge when stuck
export async function getMotivationalNudge(
  taskTitle: string,
  stuckDuration: number
): Promise<string> {
  try {
    const prompt = `The user has been stuck on "${taskTitle}" for ${stuckDuration} minutes. Generate a single, warm, non-judgmental motivational nudge that:
1. Validates their struggle
2. Offers ONE tiny next step
3. Uses ADHD-friendly language (no shame, no "just do it")

Keep it to 2 sentences max.`;

    const response = await callGemini(prompt, AI_CONFIG.coach);
    return response;
  } catch {
    return `Stuck on "${taskTitle}"? That's okay - it happens. What if you just did the tiniest piece? Even 30 seconds counts.`;
  }
}
