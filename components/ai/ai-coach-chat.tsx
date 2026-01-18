"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Bot, Send, Sparkles, Loader2, Heart, Wand2, X } from "lucide-react";
import {
  type CoachMessage,
  type EmotionalState,
  detectEmotionalState,
  getFallbackResponse,
} from "@/lib/ai-coach";

interface AICoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  taskContext?: {
    taskTitle?: string;
    taskDescription?: string;
    subtasks?: string[];
  };
}

const EMOTIONAL_COLORS: Record<EmotionalState, string> = {
  overwhelmed: "text-rose-400",
  stuck: "text-amber-400",
  frustrated: "text-orange-400",
  unmotivated: "text-gray-400",
  anxious: "text-violet-400",
  neutral: "text-sky-400",
  motivated: "text-emerald-400",
  accomplished: "text-yellow-400",
};

const EMOTIONAL_LABELS: Record<EmotionalState, string> = {
  overwhelmed: "😰 Overwhelmed",
  stuck: "🧊 Stuck",
  frustrated: "😤 Frustrated",
  unmotivated: "😑 Unmotivated",
  anxious: "😟 Anxious",
  neutral: "😊 Neutral",
  motivated: "🔥 Motivated",
  accomplished: "🎉 Accomplished",
};

export default function AICoachChat({
  isOpen,
  onClose,
  taskContext,
}: AICoachChatProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: "welcome",
      role: "coach",
      content:
        "Hey there! I'm Nexus, your ADHD coach. 🧠✨ I'm here to help you break through blocks, tackle overwhelming tasks, or just be present while you work. What's on your mind?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute detected emotion from input (no state needed)
  const detectedEmotion = useMemo<EmotionalState>(() => {
    if (input.length > 10) {
      return detectEmotionalState(input);
    }
    return "neutral";
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: CoachMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      emotionalState: detectedEmotion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response with fallback
    // In production, this would call an actual LLM API
    setTimeout(() => {
      const coachResponse: CoachMessage = {
        id: `coach_${Date.now()}`,
        role: "coach",
        content: getFallbackResponse(detectedEmotion),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const quickPrompts = [
    { label: "I'm stuck", emotion: "stuck" as EmotionalState },
    { label: "Feeling overwhelmed", emotion: "overwhelmed" as EmotionalState },
    { label: "Need motivation", emotion: "unmotivated" as EmotionalState },
    { label: "Just did something!", emotion: "accomplished" as EmotionalState },
  ];

  const handleQuickPrompt = (label: string) => {
    setInput(label);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div className="relative w-full max-w-lg h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-emerald-500/10 via-violet-500/10 to-sky-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Bot size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                Nexus
                <Sparkles size={14} className="text-amber-400" />
              </h2>
              <p className="text-xs text-muted-foreground">Your ADHD Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        {/* Task Context Banner */}
        {taskContext?.taskTitle && (
          <div className="px-4 py-2 bg-violet-500/10 border-b border-violet-500/20 flex items-center gap-2">
            <Wand2 size={14} className="text-violet-400" />
            <span className="text-xs text-violet-300">
              Working on: <strong>{taskContext.taskTitle}</strong>
            </span>
          </div>
        )}
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-foreground"
                    : "bg-white/5 border border-white/10 text-foreground"
                }`}
              >
                {message.role === "coach" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Heart size={12} className="text-rose-400" />
                    <span className="text-xs text-muted-foreground">Nexus</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.emotionalState &&
                  message.emotionalState !== "neutral" && (
                    <div
                      className={`text-xs mt-2 ${
                        EMOTIONAL_COLORS[message.emotionalState]
                      }`}
                    >
                      {EMOTIONAL_LABELS[message.emotionalState]}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Loader2
                    size={14}
                    className="animate-spin text-emerald-400"
                  />
                  <span className="text-sm text-muted-foreground">
                    Nexus is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>{" "}
        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-border/50 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => handleQuickPrompt(prompt.label)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors whitespace-nowrap"
            >
              {prompt.label}
            </button>
          ))}
        </div>
        {/* Emotion Indicator */}
        {detectedEmotion !== "neutral" && input.length > 0 && (
          <div className="px-4 py-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sensing:</span>
            <span
              className={`text-xs font-medium ${EMOTIONAL_COLORS[detectedEmotion]}`}
            >
              {EMOTIONAL_LABELS[detectedEmotion]}
            </span>
          </div>
        )}
        {/* Input Area */}
        <div className="p-4 border-t border-border bg-white/[0.02]">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tell me what's on your mind..."
                rows={2}
                className="w-full bg-white/5 text-foreground px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
