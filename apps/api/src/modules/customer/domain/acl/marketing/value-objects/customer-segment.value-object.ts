import { ValueObject } from '@saas/core';
import { SegmentReference } from './segment-reference.value-object';

export interface CustomerSegmentProps {
  segmentRef: SegmentReference;
  name: string;
  assignedAt: Date;
}

export class CustomerSegment extends ValueObject<CustomerSegmentProps> {
  get segmentRef(): SegmentReference { return this.props.segmentRef; }
  get name(): string { return this.props.name; }
  get assignedAt(): Date { return this.props.assignedAt; }

  private constructor(props: CustomerSegmentProps) { super(props); }
  public static create(props: CustomerSegmentProps): CustomerSegment {
    return new CustomerSegment(props);
  }
}