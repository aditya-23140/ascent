"use client";

import { useState } from "react";
import {
  Brain,
  Bot,
  Zap,
  Sparkles,
  MessageCircle,
  Lightbulb,
  Heart,
  Battery,
  Target,
  ArrowRight,
} from "lucide-react";
import AICoachChat from "@/components/ai/ai-coach-chat";
import EnergyScheduler from "@/components/ai/energy-scheduler";

export default function AIHubPage() {
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const features = [
    {
      id: "coach",
      title: "Nexus Coach",
      subtitle: "Compassionate AI Companion",
      description:
        "Your understanding accountability partner that detects emotional states and uses therapeutic techniques to help you overcome blocks.",
      icon: Bot,
      color: "emerald",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      features: [
        "Emotional state detection",
        "CBT-based reframing",
        "Body doubling support",
        "Non-judgmental guidance",
      ],
      action: () => setIsCoachOpen(true),
      actionLabel: "Start Conversation",
    },
    {
      id: "scheduler",
      title: "Energy Scheduler",
      subtitle: "Spoon Theory Planning",
      description:
        "Schedule your day based on energy levels, not just time. Optimizes task placement for your peak focus periods.",
      icon: Battery,
      color: "amber",
      gradient: "from-amber-500/20 to-amber-500/5",
      features: [
        "Energy-aware scheduling",
        "Peak hours optimization",
        "Context switch minimization",
        "Recovery suggestions",
      ],
      action: () => setIsSchedulerOpen(true),
      actionLabel: "Plan My Day",
    },
  ];

  const tips = [
    {
      icon: Brain,
      title: "Task Decomposition",
      description:
        'Use the "Magic Wand" button on any task to break it into tiny, doable steps.',
      color: "violet",
    },
    {
      icon: Heart,
      title: "Self-Compassion",
      description:
        "The coach never judges. Missed a task? It'll help you understand what got in the way.",
      color: "rose",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description:
        "Track your spoons throughout the day. It's okay to have low-energy days.",
      color: "amber",
    },
    {
      icon: Target,
      title: "2-Minute Rule",
      description:
        "Can't start? Commit to just 2 minutes. Often, starting is the hardest part.",
      color: "sky",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-violet-500/20">
            <Brain size={28} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              AI Executive Function
              <Sparkles size={20} className="text-amber-400" />
            </h1>
            <p className="text-muted-foreground">
              Your prosthetic frontal lobe for planning, regulation, and
              initiation
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`relative overflow-hidden rounded-2xl border border-${feature.color}-500/20 bg-gradient-to-br ${feature.gradient} p-6`}
            >
              {/* Background decoration */}
              <div
                className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-${feature.color}-500/10 blur-2xl`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-${feature.color}-500/20 border border-${feature.color}-500/30`}
                  >
                    <Icon size={24} className={`text-${feature.color}-400`} />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {feature.title}
                </h2>
                <p className={`text-sm text-${feature.color}-400 mb-3`}>
                  {feature.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {feature.features.map((f, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/80 flex items-center gap-2"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${feature.color}-400`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={feature.action}
                  className={`w-full px-4 py-3 rounded-xl font-medium bg-${feature.color}-500 text-white hover:bg-${feature.color}-600 transition-colors flex items-center justify-center gap-2`}
                >
                  {feature.actionLabel}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Helps Section */}
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-400" />
              ADHD-Specific Strategies
            </h2>
            <p className="text-sm text-muted-foreground">
              Built on research-backed techniques for neurodivergent brains
            </p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg bg-${tip.color}-500/10 shrink-0`}
                    >
                      <Icon size={16} className={`text-${tip.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Understanding Section */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/30 shrink-0">
              <MessageCircle size={24} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Why This Approach?
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    ADHD isn&apos;t a character flaw
                  </strong>{" "}
                  - it&apos;s a neurological difference that affects executive
                  functions like planning, initiation, and emotional regulation.
                </p>
                <p>
                  Standard productivity tools assume constant motivation and
                  energy. They don&apos;t account for{" "}
                  <strong className="text-foreground">
                    the activation energy
                  </strong>{" "}
                  needed to start tasks or the{" "}
                  <strong className="text-foreground">dopamine deficit</strong>{" "}
                  that makes &quot;just do it&quot; advice useless.
                </p>
                <p>
                  These AI tools are designed as a{" "}
                  <strong className="text-foreground">
                    prosthetic frontal lobe
                  </strong>{" "}
                  - handling the regulation, planning, and initiation functions
                  that your brain finds challenging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AICoachChat isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
      <EnergyScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </div>
  );
}
