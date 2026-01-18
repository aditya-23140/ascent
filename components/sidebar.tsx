"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/context/app-context";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Trophy,
  User,
  Zap,
  Sparkles,
  Brain,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "emerald" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, color: "violet" },
  { href: "/pomodoro", label: "Pomodoro", icon: Clock, color: "sky" },
  { href: "/ai", label: "AI Coach", icon: Brain, color: "rose" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, color: "amber" },
  { href: "/profile", label: "Profile", icon: User, color: "emerald" },
];

const colorClasses = {
  emerald: {
    active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    hover: "hover:bg-emerald-500/10 hover:text-emerald-400",
    tooltip: "border-emerald-500/30 text-emerald-300",
  },
  violet: {
    active: "bg-violet-500/20 border-violet-500/50 text-violet-400",
    hover: "hover:bg-violet-500/10 hover:text-violet-400",
    tooltip: "border-violet-500/30 text-violet-300",
  },
  sky: {
    active: "bg-sky-500/20 border-sky-500/50 text-sky-400",
    hover: "hover:bg-sky-500/10 hover:text-sky-400",
    tooltip: "border-sky-500/30 text-sky-300",
  },
  amber: {
    active: "bg-amber-500/20 border-amber-500/50 text-amber-400",
    hover: "hover:bg-amber-500/10 hover:text-amber-400",
    tooltip: "border-amber-500/30 text-amber-300",
  },
  rose: {
    active: "bg-rose-500/20 border-rose-500/50 text-rose-400",
    hover: "hover:bg-rose-500/10 hover:text-rose-400",
    tooltip: "border-rose-500/30 text-rose-300",
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { getCurrentUser } = useAppState();
  const user = getCurrentUser();

  return (
    <aside className="fixed left-0 top-0 h-screen w-14 hover:w-64 bg-card border-r border-border z-40 flex flex-col transition-all duration-300 ease-in-out group/sidebar overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-3 min-h-[72px]">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
          <h1 className="text-lg font-bold text-foreground">Focus Nexus</h1>
          <p className="text-xs text-muted-foreground">Level up productivity</p>
        </div>
      </div>

      {/* User info - only visible when expanded */}
      {user && (
        <div className="mx-2 my-3 p-3 rounded-xl bg-white/[0.02] border border-border opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
          <p className="font-semibold text-foreground text-sm truncate">
            {user.name}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Level {user.level}
            </span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Zap size={12} />
              {user.score} pts
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all"
              style={{ width: `${(user.currentXP / 1000) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {user.currentXP}/1000 XP
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const colors = colorClasses[item.color as keyof typeof colorClasses];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border ${
                isActive
                  ? colors.active
                  : `text-muted-foreground ${colors.hover} border-transparent`
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
        <p className="text-xs text-muted-foreground text-center whitespace-nowrap">
          Focus Nexus v2.0
        </p>
      </div>
    </aside>
  );
}
