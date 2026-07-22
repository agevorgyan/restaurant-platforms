import { ValueObject } from '@saas/core';

export interface QueueItemSnapshot {
  id: string; // TicketId or ProductionId
  priorityValue: number;
  enteredAt: Date;
}

export interface QueueSnapshotProps {
  stationId: string;
  items: QueueItemSnapshot[];
  snapshotAt: Date;
}

export class QueueSnapshot extends ValueObject<QueueSnapshotProps> {
  get stationId(): string {
    return this.props.stationId;
  }

  get items(): QueueItemSnapshot[] {
    return [...this.props.items];
  }

  get snapshotAt(): Date {
    return this.props.snapshotAt;
  }

  private constructor(props: QueueSnapshotProps) {
    super(props);
  }

  public static create(stationId: string, items: QueueItemSnapshot[]): QueueSnapshot {
    if (!stationId || stationId.trim() === '') {
      throw new Error('Station ID cannot be empty');
    }
    return new QueueSnapshot({
      stationId: stationId.trim(),
      items: [...items],
      snapshotAt: new Date()
    });
  }

  public getDepth(): number {
    return this.props.items.length;
  }
}
