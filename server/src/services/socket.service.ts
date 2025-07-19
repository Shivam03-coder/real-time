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

      socket.on("request_detailed_stats", (filter: any) => {
        this.handleDetailedStatsRequest(socket, filter);
      });

      socket.on("track_dashboard_action", (data: any) => {
        this.trackDashboardAction(data);
      });

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

  private static async handleDetailedStatsRequest(
    socket: Socket,
    filter: any
  ): Promise<void> {
    try {
      let whereClause: any = {};
      if (filter.country) whereClause.country = filter.country;
      if (filter.page) whereClause.page = filter.page;

      const events = await db.event.findMany({
        where: whereClause,
        orderBy: { timestamp: "desc" },
        take: 100,
      });

      socket.emit("detailed_stats_response", events);
    } catch (error) {
      console.error("Error handling detailed stats request:", error);
    }
  }

  private static trackDashboardAction(data: any): void {
    console.log("Dashboard action tracked:", data);
  }

  public static async processVisitorEvent(
    event: Event,
    userId?: string
  ): Promise<void> {
    try {
      const pipeline = redis.pipeline();

      if (event.type === "pageview") {
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

      if (userId) {
        this.analyticsNamespace
          .to(`user:${userId}`)
          .emit("user_visitor_update", {
            event,
            stats,
          });
      }
    } catch (error) {
      console.error("Error processing visitor event:", error);
    }
  }

  private static async calculateCurrentStats(): Promise<DashboardStats> {
    const [totalActive, totalToday, pagesVisited] = await Promise.all([
      redis.scard("active_sessions"),
      redis.get("total_visits_today").then((val) => parseInt(val || "0")),
      redis.hgetall("page_views").then((val) => val || {}),
    ]);

    return {
      totalActive,
      totalToday,
      pagesVisited: Object.fromEntries(
        Object.entries(pagesVisited).map(([k, v]) => [k, parseInt(v)])
      ),
    };
  }
}

export default SocketServices;
