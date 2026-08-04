import { Redis } from "@upstash/redis";
import {
  CLAP_MAX_AMOUNT_PER_REQUEST,
  CLAP_MAX_PER_VISITOR,
  type ClapCounts,
} from "@/lib/writing/claps-constants";
import { getPublishedWritingPost } from "@/lib/writing/posts";

export {
  CLAP_COOKIE,
  CLAP_MAX_AMOUNT_PER_REQUEST,
  CLAP_MAX_PER_VISITOR,
  type ClapCounts,
} from "@/lib/writing/claps-constants";

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function getRedis(): Redis | null {
  if (!hasRedisEnv()) {
    return null;
  }

  return Redis.fromEnv();
}

export function isValidClapSlug(slug: string): boolean {
  return getPublishedWritingPost(slug) !== null;
}

export function totalKey(slug: string): string {
  return `claps:total:${slug}`;
}

export function userKey(slug: string, visitorId: string): string {
  return `claps:user:${slug}:${visitorId}`;
}

export async function getClapCounts(
  slug: string,
  visitorId: string,
): Promise<ClapCounts> {
  const redis = getRedis();
  if (!redis) {
    return { total: 0, mine: 0 };
  }

  const [total, mine] = await redis.mget<number[]>(
    totalKey(slug),
    userKey(slug, visitorId),
  );

  return {
    total: Number(total ?? 0),
    mine: Number(mine ?? 0),
  };
}

export async function addClaps(
  slug: string,
  visitorId: string,
  amount: number,
): Promise<ClapCounts | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  const safeAmount = Math.max(
    0,
    Math.min(Math.floor(amount), CLAP_MAX_AMOUNT_PER_REQUEST),
  );
  if (safeAmount === 0) {
    return getClapCounts(slug, visitorId);
  }

  const currentMine = Number((await redis.get(userKey(slug, visitorId))) ?? 0);
  const room = Math.max(0, CLAP_MAX_PER_VISITOR - currentMine);
  const applied = Math.min(safeAmount, room);

  if (applied === 0) {
    return getClapCounts(slug, visitorId);
  }

  const pipeline = redis.pipeline();
  pipeline.incrby(totalKey(slug), applied);
  pipeline.incrby(userKey(slug, visitorId), applied);
  const results = await pipeline.exec<[number, number]>();

  return {
    total: Number(results[0] ?? 0),
    mine: Number(results[1] ?? 0),
  };
}
