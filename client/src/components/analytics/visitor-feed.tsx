"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import type { Visitor } from "@/types/analytics";

interface VisitorFeedProps {
  visitors: Visitor[];
  selectedCountry?: string;
}

export function VisitorFeed({ visitors, selectedCountry }: VisitorFeedProps) {
  const filteredVisitors = selectedCountry 
    ? visitors.filter(v => v.country === selectedCountry)
    : visitors;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live Visitor Feed</CardTitle>
        <p className="text-sm text-muted-foreground">
          Newest first {selectedCountry && `• Filtered by ${selectedCountry}`}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {filteredVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${visitor.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{visitor.country}</span>
                      <Badge variant="outline" className="text-xs">
                        {visitor.page}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(visitor.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {visitor.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}