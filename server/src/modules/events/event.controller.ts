import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { ValidationError } from "@src/utils/error.utils";
import { db } from "@src/database";
import SocketServices from "@src/services/socket.service";

export class EventController {
  public static createEvent = AsyncHandler(
    async (req: Request, res: Response) => {
      const event = req.body;
      const { userId } = await getAuth(req);
      const metadata = req.headers["x-metadata"];
      const metadataObj = JSON.parse(metadata as string);

      if (!event.type || !event.page || !event.sessionId) {
        throw new ValidationError("Missing required fields");
      }

      const createdEvent = await db.event.create({
        data: {
          type: event.type,
          page: event.page,
          sessionId: event.sessionId,
          timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
          country: event.country,
          device: metadataObj.device,
          referrer: metadataObj.referrer,
          metadata: metadataObj || {},
          userId: userId,
        },
      });

      SocketServices.processVisitorEvent(createdEvent, userId);

      res
        .status(201)
        .json(new ApiResponse("Event created successfully", createdEvent));
    }
  );
}
