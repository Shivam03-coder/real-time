import { envs } from "@src/configs/envs.config";
import { Server as HTTPServer } from "http";
import { Namespace, Socket, Server as SocketIoServer } from "socket.io";

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

  private static emitDashboardUsersUpdated(): void {
    const totalConnected = this.connectedSockets.size;
    const socketIds = Array.from(this.connectedSockets);

    this.analyticsNamespace.emit("dashboard_users_updated", {
      totalConnected,
      socketIds,
      updatedAt: new Date(),
    });
  }
}

export default SocketServices;
