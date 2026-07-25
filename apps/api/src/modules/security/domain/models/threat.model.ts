import {
  ThreatId,
  ThreatType,
  ThreatScore,
  ThreatEvidence,
  SecurityIncidentId,
  IncidentSeverity,
  AlertId,
  DetectionRule,
  RiskSignal,
} from '../value-objects';
import { ThreatLevel, IncidentStatus } from '../enums/threat.enums';

/** Aggregate root representing a detected threat signal.
 * Immutable after construction — escalation creates a new state transition record. */
export class Threat {
  private _signals: RiskSignal[] = [];
  private _escalationHistory: Array<{ from: ThreatLevel; to: ThreatLevel; at: Date }> = [];

  constructor(
    public readonly id: ThreatId,
    public readonly type: ThreatType,
    public readonly actorId: string,
    public readonly evidence: ThreatEvidence,
    public level: ThreatLevel,
    public score: ThreatScore,
    public readonly detectedAt: Date = new Date(),
  ) {}

  /** Adds a correlated risk signal contributing to this threat. */
  public addSignal(signal: RiskSignal): void {
    this._signals.push(signal);
  }

  /** Escalates the threat to a higher severity level. */
  public escalate(newLevel: ThreatLevel): void {
    this._escalationHistory.push({ from: this.level, to: newLevel, at: new Date() });
    this.level = newLevel;
  }

  get signals(): ReadonlyArray<RiskSignal> {
    return this._signals;
  }

  get escalationHistory(): ReadonlyArray<{ from: ThreatLevel; to: ThreatLevel; at: Date }> {
    return this._escalationHistory;
  }
}

/** Aggregate root representing a formal security incident derived from correlated threats. */
export class SecurityIncident {
  private _timeline: Array<{ event: string; at: Date; operator?: string }> = [];
  private _relatedThreatIds: ThreatId[];

  constructor(
    public readonly id: SecurityIncidentId,
    public readonly severity: IncidentSeverity,
    public status: IncidentStatus,
    public readonly title: string,
    public readonly createdAt: Date = new Date(),
    relatedThreatIds: ThreatId[] = [],
  ) {
    this._relatedThreatIds = [...relatedThreatIds];
    this._timeline.push({ event: 'Incident created', at: this.createdAt });
  }

  /** Transitions the incident to the Investigating state. */
  public investigate(operator: string): void {
    this.status = IncidentStatus.Investigating;
    this._timeline.push({ event: 'Investigation started', at: new Date(), operator });
  }

  /** Marks the incident as contained. */
  public contain(operator: string): void {
    this.status = IncidentStatus.Contained;
    this._timeline.push({ event: 'Incident contained', at: new Date(), operator });
  }

  /** Resolves the incident and seals the timeline. */
  public resolve(operator: string): void {
    this.status = IncidentStatus.Resolved;
    this._timeline.push({ event: 'Incident resolved', at: new Date(), operator });
  }

  get timeline(): ReadonlyArray<{ event: string; at: Date; operator?: string }> {
    return this._timeline;
  }

  get relatedThreatIds(): ReadonlyArray<ThreatId> {
    return this._relatedThreatIds;
  }
}

/** Represents a detection alert dispatched to an external channel. */
export class DetectionAlert {
  constructor(
    public readonly id: AlertId,
    public readonly incidentId: SecurityIncidentId,
    public readonly channel: string,
    public readonly message: string,
    public readonly isAcknowledged: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}
}

/** Represents a configurable detection rule driving the rule engine. */
export class SecurityDetectionRule {
  constructor(
    public readonly rule: DetectionRule,
    public readonly actions: string[],
    public readonly createdAt: Date = new Date(),
  ) {}
}
