import { ValueObject } from '@saas/core';

export interface QueuePositionProps { position: number; }
export class QueuePosition extends ValueObject<QueuePositionProps> {
  get position(): number { return this.props.position; }
  private constructor(props: QueuePositionProps) { super(props); }
  public static create(position: number): QueuePosition { return new QueuePosition({ position }); }
}