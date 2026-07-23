export class MenuIntegrationPolicy {
  public static validateMetadata(metadata: any): void {
    if (!metadata.correlationId) throw new Error('CorrelationId required');
    if (!metadata.timestamp) throw new Error('Timestamp required');
    if (!metadata.producer) throw new Error('Producer required');
  }
}

export class ContractValidationPolicy {
  public static ensureStrictCompliance(payload: any): void {
    if (!payload) throw new Error('Empty payload');
  }
}

export class VersionCompatibilityPolicy {
  public static enforce(eventVersion: string, systemVersion: string): void {
    const evMajor = eventVersion.split('.')[0];
    const sysMajor = systemVersion.split('.')[0];
    if (evMajor !== sysMajor) {
      throw new Error(`Version mismatch. Expected ${sysMajor}.x, got ${eventVersion}`);
    }
  }
}

export class RetryPolicy {
  public static shouldRetry(failureCount: number): boolean {
    return failureCount < 3;
  }
}

export class PoisonMessagePolicy {
  public static handle(payload: any): void {
    void payload;
    // Escalate immediately without retry
  }
}