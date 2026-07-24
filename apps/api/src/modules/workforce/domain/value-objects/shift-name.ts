import { DomainPrimitive } from '@saas/domain';

export class ShiftName extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ShiftName {
    if (!value || value.trim().length === 0) {
      throw new Error('Shift name cannot be empty.');
    }
    return new ShiftName(value);
  }
}
