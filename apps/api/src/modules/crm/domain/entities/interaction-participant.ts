import { Entity, Identifier } from '@saas/domain';

export class ParticipantId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ParticipantId { return new ParticipantId(value); }
  public static generate(): ParticipantId { return new ParticipantId(crypto.randomUUID()); }
}

export class Participant extends Entity<ParticipantId> {
  constructor(
    id: ParticipantId,
    public readonly entityType: 'LEAD' | 'CUSTOMER' | 'USER' | 'EXTERNAL',
    public readonly entityId: string,
    public readonly role: string, // e.g. INITIATOR, RECIPIENT, CC, BCC
    public readonly joinedAt: Date
  ) {
    super(id);
  }

  public static create(entityType: 'LEAD' | 'CUSTOMER' | 'USER' | 'EXTERNAL', entityId: string, role: string): Participant {
    if (!entityId || entityId.trim().length === 0) throw new Error('Participant entityId cannot be empty.');
    return new Participant(ParticipantId.generate(), entityType, entityId, role, new Date());
  }
}
