import { IKitchenStation } from '../entities/kitchen-station.interface';

export interface IKitchenStationRepository {
  findById(id: string): Promise<IKitchenStation | null>;
  findByNameAndKitchenId(name: string, kitchenId: string): Promise<IKitchenStation | null>;
  save(station: IKitchenStation): Promise<void>;
}
