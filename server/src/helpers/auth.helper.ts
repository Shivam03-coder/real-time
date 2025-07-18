import { envs } from "@src/configs/envs.config";
import { CookieData } from "@src/types/global.types";
import { Response } from "express";
import { SessionUser } from "@src/types/global.types";
import { AuthError, ValidationError } from "@src/utils/error.utils";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { db } from "@src/database";
import * as argon2 from "argon2";

class AuthHelper {
  private static defaultDays = 7;
  private static accessSecret = envs.ACCESS_TOKEN_SECRET || "access-secret-key";
  private static refreshSecret =
    envs.REFRESH_TOKEN_SECRET || "refresh-secret-key";

  public static isEmailValid(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      throw new ValidationError("Email is not valid");
    }
  }

  public static async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      });
    } catch (error) {
      console.error("Password hashing failed:", error);
      throw new Error("Password hashing failed");
    }
  }

  public static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch (error) {
      console.error("Password verification failed:", error);
      return false;
    }
  }

  private static getCookieOptions(days?: number) {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: (days ?? this.defaultDays) * 24 * 60 * 60 * 1000,
      path: "/",
    };
  }

  public static setCookies(
    res: Response,
    cookies: Record<string, string | CookieData>
  ) {
    Object.entries(cookies).forEach(([key, data]) => {
      const value = typeof data === "string" ? data : data.value;
      const days = typeof data === "string" ? undefined : data.days;
      res.cookie(key, value, this.getCookieOptions(days));
    });
  }

  public static clearCookies(res: Response, keys: string[]) {
    keys.forEach((key) => {
      res.clearCookie(key, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
    });
  }

  public static generateTokens(payload: SessionUser) {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async decodeToken(res: Response, refreshToken: string) {
    const decoded = jwt.verify(refreshToken, this.refreshSecret) as {
      id: string;
      role: string;
    };

    if (!decoded || !decoded.id || !decoded.role) {
      throw new JsonWebTokenError(
        "Invalid token payload. Please log in again."
      );
    }
    const isUser = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!isUser) {
      throw new AuthError(
        "User not found. The token might be invalid or expired."
      );
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      this.accessSecret,
      {
        expiresIn: "1d",
      }
    );

    this.setCookies(res, {
      accessToken: {
        value: newAccessToken,
        days: 1,
      },
    });
  }
}

export default AuthHelper;
