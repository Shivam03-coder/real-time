import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import SocketServices from "@src/services/socket.service";

export class AnalyticsController {
  public static getSummary = AsyncHandler(
    async (req: Request, res: Response) => {
      const stats = await SocketServices.calculateCurrentStats();
      res
        .status(200)
        .json(new ApiResponse("Summary fetched successfully", stats));
    }
  );

  //   sessions
  public static getSessions = AsyncHandler(
    async (req: Request, res: Response) => {
      const sessions = await SocketServices.getActiveSessions();
      res
        .status(200)
        .json(new ApiResponse("Sessions fetched successfully", sessions));
    }
  );
}
