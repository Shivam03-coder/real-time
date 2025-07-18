"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye } from "lucide-react";

interface VisitorCounterProps {
  activeVisitors: number;
  totalVisitorsToday: number;
}

export function VisitorCounter({ activeVisitors, totalVisitorsToday }: VisitorCounterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeVisitors}</div>
          <p className="text-xs text-muted-foreground">Currently browsing</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors Today</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisitorsToday}</div>
          <p className="text-xs text-muted-foreground">Since midnight</p>
        </CardContent>
      </Card>
    </div>
  );
}