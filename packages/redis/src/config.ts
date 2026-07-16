export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  keyPrefix?: string;
}

export function getRedisConfig(): RedisConfig {
  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    keyPrefix: process.env.REDIS_PREFIX || 'saas:',
  };
}
