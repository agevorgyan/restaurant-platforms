import { DomainPrimitive } from '@saas/domain';

export class JobTitle extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): JobTitle {
    if (!value || value.trim().length === 0) {
      throw new Error('Job title cannot be empty.');
    }
    return new JobTitle(value);
  }
}
