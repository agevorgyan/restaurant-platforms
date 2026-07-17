import { IKitchenQueue } from '../entities/kitchen-queue.interface';

export interface IKitchenQueueRepository {
  findById(id: string): Promise<IKitchenQueue | null>;
  findByStationId(stationId: string): Promise<IKitchenQueue | null>;
  save(queue: IKitchenQueue): Promise<void>;
}
