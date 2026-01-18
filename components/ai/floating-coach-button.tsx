"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import AICoachChat from "@/components/ai/ai-coach-chat";

export default function FloatingCoachButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200 group"
        title="Talk to Nexus - Your AI Coach"
      >
        <Bot size={24} className="group-hover:scale-110 transition-transform" />

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-2xl bg-emerald-400 animate-ping opacity-20" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Need help? Talk to Nexus 🧠
        </div>
      </button>

      {/* AI Coach Modal */}
      <AICoachChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
