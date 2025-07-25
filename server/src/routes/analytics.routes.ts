import { Router } from "express";
import { AnalyticsController } from "@src/modules/analytics/analytics.controller";
import { requireAuth as requireAuthMiddleware } from "@src/middleware/auth.middleware";

const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuthMiddleware, AnalyticsController.getAllAnalyticsData);

export default analyticsRouter ;