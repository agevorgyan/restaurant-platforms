import { RequisitionLine } from '../entities/purchase-requisition/requisition-line.entity';
import { ApprovalStep } from '../entities/purchase-requisition/approval-step.entity';
import { ApprovalStatus } from '../enums/procurement.enums';
import { ApprovalLevel } from '../value-objects/purchase-requisition/approval-level.value-object';
import { ApprovedBy } from '../value-objects/purchase-requisition/approved-by.value-object';
import { MoneyReference } from '../value-objects/money-reference.value-object';

describe('Purchase Requisition Entities', () => {
  describe('RequisitionLine', () => {
    it('should create valid line', () => {
      const line = RequisitionLine.create({
        description: 'Laptops',
        quantity: 5,
        unitOfMeasure: 'pcs',
        estimatedUnitPrice: MoneyReference.create(1000, 'USD')
      });
      expect(line.description).toBe('Laptops');
      expect(line.quantity).toBe(5);
      expect(line.getEstimatedTotal()).toBe(5000);
    });

    it('should fail if quantity is not positive', () => {
      expect(() => {
        RequisitionLine.create({
          description: 'Laptops',
          quantity: 0,
          unitOfMeasure: 'pcs'
        });
      }).toThrow('Requisition line quantity must be positive');
    });
  });

  describe('ApprovalStep', () => {
    it('should create pending step', () => {
      const step = ApprovalStep.create({
        level: ApprovalLevel.create(1),
        assignedRoleOrUser: 'Manager'
      });
      expect(step.status).toBe(ApprovalStatus.PENDING);
    });

    it('should approve successfully', () => {
      const step = ApprovalStep.create({
        level: ApprovalLevel.create(1),
        assignedRoleOrUser: 'Manager'
      });
      step.approve(ApprovedBy.create('user123'));
      expect(step.status).toBe(ApprovalStatus.APPROVED);
    });

    it('should reject successfully', () => {
      const step = ApprovalStep.create({
        level: ApprovalLevel.create(1),
        assignedRoleOrUser: 'Manager'
      });
      step.reject('Budget too high');
      expect(step.status).toBe(ApprovalStatus.REJECTED);
      expect(step.comments).toBe('Budget too high');
    });
  });
});
