import { ValueObject } from '@saas/core';

export interface SegmentReferenceProps { segmentId: string; }

export class SegmentReference extends ValueObject<SegmentReferenceProps> {
  get segmentId(): string { return this.props.segmentId; }
  private constructor(props: SegmentReferenceProps) { super(props); }
  public static create(segmentId: string): SegmentReference {
    return new SegmentReference({ segmentId });
  }
}