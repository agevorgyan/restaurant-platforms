// Extension points for Observability (interfaces only)

export interface IntegrationLogger {
  logIntegrationStart(context: any): void;
  logIntegrationSuccess(context: any): void;
  logIntegrationFailure(context: any, error: any): void;
  logPoisonMessage(messageId: string, error: any): void;
}

export interface IntegrationTracer {
  startTrace(correlationId: string, operationName: string): any;
  endTrace(span: any): void;
  recordException(span: any, error: Error): void;
}

export interface IntegrationMetrics {
  incrementProcessedEvents(eventType: string): void;
  incrementFailedEvents(eventType: string): void;
  recordProcessingDuration(eventType: string, durationMs: number): void;
  incrementRetryCount(eventType: string): void;
  incrementDeadLetterCount(eventType: string): void;
}