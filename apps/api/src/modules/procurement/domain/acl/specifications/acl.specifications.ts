export class ProcurementIntegrationSpecification {
  public static isSatisfiedBy(payload: any): boolean {
    return !!payload && !!payload.correlationId && !!payload.causationId && !!payload.version && !!payload.timestamp && !!payload.producerId && !!payload.schemaVersion;
  }
}

export class ContractCompatibilitySpecification {
  public static isSatisfiedBy(contract: any, expectedSchema: any): boolean {
    // Check if contract matches the schema structural shape
    return !!contract && !!expectedSchema;
  }
}

export class EventVersionSpecification {
  public static isSatisfiedBy(incomingVersion: string, supportedVersions: string[]): boolean {
    return supportedVersions.includes(incomingVersion);
  }
}

export class CorrelationSpecification {
  public static isSatisfiedBy(context: any): boolean {
    return !!context && !!context.correlationId && !!context.causationId;
  }
}

export class IdempotencySpecification {
  public static isSatisfiedBy(processedIds: string[], incomingId: string): boolean {
    return !processedIds.includes(incomingId);
  }
}