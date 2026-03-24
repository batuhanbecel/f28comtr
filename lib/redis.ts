import { Redis } from '@upstash/redis';

let _client: Redis | null | undefined = undefined;

export function getRedis(): Redis | null {
  if (_client !== undefined) return _client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  _client = url && token ? new Redis({ url, token }) : null;
  return _client;
}
