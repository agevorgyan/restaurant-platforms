import { MovementType } from '../value-objects/movement-type.value-object';
import { MovementReason } from '../value-objects/movement-reason.value-object';
import { MovementStatus } from '../value-objects/movement-status.value-object';
import { ReferenceType } from '../value-objects/reference-type.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { IStockMovementLine } from './stock-movement-line.interface';

export interface IStockMovement {
  id: string;
  restaurantId: string;
  inventoryId: string;
  movementNumber: string;
  movementType: MovementType;
  reason: MovementReason;
  status: MovementStatus;
  referenceType?: ReferenceType;
  referenceId?: ReferenceId;
  movementDate: Date;
  lines: IStockMovementLine[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
