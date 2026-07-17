import { IKitchenDisplay } from '../entities/kitchen-display.interface';

export interface IKitchenDisplayRepository {
  findById(id: string): Promise<IKitchenDisplay | null>;
  findByNameAndStationId(name: string, stationId: string): Promise<IKitchenDisplay | null>;
  save(display: IKitchenDisplay): Promise<void>;
}
