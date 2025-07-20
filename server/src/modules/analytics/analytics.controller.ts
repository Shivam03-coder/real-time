import { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@src/utils/api.utils";
import { db } from "@src/database";
import SocketServices from "@src/services/socket.service";

export class AnalyticsController {
  static getAllAnalyticsData = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = await db.event.findMany({
        select: {
          country: true,
          sessionId: true,
          device: true,
          type: true,
          page: true,
        },
      });
      console.log("🚀 ~ AnalyticsController ~ data:", data);

      res.status(200).json(new ApiResponse("Data fetched", data));
    }
  );
}
