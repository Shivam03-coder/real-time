import { Router } from "express";
import { AuthController } from "@src/modules/auth/auth.controller";
import { requireAuth } from "@src/middleware/auth.middleware";
import { requireAuth as requireAuthMiddleware } from "@src/middleware/auth.middleware";

const authRouter = Router();

authRouter
  .post("/sign-up", AuthController.userSignupHandler)
  .post("/sign-in", AuthController.userSigninHandler)
  .post("/logout", requireAuthMiddleware, AuthController.userLogoutHandler)
  .get("/userinfo", requireAuthMiddleware, AuthController.authenticatedUserInfoHandler)
  .get("/refresh", requireAuthMiddleware, AuthController.refreshTokenHandler);

export default authRouter;
