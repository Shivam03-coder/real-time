import Redis, { Pipeline } from "ioredis";
import { envs } from "./envs.config";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(envs.REDIS_URL);

    this.client.on("connect", () => {
      console.log("✅ Redis connected");
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
  }

  public getClient(): Redis {
    return this.client;
  }

  public async set(
    key: string,
    value: string | number,
    expiryInSec?: number
  ): Promise<"OK"> {
    if (expiryInSec) {
      return this.client.set(key, value.toString(), "EX", expiryInSec);
    }
    return this.client.set(key, value.toString());
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async sadd(
    key: string,
    ...members: (string | number)[]
  ): Promise<number> {
    return this.client.sadd(key, ...members.map(String));
  }

  // scard
  public async scard(key: string): Promise<number> {
    return this.client.scard(key);
  }

  public async srem(
    key: string,
    ...members: (string | number)[]
  ): Promise<number> {
    return this.client.srem(key, ...members.map(String));
  }

  public async sismember(
    key: string,
    member: string | number
  ): Promise<boolean> {
    const result = await this.client.sismember(key, member.toString());
    return result === 1;
  }

  public async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  public async hset(
    key: string,
    field: string,
    value: string | number
  ): Promise<number> {
    return this.client.hset(key, field, value.toString());
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  public async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  public async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  public pipeline() {
    return this.client.pipeline();
  }

  public async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  public async lpush(key: string, value: string): Promise<number> {
    return this.client.lpush(key, value);
  }

  public async lrange(key: string, start: number, end: number): Promise<string[]> {
    return this.client.lrange(key, start, end);
  }

  // zcount
  public async zcount(key: string, min: number, max: number): Promise<number> {
    return this.client.zcount(key, min, max);
  }

  public async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }
}

const redis = new RedisService();
export default redis;
