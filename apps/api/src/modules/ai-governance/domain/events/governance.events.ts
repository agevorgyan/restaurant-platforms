export class PolicyEvaluated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly policyId: string,
    public readonly decision: string,
    public readonly executionId: string
  ) {}
}

export class PolicyViolationDetected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly violationId: string,
    public readonly executionId: string,
    public readonly details: string
  ) {}
}

export class SafetyCheckCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly checkType: string,
    public readonly passed: boolean
  ) {}
}

export class ApprovalRequired {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly toolId: string,
    public readonly reason: string
  ) {}
}

export class ApprovalGranted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly approverId: string
  ) {}
}

export class ApprovalRejected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly approverId: string,
    public readonly reason: string
  ) {}
}

export class RiskAssessmentCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly riskLevel: string,
    public readonly score: number
  ) {}
}

export class AiPlatformCertified {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly certificationDate: Date,
    public readonly status: string,
    public readonly generatedBy: string
  ) {}
}
