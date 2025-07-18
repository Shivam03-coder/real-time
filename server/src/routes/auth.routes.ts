import { Router } from "express";
import { AuthController } from "@src/modules/auth/auth.controller";
import { requireAuth } from "@src/middleware/auth.middleware";

const authRouter = Router();

authRouter
  .post("/sign-up", AuthController.userSignupHandler)
  .post("/sign-in", AuthController.userSigninHandler)
  .post("/logout", requireAuth, AuthController.userLogoutHandler)
  .get("/userinfo", requireAuth, AuthController.authenticatedUserInfoHandler)
  .get("/refresh", requireAuth, AuthController.refreshTokenHandler);

export default authRouter;
