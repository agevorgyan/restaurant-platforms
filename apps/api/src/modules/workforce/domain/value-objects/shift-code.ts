import { DomainPrimitive } from '@saas/domain';

export class ShiftCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ShiftCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Shift code cannot be empty.');
    }
    return new ShiftCode(value);
  }
}
