"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Session } from "@/types/analytics";
import { formatDistanceToNow } from "date-fns";
import { Clock, MapPin, MousePointer } from "lucide-react";

interface SessionDetailsProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

export function SessionDetails({ session, open, onClose }: SessionDetailsProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Visitor Journey - {session.sessionId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{session.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Started {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
              </span>
            </div>
            {session.isActive && (
              <Badge variant="secondary">Active</Badge>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Page Journey</h4>
            {session.pages.map((page, index) => (
              <Card key={index} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <Badge variant="outline">{page.page}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(page.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {page.duration && (
                      <div className="text-right">
                        <span className="text-sm font-medium">{page.duration}s</span>
                        <p className="text-xs text-muted-foreground">time on page</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}