import { Entity, Identifier } from '@saas/domain';

export class EmergencyContactId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): EmergencyContactId {
    return new EmergencyContactId(value);
  }
  public static generate(): EmergencyContactId {
    return new EmergencyContactId(crypto.randomUUID());
  }
}

export class EmergencyContact extends Entity<EmergencyContactId> {
  constructor(
    id: EmergencyContactId,
    public name: string,
    public relationship: string,
    public phone: string
  ) {
    super(id);
  }
}
