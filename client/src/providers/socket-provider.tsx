"use client";

import { useAppToasts } from "@/hooks/use-app-toast";
import { useAppDispatch } from "@/store";
import { setDashboardStatus } from "@/store/app-state/dashboard-slice";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface NotificationPayloadType {
  message: string;
}

interface OnlineDashboardEvent {
  userId: string;
  socketId: string;
  totalOnline: number;
}

type SocketContextType = {
  socket: Socket | null;
  connectionStatus: "Connected" | "Reconnecting" | "Disconnected" | "Error";
  errorMessage?: string;
  reconnect: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectionStatus: "Disconnected",
  reconnect: () => {},
});

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connected" | "Reconnecting" | "Disconnected" | "Error"
  >("Disconnected");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const { SuccessToast, ErrorToast, WarningToast } = useAppToasts();
  const dispatch = useAppDispatch();

  const handleReconnect = () => {
    if (socketRef.current) {
      setConnectionStatus("Reconnecting");
      socketRef.current.connect();
    }
  };

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER as string, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setConnectionStatus("Connected");

      socketInstance.emit("dashboard_connected", {
        socketId: socketInstance.id,
      });

      SuccessToast({
        title: "📊 Connected to Analytics Engine",
        description: "Real-time insights are now live.",
      });
    });

    socketInstance.on("dashboard_users_updated", (data) => {
      dispatch(setDashboardStatus(data));
      socketInstance.on("dashboard_users_updated", (data) => {
        dispatch(setDashboardStatus(data));
        SuccessToast({
          title: "👥 New User Connected",
          description: "A user has joined the dashboard.",
        });
      });
    });

    socketInstance.on("disconnect", (reason: string) => {
      setConnectionStatus("Disconnected");

      socketInstance.emit("dashboard_disconnected", {
        socketId: socketInstance.id,
      });

      ErrorToast({
        title: "📴 Disconnected from Analytics",
        description: `Disconnected: ${reason}`,
      });
    });

    socketInstance.on("reconnect", () => {
      setConnectionStatus("Connected");
      SuccessToast({
        title: "🔌 Reconnected",
        description: "Restored connection to analytics engine.",
      });
    });

    socketInstance.on("reconnect_attempt", () => {
      setConnectionStatus("Reconnecting");
    });

    socketInstance.on("reconnect_error", (error) => {
      setConnectionStatus("Error");
      setErrorMessage(error.message);
    });

    socketInstance.on("connect_error", (error) => {
      setConnectionStatus("Error");
      setErrorMessage(error.message);
      ErrorToast({
        title: "🚫 Analytics Connection Failed",
        description: "Unable to connect to the real-time server.",
      });
    });

    socketInstance.on("notification", (payload: NotificationPayloadType) => {
      SuccessToast({
        title: "🔔 New Notification",
        description: payload.message,
      });
    });

    socketInstance.on("user_connected", (data: OnlineDashboardEvent) => {
      WarningToast({
        title: "🟢 New Dashboard Online",
        description: `User ${data.userId} joined. Total Online: ${data.totalOnline}`,
      });
    });

    socketInstance.on("user_disconnected", (data: OnlineDashboardEvent) => {
      WarningToast({
        title: "🔴 Dashboard Offline",
        description: `User ${data.userId} left. Total Online: ${data.totalOnline}`,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        console.log("🧹 Socket cleanup on unmount");
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus,
        errorMessage,
        reconnect: handleReconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
