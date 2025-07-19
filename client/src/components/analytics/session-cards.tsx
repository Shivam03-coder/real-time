// components/SessionCards.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { TimerIcon, MousePointerClick, Map } from "lucide-react";

export default function SessionCards() {
  const sessions = useAppSelector((state) => state.session_activity.sessions);
  const sessionList = Object.values(sessions);

  const session = sessionList[0];

  if (!session) {
    return <p className="text-muted-foreground text-sm">No session data</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TimerIcon className="h-5 w-5" /> Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{session.duration}s</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MousePointerClick className="h-5 w-5" /> Current Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{session.currentPage}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Map className="h-5 w-5" /> Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm break-words">
            {session.journey.join(" → ")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
