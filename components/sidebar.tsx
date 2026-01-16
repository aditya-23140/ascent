"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Trophy,
  User,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/pomodoro", label: "Pomodoro", icon: Clock },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { getCurrentUser } = useAppState();
  const [isExpanded, setIsExpanded] = useState(false);
  const user = getCurrentUser();

  return (
    <>
      {/* Thin icon sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-black via-black/95 to-black border-r border-purple-500/20 z-40 flex flex-col items-center py-6 gap-6 mr-10">
        {/* Icon buttons */}
        <div className="flex flex-col gap-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-br from-purple-500/40 to-purple-600/20 border border-purple-500/50 text-purple-400"
                    : "text-gray-400 hover:text-gray-300 hover:bg-purple-500/10 border border-transparent"
                }`}
              >
                <Icon size={20} />
                {/* Tooltip on hover */}
                <div className="absolute left-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-all"
        >
          <ChevronRight
            size={20}
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      {/* Expanded sidebar panel */}
      <div
        className={`fixed left-20 top-0 h-screen w-56 bg-gradient-to-b from-black via-black/98 to-black border-r border-purple-500/20 z-39 transition-all duration-300 ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-purple-500/20">
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
              Focus Nexus
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Level up your productivity
            </p>
          </div>

          {/* User info */}
          {user && (
            <div className="m-4 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-orange-500/5 to-green-500/10 border border-purple-500/20">
              <p className="text-sm font-semibold text-gray-200">{user.name}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">
                  Level {user.level}
                </span>
                <span className="text-xs font-bold text-orange-400">
                  {user.score} pts
                </span>
              </div>
              <div className="w-full bg-purple-500/10 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(user.currentXP / 1000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {user.currentXP}/1000 XP
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-purple-500/20 p-4 mt-auto">
            <p className="text-xs text-gray-500 text-center">
              Focus Nexus v2.0
            </p>
          </div>
        </div>
      </div>

      {/* Overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
