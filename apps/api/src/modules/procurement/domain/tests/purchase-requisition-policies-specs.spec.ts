import { PurchaseRequisitionLifecyclePolicy, RequisitionValidationPolicy } from '../policies/purchase-requisition.policy';
import { PurchaseRequisitionStatus } from '../enums/procurement.enums';

describe('Purchase Requisition Policies', () => {
  describe('PurchaseRequisitionLifecyclePolicy', () => {
    it('ensureCanApproveOrReject should throw if not submitted', () => {
      expect(() => PurchaseRequisitionLifecyclePolicy.ensureCanApproveOrReject(PurchaseRequisitionStatus.DRAFT))
        .toThrow('Only submitted or pending requisitions can be approved/rejected.');
    });

    it('ensureCanConvert should throw if not approved', () => {
      expect(() => PurchaseRequisitionLifecyclePolicy.ensureCanConvert(PurchaseRequisitionStatus.SUBMITTED))
        .toThrow('Requisition must be approved before conversion.');
    });
  });

  describe('RequisitionValidationPolicy', () => {
    it('should throw if number changed while submitted', () => {
      expect(() => RequisitionValidationPolicy.ensureNumberImmutable(true, 'NEW', 'OLD'))
        .toThrow('Purchase Requisition Number is immutable after submission.');
    });

    it('should pass if number unchanged while submitted', () => {
      expect(() => RequisitionValidationPolicy.ensureNumberImmutable(true, 'OLD', 'OLD')).not.toThrow();
    });
  });
});
