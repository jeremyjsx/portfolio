import { getRedis, isValidClapSlug } from "@/lib/writing/claps";

export function viewsTotalKey(slug: string): string {
  return `views:total:${slug}`;
}

export function viewsDayKey(slug: string, day: string): string {
  return `views:day:${slug}:${day}`;
}

/** UTC calendar day `YYYY-MM-DD`. */
export function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Keep the daily visitor set long enough to cover the UTC day + buffer. */
const DAY_SET_TTL_SECONDS = 60 * 60 * 48;

export type ViewRecordResult = {
  recorded: boolean;
  total: number;
};

/**
 * Count at most one view per visitor per UTC day.
 * Soft-fails when Redis is unavailable.
 */
export async function recordUniqueDailyView(
  slug: string,
  visitorId: string,
): Promise<ViewRecordResult | null> {
  if (!isValidClapSlug(slug) || !visitorId) {
    return null;
  }

  const redis = getRedis();
  if (!redis) {
    return null;
  }

  const day = utcDayKey();
  const dayKey = viewsDayKey(slug, day);
  const added = await redis.sadd(dayKey, visitorId);

  if (added === 1) {
    const pipeline = redis.pipeline();
    pipeline.expire(dayKey, DAY_SET_TTL_SECONDS);
    pipeline.incr(viewsTotalKey(slug));
    const results = await pipeline.exec<[number, number]>();
    return {
      recorded: true,
      total: Number(results[1] ?? 0),
    };
  }

  await redis.expire(dayKey, DAY_SET_TTL_SECONDS);
  const total = Number((await redis.get(viewsTotalKey(slug))) ?? 0);
  return {
    recorded: false,
    total,
  };
}

export async function getViewTotal(slug: string): Promise<number> {
  const redis = getRedis();
  if (!redis) {
    return 0;
  }

  return Number((await redis.get(viewsTotalKey(slug))) ?? 0);
}
