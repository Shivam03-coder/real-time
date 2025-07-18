"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, RotateCcw } from "lucide-react";

interface ConnectionStatusProps {
  status: 'Connected' | 'Reconnecting' | 'Disconnected';
  connectedDashboards: number;
}

export function ConnectionStatus({ status, connectedDashboards }: ConnectionStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'Connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'Reconnecting':
        return <RotateCcw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'Disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Connected':
        return 'bg-green-500';
      case 'Reconnecting':
        return 'bg-yellow-500';
      case 'Disconnected':
        return 'bg-red-500';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm font-medium">{status}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {connectedDashboards} dashboard{connectedDashboards !== 1 ? 's' : ''} connected
        </p>
      </CardContent>
    </Card>
  );
}