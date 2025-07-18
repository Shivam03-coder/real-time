// src/services/socket.service.ts
import { envs } from "@src/configs/envs.config";
import redis from "@src/configs/redis.config";
import { Server as HTTPServer } from "http";
import { Namespace, Socket, Server as SocketIoServer } from "socket.io";
import { Event } from "@prisma/client";
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

class SocketServices {
  private static io: SocketIoServer;
  private static analyticsNamespace: Namespace;
  private static adminNamespace: Namespace;

  public static init(server: HTTPServer): void {
    this.io = new SocketIoServer(server, {
      cors: {
        origin: envs.CLIENT_APP_URI,
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.analyticsNamespace = this.io.of("/analytics");
    this.adminNamespace = this.io.of("/admin");

    this.setupConnectionHandlers();
    this.setupPeriodicTasks();
  }

  private static setupConnectionHandlers(): void {
    this.analyticsNamespace.on("connection", (socket: Socket) => {
      console.log(`📊 Analytics dashboard connected: ${socket.id}`);

      // Track connected dashboards
      redis.sadd("connected_dashboards", socket.id);
      this.emitDashboardCount();

      // Handle dashboard events
      socket.on("request_detailed_stats", (filter: any) => {
        this.handleDetailedStatsRequest(socket, filter);
      });

      socket.on("track_dashboard_action", (data: any) => {
        this.trackDashboardAction(socket, data);
      });

      socket.on("disconnect", () => {
        redis.srem("connected_dashboards", socket.id);
        this.emitDashboardCount();
        console.log(`📊 Analytics dashboard disconnected: ${socket.id}`);
      });
    });
  }

  private static setupPeriodicTasks(): void {
    // Check for visitor spikes every minute
    setInterval(async () => {
      const lastMinuteCount = await this.getVisitorsLastMinute();
      if (lastMinuteCount > 20) {
        // Threshold for spike
        this.emitAlert({
          level: "warning",
          message: "Visitor spike detected!",
          details: { visitorsLastMinute: lastMinuteCount },
        });
      }
    }, 60000);

    // Update session durations every 30 seconds
    setInterval(async () => {
      const activeSessions = await redis.smembers("active_sessions");
      for (const sessionId of activeSessions) {
        const journey = await redis.lrange(
          `session:${sessionId}:journey`,
          0,
          -1
        );
        const firstActivity = await redis.get(`session:${sessionId}:start`);

        if (firstActivity) {
          const duration = Math.floor(
            (Date.now() - parseInt(firstActivity)) / 1000
          );
          const currentPage =
            journey.length > 0 ? journey[journey.length - 1] : "";

          this.analyticsNamespace.emit("session_activity", {
            sessionId,
            currentPage,
            journey,
            duration,
          });
        }
      }
    }, 30000);
  }

  public static async processVisitorEvent(
    event: Event,
    userId?: string
  ): Promise<void> {
    try {
      // Update Redis stats
      const pipeline = redis.pipeline();

      if (event.type === "pageview") {
        pipeline.sadd("active_sessions", event.sessionId);
        pipeline.hincrby("page_views", event.page, 1);
        pipeline.incr("total_visits_today");

        // Track session journey
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

      // Calculate current stats
      const stats = await this.calculateCurrentStats();

      // Emit visitor update
      this.analyticsNamespace.emit("visitor_update", {
        event,
        stats,
      });

      // Update specific user if available
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

  private static async emitDashboardCount(): Promise<void> {
    const count = await redis.scard("connected_dashboards");
    this.analyticsNamespace.emit("user_connected", {
      totalDashboards: count,
      connectedAt: new Date().toISOString(),
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

  private static async trackDashboardAction(
    socket: Socket,
    data: any
  ): Promise<void> {
    try {
      console.log(`Dashboard action: ${data.action}`, data.details);
      // You could store these actions in the database if needed
    } catch (error) {
      console.error("Error tracking dashboard action:", error);
    }
  }

  public static async calculateCurrentStats(): Promise<DashboardStats> {
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

  public static async getActiveSessions(): Promise<SessionActivity[]> {
    const activeSessions = await redis.smembers("active_sessions");
    const sessions: SessionActivity[] = [];

    for (const sessionId of activeSessions) {
      const journey = await redis.lrange(`session:${sessionId}:journey`, 0, -1);
      const firstActivity = await redis.get(`session:${sessionId}:start`);
      const duration = firstActivity
        ? Math.floor((Date.now() - parseInt(firstActivity)) / 1000)
        : 0;

      sessions.push({
        sessionId,
        currentPage: journey.length > 0 ? journey[journey.length - 1] : "",
        journey,
        duration,
      });
    }

    return sessions;
  }

  private static async getVisitorsLastMinute(): Promise<number> {
    const now = Date.now();
    const minuteAgo = now - 60000;
    const count = await redis.zcount("recent_visits", minuteAgo, now);
    return count;
  }

  private static emitAlert(data: {
    level: "info" | "warning" | "milestone";
    message: string;
    details: any;
  }): void {
    this.analyticsNamespace.emit("alert", {
      type: "alert",
      data,
    });
  }
}

export default SocketServices;
