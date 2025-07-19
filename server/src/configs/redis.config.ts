import Redis from "ioredis";
import { envs } from "./envs.config";

const redis = new Redis(envs.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
