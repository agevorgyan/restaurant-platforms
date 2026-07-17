import { IKitchenQueue } from '../entities/kitchen-queue.interface';

export type QueueStrategyType = 'FIFO' | 'Priority' | 'Hybrid';

export interface IQueueStrategy {
  readonly type: QueueStrategyType;
  calculateOrder(queue: IKitchenQueue): void;
  canReorder(): boolean;
}
