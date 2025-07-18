import { envs } from "@src/configs/envs.config";
import redis from "@src/configs/redis.config";
import { db } from "@src/database";
import { Server as HTTPServer } from "http";
import { Namespace, Socket, Server as SocketIoServer } from "socket.io";

// Type definitions for better type safety
type VisitorEvent = {
  type: string;
  page: string;
  sessionId: string;
  timestamp?: Date;
  country?: string;
  device?: string;
  referrer?: string;
  metadata?: any;
};

type DashboardStats = {
  totalActive: number;
  totalToday: number;
  pagesVisited: Record<string, string>;
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
      transports: ["websocket", "polling"], // Added polling as fallback
    });

    this.analyticsNamespace = this.io.of("/analytics");
    this.adminNamespace = this.io.of("/admin");

    this.setupConnectionHandlers();
  }

  private static setupConnectionHandlers(): void {
    this.setupUserConnections();
    this.setupAnalyticsConnections();
    this.setupAdminConnections();
  }

  private static setupUserConnections(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      socket.use(([event, ...args], next) => {
        try {
          const token = socket.handshake.auth.token;
          if (!token) throw new Error("Authentication required");
          next();
        } catch (error) {
          next(new Error("Unauthorized"));
        }
      });

      socket.on("joinUserRoom", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
      });
    });
  }

  private static setupAnalyticsConnections(): void {
    this.analyticsNamespace.on("connection", (socket: Socket) => {
      console.log(`📊 Analytics dashboard connected: ${socket.id}`);

      redis.sadd("connected_dashboards", socket.id);
      this.updateDashboardCount();

      socket.on("joinDashboardRoom", (dashboardId: string) => {
        socket.join(`dashboard:${dashboardId}`);
        console.log(`Socket joined dashboard room: ${dashboardId}`);
      });

      socket.on("visitor_event", async (event: VisitorEvent) => {
        try {
          const userId = socket.handshake.auth.userId;
          await this.processVisitorEvent(event, userId);
        } catch (error) {
          console.error("Error processing visitor event:", error);
        }
      });

      socket.on("disconnect", () => {
        redis.srem("connected_dashboards", socket.id);
        this.updateDashboardCount();
        console.log(`📊 Analytics dashboard disconnected: ${socket.id}`);
      });
    });
  }

  private static setupAdminConnections(): void {
    this.adminNamespace.on("connection", (socket: Socket) => {
      console.log(`🛡️ Admin dashboard connected: ${socket.id}`);

      socket.on("getSystemStats", async () => {
        const stats = await this.getSystemStats();
        socket.emit("system_stats", stats);
      });

      socket.on("disconnect", () => {
        console.log(`🛡️ Admin dashboard disconnected: ${socket.id}`);
      });
    });
  }

  private static async updateDashboardCount(): Promise<void> {
    try {
      const count = await redis.scard("connected_dashboards");
      this.analyticsNamespace.emit("dashboard_count", { count });
    } catch (error) {
      console.error("Error updating dashboard count:", error);
    }
  }

  private static async processVisitorEvent(event: VisitorEvent, userId?: string): Promise<void> {
    try {
      const dbEvent = await db.event.create({
        data: {
          type: event.type,
          page: event.page,
          sessionId: event.sessionId,
          timestamp: event.timestamp || new Date(),
          country: event.country,
          device: event.device,
          referrer: event.referrer,
          metadata: event.metadata || {},
          userId,
        },
      });

      await this.updateRealTimeStats(event);

      const stats = await this.calculateCurrentStats();
      
      this.analyticsNamespace.emit("visitor_update", { event: dbEvent, stats });
      
      if (userId) {
        this.analyticsNamespace.to(`user:${userId}`).emit("user_visitor_update", { event: dbEvent, stats });
      }
    } catch (error) {
      console.error("Error processing visitor event:", error);
      throw error;
    }
  }

  private static async updateRealTimeStats(event: VisitorEvent): Promise<void> {
    const pipeline = redis.pipeline();
    
    if (event.type === "pageview") {
      pipeline.sadd("active_sessions", event.sessionId);
      pipeline.hincrby("page_views", event.page, 1);
      pipeline.incr("total_visits_today");
      pipeline.zadd("recent_visits", Date.now(), JSON.stringify(event));
      pipeline.zremrangebyscore(
        "recent_visits",
        "-inf",
        Date.now() - 24 * 60 * 60 * 1000
      );
    } else if (event.type === "session_end") {
      pipeline.srem("active_sessions", event.sessionId);
    }

    await pipeline.exec();
  }

  private static async calculateCurrentStats(): Promise<DashboardStats> {
    try {
      const [totalActive, totalToday, pagesVisited] = await Promise.all([
        redis.scard("active_sessions"),
        redis.get("total_visits_today"),
        redis.hgetall("page_views"),
      ]);

      return {
        totalActive: totalActive || 0,
        totalToday: parseInt(totalToday || "0"),
        pagesVisited: pagesVisited || {},
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        totalActive: 0,
        totalToday: 0,
        pagesVisited: {},
      };
    }
  }

  private static async getSystemStats(): Promise<any> {
    return {
      connectedUsers: (await this.io.fetchSockets()).length,
      connectedDashboards: await redis.scard("connected_dashboards"),
      activeSessions: await redis.scard("active_sessions"),
    };
  }

  public static emitToUser(userId: string, event: string, data: any): void {
    this.io.to(userId).emit(event, data);
  }

  public static emitToDashboard(dashboardId: string, event: string, data: any): void {
    this.analyticsNamespace.to(`dashboard:${dashboardId}`).emit(event, data);
  }

  public static emitToAnalytics(event: string, data: any): void {
    this.analyticsNamespace.emit(event, data);
  }

  public static emitToAdmin(event: string, data: any): void {
    this.adminNamespace.emit(event, data);
  }
}

export default SocketServices;