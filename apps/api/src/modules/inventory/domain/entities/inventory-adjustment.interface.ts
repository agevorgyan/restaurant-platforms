import { AdjustmentType } from '../value-objects/adjustment-type.value-object';
import { AdjustmentReason } from '../value-objects/adjustment-reason.value-object';
import { AdjustmentStatus } from '../value-objects/adjustment-status.value-object';
import { ApprovalStatus } from '../value-objects/approval-status.value-object';
import { ReferenceType } from '../value-objects/reference-type.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { IInventoryAdjustmentLine } from './inventory-adjustment-line.interface';

export interface IInventoryAdjustment {
  id: string;
  restaurantId: string;
  inventoryId: string;
  adjustmentNumber: string;
  adjustmentType: AdjustmentType;
  reason: AdjustmentReason;
  status: AdjustmentStatus;
  approvalStatus: ApprovalStatus;
  adjustmentDate: Date;
  referenceType?: ReferenceType;
  referenceId?: ReferenceId;
  lines: IInventoryAdjustmentLine[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
