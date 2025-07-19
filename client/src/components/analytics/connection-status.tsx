"use client";

import { useAppSelector } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSocketContext } from "@/providers/socket-provider";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { socketIds, updatedAt } = useAppSelector((state) => state.dashboard);
  const { connectionStatus, errorMessage, reconnect } = useSocketContext();

  const connectedDashboards = socketIds?.length ?? 0;
  const lastUpdated = updatedAt ? new Date(updatedAt) : new Date();

  const statusConfig = {
    Connected: {
      icon: <Wifi className="h-5 w-5 text-green-500" />,
      color: "bg-green-500",
      description: "Connection stable",
      textColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    Reconnecting: {
      icon: <RotateCcw className="h-5 w-5 animate-spin text-yellow-500" />,
      color: "bg-yellow-500",
      description: "Attempting to reconnect...",
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    Disconnected: {
      icon: <WifiOff className="h-5 w-5 text-red-500" />,
      color: "bg-red-500",
      description: errorMessage || "Connection lost",
      textColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    Error: {
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-500",
      description: errorMessage || "Connection error",
      textColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    default: {
      icon: <WifiOff className="h-5 w-5 text-gray-500" />,
      color: "bg-gray-500",
      description: "Connection status unknown",
      textColor: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
  };

  const currentStatus = statusConfig[connectionStatus as keyof typeof statusConfig] || statusConfig.default;

  return (
    <Card className={cn("relative border-0 text-xl shadow-sm", currentStatus.bgColor)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span>Real-Time Connection</span>
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
          <div className="flex items-center gap-1">
            {currentStatus.icon}
            <div className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {currentStatus.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last update: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={reconnect}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {connectedDashboards}
            </span>
            <span className="text-xs text-muted-foreground">
              active {connectedDashboards === 1 ? "dashboard" : "dashboards"}
            </span>
          </div>

          {socketIds?.[0] && (
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  ID: {socketIds[0].slice(0, 8)}...
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Socket ID: {socketIds[0]}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );
}