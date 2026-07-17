import { CountMethod } from '../value-objects/count-method.value-object';
import { CountStatus } from '../value-objects/count-status.value-object';
import { IStockCountLine } from './stock-count-line.interface';

export interface IStockCount {
  id: string;
  restaurantId: string;
  inventoryId: string;
  countNumber: string;
  method: CountMethod;
  status: CountStatus;
  countDate: Date;
  lines: IStockCountLine[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
