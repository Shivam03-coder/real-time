import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { ValidationError } from "@src/utils/error.utils";
import { db } from "@src/database";
import SocketServices from "@src/services/socket.service";
import { subMinutes, format, addMinutes, isBefore } from "date-fns";

export class EventController {
  public static createEvent = AsyncHandler(
    async (req: Request, res: Response) => {
      const { type, page, sessionId, country, device, referrer } = req.body;
      const { userId } = await getAuth(req);

      console.log(req.body);

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

      SocketServices.processVisitorEvent(createdEvent);

      res
        .status(201)
        .json(new ApiResponse("Event created successfully", createdEvent));
    }
  );

  public static getActiveUserInLast10Min = AsyncHandler(
    async (_req: Request, res: Response) => {
      const fromTime = subMinutes(new Date(), 10);

      const rawData = await db.$queryRaw<
        { minute: Date; uniqueVisitors: bigint }[]
      >`
        SELECT 
          date_trunc('minute', "timestamp") AS minute,
          COUNT(DISTINCT "sessionId") AS "uniqueVisitors"
        FROM "events"
        WHERE "timestamp" >= ${fromTime}::timestamptz
        GROUP BY minute
        ORDER BY minute ASC
      `;

      const now = new Date();
      const result: { minute: string; count: number }[] = [];

      const dataMap = new Map(
        rawData.map((entry) => [
          format(entry.minute, "HH:mm"),
          Number(entry.uniqueVisitors),
        ])
      );

      let current = fromTime;
      while (isBefore(current, addMinutes(now, 1))) {
        const key = format(current, "HH:mm");
        result.push({
          minute: key,
          count: dataMap.get(key) || 0,
        });
        current = addMinutes(current, 1);
      }

      const lastMinuteCount = result[result.length - 1]?.count ?? 0;
      const previousCounts = result.slice(0, -1).map((r) => r.count);
      const avgOfPrevious = previousCounts.length
        ? previousCounts.reduce((a, b) => a + b, 0) / previousCounts.length
        : 0;

      let level: "milestone" | "info" | "warning" = "info";
      let message = "Normal traffic";

      if (avgOfPrevious === 0 && lastMinuteCount > 0) {
        level = "milestone";
        message = "First visitor(s) detected!";
      } else if (lastMinuteCount >= avgOfPrevious * 2) {
        level = "milestone";
        message = "Traffic spike detected!";
      } else if (lastMinuteCount < avgOfPrevious * 0.5) {
        level = "warning";
        message = "Visitor count dropped";
      }

      // Emit WebSocket alert
      SocketServices.emitAlert({
        level,
        message,
        details: {
          visitorsLastMinute: lastMinuteCount,
          averagePrevious: Math.round(avgOfPrevious),
        },
      });

      res.status(200).json(new ApiResponse("Success", result));
    }
  );
}
