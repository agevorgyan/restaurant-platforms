import { PurchaseRequisitionNumber } from '../value-objects/purchase-requisition/purchase-requisition-number.value-object';
import { RequestedDeliveryDate } from '../value-objects/purchase-requisition/requested-delivery-date.value-object';
import { DepartmentReference } from '../value-objects/purchase-requisition/department-reference.value-object';

describe('Purchase Requisition Value Objects', () => {
  describe('PurchaseRequisitionNumber', () => {
    it('should create valid number', () => {
      const num = PurchaseRequisitionNumber.create('PR-12345');
      expect(num.value).toBe('PR-12345');
    });

    it('should fail on empty value', () => {
      expect(() => PurchaseRequisitionNumber.create('')).toThrow('PurchaseRequisitionNumber cannot be empty');
    });
  });

  describe('RequestedDeliveryDate', () => {
    it('should create valid future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const deliveryDate = RequestedDeliveryDate.create(futureDate);
      expect(deliveryDate.date).toBe(futureDate);
    });

    it('should fail on past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(() => RequestedDeliveryDate.create(pastDate)).toThrow('Requested delivery date must be in the future');
    });
  });

  describe('DepartmentReference', () => {
    it('should create valid reference', () => {
      const dept = DepartmentReference.create('HR-001', 'Human Resources');
      expect(dept.departmentId).toBe('HR-001');
      expect(dept.departmentName).toBe('Human Resources');
    });

    it('should fail on empty ID', () => {
      expect(() => DepartmentReference.create('')).toThrow('Department ID is required');
    });
  });
});
