import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import AuthHelper from "@src/helpers/auth.helper";
import AuthServices from "@src/modules/auth/auth.service";
import { AuthError } from "@src/utils/error.utils";
import { SignUpUserType } from "./auth.dto";
import { db } from "@src/database";

export class AuthController {
  static userSignupHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, email, password } = req.body as SignUpUserType;

      await AuthServices.signUp({
        name,
        email,
        password,
        isAccepted: true,
      });

      res.json(new ApiResponse("Account created successfully"));
    }
  );

  static userSigninHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await AuthServices.signIn(
        email,
        password
      );

      AuthHelper.setCookies(res, {
        accessToken: {
          value: accessToken,
          days: 1,
        },
        refreshToken: {
          value: refreshToken,
          days: 7,
        },
      });

      const user = await db.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      res.status(200).json(new ApiResponse("Logged in successfully", user));
    }
  );

  static userLogoutHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      AuthHelper.clearCookies(res, ["accessToken", "refreshToken"]);
      res
        .status(200)
        .json(new ApiResponse("You have been logged out successfully"));
    }
  );

  static authenticatedUserInfoHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const userInfo = await AuthServices.getUserInfo(userId);
      res.json(new ApiResponse("User data fetched successfully", userInfo));
    }
  );

  static refreshTokenHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AuthError("Refresh token is missing. Please log in again.");
      }

      await AuthHelper.decodeToken(res, refreshToken);

      res
        .status(200)
        .json(new ApiResponse("Access token refreshed successfully."));
    }
  );
}
