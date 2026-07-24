import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class SkillsProfileCreated extends DomainEvent<{ profileId: string, staffId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, staffId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'SkillsProfileCreated', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SkillAdded extends DomainEvent<{ profileId: string, skillCode: string, skillLevel: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, skillCode: string, skillLevel: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'SkillAdded', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SkillRemoved extends DomainEvent<{ profileId: string, skillCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, skillCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'SkillRemoved', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SkillLevelUpdated extends DomainEvent<{ profileId: string, skillCode: string, newLevel: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, skillCode: string, newLevel: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'SkillLevelUpdated', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CertificationRegistered extends DomainEvent<{ profileId: string, certificationCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, certificationCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'CertificationRegistered', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CertificationRenewed extends DomainEvent<{ profileId: string, certificationCode: string, expirationDate?: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, certificationCode: string, expirationDate?: Date }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'CertificationRenewed', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CertificationExpired extends DomainEvent<{ profileId: string, certificationCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, certificationCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'CertificationExpired', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CertificationArchived extends DomainEvent<{ profileId: string, certificationCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, certificationCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'CertificationArchived', aggregateId, 'SkillsProfile', aggregateVersion, new Date(), payload, metadata);
  }
}
