import Redis, { RedisOptions } from 'ioredis';
import { getRedisConfig } from './config';

let clientInstance: Redis | null = null;

export function createRedisClient(options?: Partial<RedisOptions>): Redis {
  const config = getRedisConfig();
  
  return new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    keyPrefix: config.keyPrefix,
    lazyConnect: true, // Don't connect immediately unless needed
    ...options,
  });
}

export function getSharedRedisClient(): Redis {
  if (!clientInstance) {
    clientInstance = createRedisClient({ lazyConnect: false });
  }
  return clientInstance;
}
