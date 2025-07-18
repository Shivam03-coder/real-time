import {
  $Enums,
  MaterialType,
  ProductCategory,
  SockSize,
} from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: SessionUser;
    }
  }
}

export interface SessionUser {
  id: string;
}

export type CookieData = {
  value: string;
  days?: number;
};

