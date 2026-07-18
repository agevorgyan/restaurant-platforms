import { MembershipStatus } from '../value-objects/membership-status.value-object';
import { RewardValidityPeriod } from '../value-objects/reward-validity-period.value-object';
import { IRewardRule } from './reward-rule.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface IRewardPolicy {
  id: string;
  restaurantId: string;
  name: string;
  status: MembershipStatus;
  validityPeriod: RewardValidityPeriod;
  rules: IRewardRule[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
