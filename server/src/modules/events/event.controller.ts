import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { ValidationError } from "@src/utils/error.utils";
import { db } from "@src/database";
import SocketServices from "@src/services/socket.service";

export class EventController {
  public static createEvent = AsyncHandler(
    async (req: Request, res: Response) => {
      const { type, page, sessionId, country, device, referrer } = req.body;
      const { userId } = await getAuth(req);

      console.log(req.body)

      if (!type || !page || !sessionId) {
        throw new ValidationError("Missing required fields");
      }

      const createdEvent = await db.event.create({
        data: {
          type: type,
          page: page,
          timestamp: new Date(),
          country: country,
          device: device,
          referrer: referrer,
          sessionId,
          userId,
        },
      });

      SocketServices.processVisitorEvent(createdEvent, userId);

      res
        .status(201)
        .json(new ApiResponse("Event created successfully", createdEvent));
    }
  );
}
