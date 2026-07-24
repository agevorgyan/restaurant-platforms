import { Identifier, DomainPrimitive } from '@saas/domain';

export class LeadId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadId { return new LeadId(value); }
  public static generate(): LeadId { return new LeadId(crypto.randomUUID()); }
}

export class LeadNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadNumber {
    if (!value || value.trim().length === 0) throw new Error('Lead number cannot be empty.');
    return new LeadNumber(value);
  }
}

export enum LeadStatusEnum {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  DISQUALIFIED = 'DISQUALIFIED',
  CONVERTED = 'CONVERTED',
  ARCHIVED = 'ARCHIVED'
}

export class LeadStatus extends DomainPrimitive<LeadStatusEnum> {
  private constructor(value: LeadStatusEnum) { super(value); }
  public static create(value: LeadStatusEnum): LeadStatus {
    if (!Object.values(LeadStatusEnum).includes(value)) throw new Error(`Invalid lead status: ${value}`);
    return new LeadStatus(value);
  }
}

export class LeadSource extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadSource {
    if (!value || value.trim().length === 0) throw new Error('Lead source cannot be empty.');
    return new LeadSource(value);
  }
}

export class LeadScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): LeadScore {
    if (value < 0 || value > 100) throw new Error('Lead score must be between 0 and 100.');
    return new LeadScore(value);
  }
}

export interface ContactInformationProps {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
}

export class ContactInformation extends DomainPrimitive<ContactInformationProps> {
  private constructor(value: ContactInformationProps) { super(value); }
  public static create(props: ContactInformationProps): ContactInformation {
    if (!props.email || !props.firstName || !props.lastName) throw new Error('Email, first name, and last name are required.');
    return new ContactInformation(props);
  }
}

export interface ExpectedRevenueProps {
  amount: number;
  currency: string;
}

export class ExpectedRevenue extends DomainPrimitive<ExpectedRevenueProps> {
  private constructor(value: ExpectedRevenueProps) { super(value); }
  public static create(props: ExpectedRevenueProps): ExpectedRevenue {
    if (props.amount < 0) throw new Error('Expected revenue cannot be negative.');
    return new ExpectedRevenue(props);
  }
}

export class AcquisitionChannel extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AcquisitionChannel {
    return new AcquisitionChannel(value);
  }
}

export class Industry extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Industry {
    return new Industry(value);
  }
}

export class Priority extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Priority {
    const valid = ['LOW', 'MEDIUM', 'HIGH'];
    if (!valid.includes(value)) throw new Error('Invalid priority.');
    return new Priority(value);
  }
}
