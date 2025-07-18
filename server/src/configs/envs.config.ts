import { config } from "dotenv";
import { version } from "../../package.json";

config();

type Environment = "development" | "production" | "test" | "staging";

export const envs = {
  NODE_ENV: (process.env.NODE_ENV || "development") as Environment,
  PORT: parseInt(process.env.PORT || "3000", 10),
  VERSION: process.env.APP_VERSION || version,
  DB_URI: process.env.MONGO_URI as string,
  DB_NAME: process.env.MONGO_DB_NAME || "upfound-test",
  CLIENT_APP_URI: process.env.CLIENT_APP_URI as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REDIS_URL: process.env.REDIS_URL as string,
};
