"use client";

import { useAppSelector } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSocketContext } from "@/providers/socket-provider";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { totalDashboards, connectedAt } = useAppSelector(
    (state) => state.dashboard,
  );
  const { connectionStatus, errorMessage, reconnect } = useSocketContext();

  const statusConfig = {
    Connected: {
      icon: <Wifi className="h-5 w-5 text-green-500" />,
      description: "Connection stable",
      textColor: "text-green-500",
      bgColor: "bg-green-500/10",
      dotColor: "bg-green-500",
    },
    Reconnecting: {
      icon: <RotateCcw className="h-5 w-5 animate-spin text-yellow-500" />,
      description: "Attempting to reconnect...",
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      dotColor: "bg-yellow-500",
    },
    Disconnected: {
      icon: <WifiOff className="h-5 w-5 text-red-500" />,
      description: errorMessage || "Connection lost",
      textColor: "text-red-500",
      bgColor: "bg-red-500/10",
      dotColor: "bg-red-500",
    },
    Error: {
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      description: errorMessage || "Connection error",
      textColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      dotColor: "bg-orange-500",
    },
    default: {
      icon: <WifiOff className="h-5 w-5 text-gray-500" />,
      description: "Connection status unknown",
      textColor: "text-gray-500",
      bgColor: "bg-gray-500/10",
      dotColor: "bg-gray-500",
    },
  };

  const currentStatus =
    statusConfig[connectionStatus as keyof typeof statusConfig] ||
    statusConfig.default;

  return (
    <Card
      className={cn(
        "relative border-0 text-xl h-[200px] shadow-sm",
        currentStatus.bgColor,
      )}
    >
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          Real-Time Connection
          <span className={cn("text-xs font-normal", currentStatus.textColor)}>
            {connectionStatus.toLowerCase()}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {errorMessage && (
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {currentStatus.icon}
          <div className={`h-2 w-2 rounded-full ${currentStatus.dotColor}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              {currentStatus.description}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Last connected:{" "}
              {connectedAt ? new Date(connectedAt).toLocaleTimeString() : "N/A"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reconnect}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{totalDashboards}</span>
            <span className="text-muted-foreground text-xs">
              active {totalDashboards === 1 ? "dashboard" : "dashboards"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
