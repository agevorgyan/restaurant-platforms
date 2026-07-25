export class ThreatId {
  constructor(public readonly value: string) {}
}

export class ThreatType {
  constructor(public readonly value: string) {}
}

export class ThreatScore {
  private static readonly MIN = 0;
  private static readonly MAX = 100;

  constructor(public readonly value: number) {
    if (value < ThreatScore.MIN || value > ThreatScore.MAX) {
      throw new Error(`ThreatScore must be between ${ThreatScore.MIN} and ${ThreatScore.MAX}.`);
    }
  }
}

export class ThreatEvidence {
  constructor(
    public readonly source: string,
    public readonly signal: string,
    public readonly payload: Record<string, unknown>,
    public readonly capturedAt: Date,
  ) {}
}

export class SecurityIncidentId {
  constructor(public readonly value: string) {}
}

export class IncidentSeverity {
  constructor(public readonly value: string) {}
}

export class DetectionRule {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly condition: string,
    public readonly threshold: number,
    public readonly windowSeconds: number,
    public readonly isEnabled: boolean = true,
  ) {}
}

export class DetectionWindow {
  constructor(
    public readonly startAt: Date,
    public readonly endAt: Date,
  ) {}
}

export class AlertId {
  constructor(public readonly value: string) {}
}

export class RiskSignal {
  constructor(
    public readonly type: string,
    public readonly weight: number,
    public readonly metadata: Record<string, unknown>,
  ) {}
}
