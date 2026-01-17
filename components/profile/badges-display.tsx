"use client";

import type { Badge } from "@/context/app-context";
import { ICON_MAP } from "@/context/app-context";
import { Award } from "lucide-react";

interface BadgesDisplayProps {
  badges: Badge[];
}

export default function BadgesDisplay({ badges }: BadgesDisplayProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Achievements</h2>
            <p className="text-sm text-muted-foreground">
              Unlock badges by completing challenges
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-border hover:bg-white/[0.04] hover:border-violet-500/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                    {(() => {
                      const Icon = ICON_MAP[badge.icon];
                      return <Icon className="w-6 h-6 text-violet-400" />;
                    })()}
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground text-center">
                  {badge.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center line-clamp-2">
                  {badge.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-muted-foreground">
                No badges unlocked yet. Keep working!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
