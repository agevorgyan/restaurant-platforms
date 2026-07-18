import { SegmentStatus } from '../value-objects/segment-status.value-object';
import { SegmentType } from '../value-objects/segment-type.value-object';
import { SegmentPriority } from '../value-objects/segment-priority.value-object';
import { SegmentEvaluationPolicy } from '../value-objects/segment-evaluation-policy.value-object';
import { ISegmentRule } from './segment-rule.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ICustomerSegment {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  segmentType: SegmentType;
  status: SegmentStatus;
  priority: SegmentPriority;
  evaluationPolicy: SegmentEvaluationPolicy;
  rules: ISegmentRule[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
