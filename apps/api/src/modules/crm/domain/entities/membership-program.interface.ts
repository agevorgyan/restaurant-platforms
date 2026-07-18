import { MembershipStatus } from '../value-objects/membership-status.value-object';
import { MembershipPeriod } from '../value-objects/membership-period.value-object';
import { IMembershipTier } from './membership-tier.interface';
import { IQualificationRule } from './qualification-rule.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface IMembershipProgram {
  id: string;
  restaurantId: string;
  name: string;
  status: MembershipStatus;
  tiers: IMembershipTier[];
  qualificationRules: IQualificationRule[];
  effectivePeriod: MembershipPeriod;
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
