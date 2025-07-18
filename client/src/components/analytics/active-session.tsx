"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Session } from "@/types/analytics";
import { formatDistanceToNow } from "date-fns";
import { MousePointer } from "lucide-react";

interface ActiveSessionsProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

export function ActiveSessions({ sessions, onSessionClick }: ActiveSessionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Sessions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on a session to view journey
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {sessions.map((session) => (
              <Button
                key={session.sessionId}
                variant="ghost"
                className="w-full justify-start p-3 h-auto"
                onClick={() => onSessionClick(session)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{session.country}</span>
                        <Badge variant="outline" className="text-xs">
                          {session.pages[session.pages.length - 1]?.page || '/'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.pages.length} page{session.pages.length !== 1 ? 's' : ''} • 
                        {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}