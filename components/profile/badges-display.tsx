"use client";

import type { Badge } from "@/context/app-context";
import { ICON_MAP } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BadgesDisplayProps {
  badges: Badge[];
}

export default function BadgesDisplay({ badges }: BadgesDisplayProps) {
  return (
    <Card className="border-purple-500/30 bg-black/40">
      <CardHeader>
        <CardTitle className="text-lg">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-purple-500/20 to-orange-500/10 rounded-lg p-4 text-center border border-purple-500/30 hover:border-purple-500/60 hover:from-purple-500/30 transition-all cursor-pointer"
              >
                <div className="flex justify-center mb-2">
                  {(() => {
                    const Icon = ICON_MAP[badge.icon];
                    return <Icon className="w-8 h-8 text-purple-400" />;
                  })()}
                </div>
                <p className="text-sm font-semibold text-white">{badge.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {badge.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-400">
                No badges unlocked yet. Keep working!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
