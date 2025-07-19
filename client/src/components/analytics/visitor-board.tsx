"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Monitor,
  Home,
  Layers,
  ExternalLink,
  Users,
  Activity,
} from "lucide-react";
import { useAppSelector } from "@/store";

export function VisitorDashboard() {
  const { stats, event } = useAppSelector((state) => state.visitor);

  if (!stats || !event) {
    return <p className="text-muted-foreground">No visitor data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      {/* Active Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActive}</div>
          <p className="text-muted-foreground text-xs">Currently browsing</p>
        </CardContent>
      </Card>

      {/* Total Visits Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Visits Today</CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalToday}</div>
          <p className="text-muted-foreground text-xs">Total sessions</p>
        </CardContent>
      </Card>

      {/* Pages Visited */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pages Visited</CardTitle>
          <Layers className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.pagesVisited).map(([page, count]) => (
              <div key={page} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {page === "/home" && (
                    <Home className="text-muted-foreground h-3 w-3" />
                  )}
                  {page === "/dashboard" && (
                    <Monitor className="text-muted-foreground h-3 w-3" />
                  )}
                  {page === "/products" && (
                    <Layers className="text-muted-foreground h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">{page}</span>
                </div>
                <Badge variant="outline">{count} visits</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Event */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Activity</CardTitle>
          <CardDescription>Most recent visitor event</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Globe className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{event.country}</span>
                <Badge variant="outline">{event.device}</Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Viewed <span className="font-medium">{event.page}</span>
              </p>
            </div>
            <div className="text-muted-foreground text-sm">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ExternalLink className="text-muted-foreground h-4 w-4" />
            <div className="text-sm">
              <p className="font-medium">Referrer</p>
              <p className="text-muted-foreground max-w-[300px] truncate">
                {event.referrer}
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="w-fit">
            {event.type}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
