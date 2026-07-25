import { ThreatLevel } from '../../domain/enums/threat.enums';

/** DTO for creating a new configurable detection rule. */
export class CreateDetectionRuleDto {
  name!: string;
  condition!: string;
  threshold!: number;
  windowSeconds!: number;
  actions!: string[];
  isEnabled?: boolean;
}

/** DTO for resolving an active security incident. */
export class ResolveIncidentDto {
  resolution!: string;
  resolvedBy!: string;
}

/** DTO for searching and filtering threat records. */
export class ThreatSearchDto {
  actorId?: string;
  level?: ThreatLevel;
  threatType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
