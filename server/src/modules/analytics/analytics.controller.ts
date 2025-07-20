import { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@src/utils/api.utils";
import { db } from "@src/database";
import SocketServices from "@src/services/socket.service";

export class AnalyticsController {
  static getAllAnalyticsData = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const filters = await SocketServices.getFilters();
      const data = await db.event.findMany({
        where: {
          ...filters,
        },
        select: {
          country: true,
          sessionId: true,
          device: true,
          type: true,
          page: true,
        },
      });

      res.status(200).json(new ApiResponse("Data fetched", data));
    }
  );
}
