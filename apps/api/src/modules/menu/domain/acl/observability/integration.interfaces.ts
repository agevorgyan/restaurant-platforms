export interface IntegrationLogger {
  logInfo(message: string, context: Record<string, any>): void;
  logError(message: string, error: Error, context: Record<string, any>): void;
  logWarning(message: string, context: Record<string, any>): void;
}

export interface IntegrationTracer {
  startSpan(name: string, correlationId: string): void;
  endSpan(name: string): void;
  recordError(error: Error): void;
}

export interface IntegrationMetrics {
  incrementProcessedEvents(eventType: string): void;
  recordProcessingDuration(eventType: string, durationMs: number): void;
  incrementRetryCount(eventType: string): void;
  incrementDeadLetterCount(eventType: string): void;
  incrementValidationFailures(eventType: string): void;
}