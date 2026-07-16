import { getSharedRedisClient } from './factory';

export async function checkRedisHealth(): Promise<{ status: string; message?: string }> {
  try {
    const client = getSharedRedisClient();
    const result = await client.ping();
    if (result === 'PONG') {
      return { status: 'ok' };
    }
    return { status: 'error', message: `Unexpected response: ${result}` };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Unknown error connecting to Redis' };
  }
}
