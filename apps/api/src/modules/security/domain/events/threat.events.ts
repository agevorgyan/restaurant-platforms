import {
  ThreatId,
  SecurityIncidentId,
  AlertId,
} from '../value-objects';
import { ThreatLevel } from '../enums/threat.enums';

/** Emitted when the detection engine identifies a threat signal. */
export class ThreatDetected {
  constructor(
    public readonly threatId: ThreatId,
    public readonly threatType: string,
    public readonly level: ThreatLevel,
    public readonly actorId: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a threat is promoted to a higher severity tier. */
export class ThreatEscalated {
  constructor(
    public readonly threatId: ThreatId,
    public readonly previousLevel: ThreatLevel,
    public readonly newLevel: ThreatLevel,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when threat signals are correlated into a formal incident. */
export class SecurityIncidentCreated {
  constructor(
    public readonly incidentId: SecurityIncidentId,
    public readonly relatedThreatIds: ThreatId[],
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when an operator closes an incident as resolved. */
export class IncidentResolved {
  constructor(
    public readonly incidentId: SecurityIncidentId,
    public readonly resolvedBy: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when an alert is generated and dispatched. */
export class AlertGenerated {
  constructor(
    public readonly alertId: AlertId,
    public readonly incidentId: SecurityIncidentId,
    public readonly channel: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when automated response locks an account. */
export class AccountLocked {
  constructor(
    public readonly userId: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when automated response revokes a session. */
export class SessionRevoked {
  constructor(
    public readonly sessionId: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when an IP address is added to the block list. */
export class IpBlocked {
  constructor(
    public readonly ipAddress: string,
    public readonly reason: string,
    public readonly expiresAt: Date,
    public readonly timestamp: Date,
  ) {}
}
