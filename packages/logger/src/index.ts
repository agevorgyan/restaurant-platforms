export const name = '@saas/logger';

export interface LogMeta {
  [key: string]: any;
}

export class Logger {
  constructor(private context: string) {}

  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | string, meta?: LogMeta) {
    const errorMeta = error instanceof Error
      ? { error: { name: error.name, message: error.message, stack: error.stack } }
      : { error: typeof error === 'string' ? error : undefined };
    this.log('error', message, { ...meta, ...errorMeta });
  }

  debug(message: string, meta?: LogMeta) {
    this.log('debug', message, meta);
  }

  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, meta?: LogMeta) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta,
    };
    if (process.env.NODE_ENV === 'test') {
      // Avoid cluttering test runner output but allow tracing if needed
      return;
    }
    console.log(JSON.stringify(payload));
  }
}
