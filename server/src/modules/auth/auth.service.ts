import { db } from "@src/database";
import AuthHelper from "@src/helpers/auth.helper";
import {
  ValidationError,
  DatabaseError,
  NotFoundError,
} from "@src/utils/error.utils";
import { SignUpUserType } from "./auth.dto";
import { User } from "@prisma/client";

class AuthServices {
  static async signUp(userData: SignUpUserType): Promise<User> {
    const { name, email, password } = userData;

    AuthHelper.isEmailValid(email);

    const isEmailAlreadyExist = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (isEmailAlreadyExist) {
      throw new ValidationError("User Already Exist");
    }

    const hashedPassword = await AuthHelper.hashPassword(password);

    const createdUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return createdUser;
  }

  static async signIn(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    AuthHelper.isEmailValid(email);
    
    if (!email || !password)
      throw new ValidationError("Email and password are required");
    
    const user = await db.user.findFirst({
      where: { email },
    });
    
    if (!user) throw new ValidationError("User not found");
    
    const isPasswordCorrect = await AuthHelper.verifyPassword(
      password,
      user.password
    );
    
    if (!isPasswordCorrect) {
      throw new ValidationError("You have enetred incorrect password !");
    }
    
    const { accessToken, refreshToken } = AuthHelper.generateTokens({
      id: user.id,
    });
    
    if (!accessToken || !refreshToken) {
      throw new ValidationError("Token generation failed.");
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  static async getUserInfo(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    try {
      const user = await db.user.findFirst({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
  
      if (!user) {
        throw new NotFoundError("User not found");
      }
  
      return {
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch user information");
    }
  }
}

export default AuthServices;
