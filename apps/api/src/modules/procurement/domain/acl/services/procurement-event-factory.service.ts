export class ProcurementEventFactory {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createOutboundEvent(eventName: string, payload: any, context: any): any {
    // Creates a standardized external-facing envelope
    return {
      eventName,
      data: payload,
      correlationId: context.correlationId,
      causationId: context.causationId,
      version: context.version,
      timestamp: context.timestamp,
      producerId: context.producerId,
      schemaVersion: context.schemaVersion
    };
  }
}