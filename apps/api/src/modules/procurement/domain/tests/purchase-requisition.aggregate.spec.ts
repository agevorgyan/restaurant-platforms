import { PurchaseRequisition } from '../aggregates/purchase-requisition.aggregate';
import { PurchaseRequisitionNumber } from '../value-objects/purchase-requisition/purchase-requisition-number.value-object';
import { RequisitionLine } from '../entities/purchase-requisition/requisition-line.entity';
import { RequesterInformation } from '../entities/purchase-requisition/requester-information.entity';
import { RequestedBy } from '../value-objects/purchase-requisition/requested-by.value-object';
import { DepartmentReference } from '../value-objects/purchase-requisition/department-reference.value-object';
import { PurchaseRequisitionStatus } from '../enums/procurement.enums';

describe('Purchase Requisition Aggregate', () => {
  let pr: PurchaseRequisition;

  beforeEach(() => {
    pr = PurchaseRequisition.create(PurchaseRequisitionNumber.create('PR-001'));
  });

  it('should create in DRAFT state', () => {
    expect(pr.status).toBe(PurchaseRequisitionStatus.DRAFT);
    expect(pr.domainEvents.length).toBe(1);
    expect(pr.domainEvents[0].constructor.name).toBe('PurchaseRequisitionCreatedEvent');
  });

  it('should not submit without lines and requester info', () => {
    expect(() => pr.submit()).toThrow('Cannot submit requisition');
  });

  it('should submit successfully when consistency is met', () => {
    pr.addLine(RequisitionLine.create({ description: 'Pen', quantity: 10, unitOfMeasure: 'pcs' }));
    pr.setRequesterInformation(RequesterInformation.create({
      requestedBy: RequestedBy.create('user1'),
      department: DepartmentReference.create('D1')
    }));

    pr.submit();
    expect(pr.status).toBe(PurchaseRequisitionStatus.SUBMITTED);
  });

  it('should not allow modification after conversion', () => {
    pr.addLine(RequisitionLine.create({ description: 'Pen', quantity: 10, unitOfMeasure: 'pcs' }));
    pr.setRequesterInformation(RequesterInformation.create({
      requestedBy: RequestedBy.create('user1'),
      department: DepartmentReference.create('D1')
    }));
    pr.submit();
    pr.approve();
    pr.convertToPurchaseOrder('PO-123');

    expect(() => pr.addLine(RequisitionLine.create({ description: 'Paper', quantity: 5, unitOfMeasure: 'ream' }))).toThrow('Requisition cannot be modified in its current state');
  });
});
