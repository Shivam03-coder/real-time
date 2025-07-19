import { Router } from "express";
import { EventController } from "@src/modules/events/event.controller";
import { requireAuth as requireAuthMiddleware } from "@src/middleware/auth.middleware";

const eventRouter = Router();

eventRouter.get("/last10minStats", EventController.getActiveUserInLast10Min);
eventRouter.post("/", requireAuthMiddleware, EventController.createEvent);

export default eventRouter;
