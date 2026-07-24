import { DomainPrimitive } from '@saas/domain';

interface FullNameProps {
  firstName: string;
  lastName: string;
}

export class FullName extends DomainPrimitive<FullNameProps> {
  private constructor(value: FullNameProps) {
    super(value);
  }

  public static create(firstName: string, lastName: string): FullName {
    if (!firstName || !lastName) {
      throw new Error('First name and last name must be provided.');
    }
    return new FullName({ firstName, lastName });
  }

  get firstName(): string {
    return this.value.firstName;
  }

  get lastName(): string {
    return this.value.lastName;
  }

  get fullName(): string {
    return `${this.value.firstName} ${this.value.lastName}`;
  }
}
