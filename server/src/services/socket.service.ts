// src/services/socket.service.ts
import { envs } from "@src/configs/envs.config";
import { Server as HTTPServer } from "http";
import { Namespace, Socket, Server as SocketIoServer } from "socket.io";
import { Event } from "@prisma/client";
import redis from "@src/configs/redis.config";
import { db } from "@src/database";

type DashboardStats = {
  totalActive: number;
  totalToday: number;
  pagesVisited: Record<string, number>;
};

type SessionActivity = {
  sessionId: string;
  currentPage: string;
  journey: string[];
  duration: number;
};

type AlertData = {
  level: "info" | "warning" | "milestone";
  message: string;
  details: any;
};

class SocketServices {
  private static io: SocketIoServer;
  private static analyticsNamespace: Namespace;
  private static connectedSockets: Set<string> = new Set();

  public static init(server: HTTPServer): void {
    this.io = new SocketIoServer(server, {
      cors: {
        origin: envs.CLIENT_APP_URI,
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.analyticsNamespace = this.io.of("/analytics");
    this.setupConnectionHandlers();
  }

  private static setupConnectionHandlers(): void {
    this.analyticsNamespace.on("connection", (socket: Socket) => {
      console.log(`📊 Dashboard connected: ${socket.id}`);
      this.connectedSockets.add(socket.id);
      this.emitDashboardUsersUpdated();

      socket.on("disconnect", () => {
        console.log(`📊 Dashboard disconnected: ${socket.id}`);
        this.connectedSockets.delete(socket.id);
        this.emitDashboardUsersUpdated();
      });
    });
  }

  public static emitVisitorUpdate(event: Event, stats: DashboardStats): void {
    this.analyticsNamespace.emit("visitor_update", {
      type: "visitor_update",
      data: {
        event,
        stats,
      },
    });
  }

  private static emitDashboardUsersUpdated(): void {
    const totalConnected = this.connectedSockets.size;
    this.analyticsNamespace.emit("user_connected", {
      type: "user_connected",
      data: {
        totalDashboards: totalConnected,
        connectedAt: new Date().toISOString(),
      },
    });
  }

  public static emitSessionActivity(session: SessionActivity): void {
    this.analyticsNamespace.emit("session_activity", {
      type: "session_activity",
      data: session,
    });
  }

  public static emitAlert(alert: AlertData): void {
    this.analyticsNamespace.emit("alert", {
      type: "alert",
      data: alert,
    });
  }

  // FOR PROCESS UPDATE

  public static async processVisitorEvent(event: Event): Promise<void> {
    try {
      const pipeline = redis.pipeline();

      if (event.type === "page_view") {
        pipeline.sadd("active_sessions", event.sessionId);
        pipeline.hincrby("page_views", event.page, 1);
        pipeline.incr("total_visits_today");
        pipeline.lpush(`session:${event.sessionId}:journey`, event.page);

        if (!(await redis.exists(`session:${event.sessionId}:start`))) {
          pipeline.set(
            `session:${event.sessionId}:start`,
            Date.now().toString()
          );
        }
      } else if (event.type === "session_end") {
        pipeline.srem("active_sessions", event.sessionId);
      }

      await pipeline.exec();

      const stats = await this.calculateCurrentStats();

      this.emitVisitorUpdate(event, stats);

      this.analyticsNamespace.emit("visitor_update", {
        type: "visitor_update",
        data: {
          event,
          stats,
        },
      });

      const [journey, start] = await Promise.all([
        redis.lrange(`session:${event.sessionId}:journey`, 0, -1),
        redis.get(`session:${event.sessionId}:start`),
      ]);

      const duration = start
        ? Math.floor((Date.now() - Number(start)) / 1000)
        : 0;

      this.emitSessionActivity({
        sessionId: event.sessionId,
        currentPage: event.page,
        journey,
        duration,
      });
    } catch (error) {
      console.error("Error processing visitor event:", error);
    }
  }

  // FOR VISITORS
  public static async calculateCurrentStats() {
    const [activeSessionCount, totalVisitsToday, pageViews] = await Promise.all(
      [
        redis.scard("active_sessions"),
        redis.get("total_visits_today"),
        redis.hgetall("page_views"),
      ]
    );

    return {
      totalActive: activeSessionCount,
      totalToday: Number(totalVisitsToday || 0),
      pagesVisited: Object.entries(pageViews || {}).reduce(
        (acc, [page, count]) => {
          acc[page] = Number(count);
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }
}

export default SocketServices;
