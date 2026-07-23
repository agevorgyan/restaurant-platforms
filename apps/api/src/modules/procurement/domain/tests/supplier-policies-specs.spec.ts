import { SupplierConsistencySpecification, SupplierApprovalSpecification } from '../specifications/supplier.specification';
import { SupplierLifecyclePolicy, SupplierValidationPolicy, SupplierApprovalPolicy } from '../policies/supplier.policy';
import { SupplierStatus } from '../enums/procurement.enums';

describe('Supplier Policies and Specifications', () => {
  describe('SupplierConsistencySpecification', () => {
    it('should return false if no primary contact', () => {
      const result = SupplierConsistencySpecification.isActivatable(SupplierStatus.INACTIVE, [], [], undefined);
      expect(result).toBe(false);
    });
  });

  describe('SupplierApprovalSpecification', () => {
    it('should allow approval if inactive', () => {
      expect(SupplierApprovalSpecification.canBeApproved(SupplierStatus.INACTIVE)).toBe(true);
    });
    it('should not allow approval if blacklisted', () => {
      expect(SupplierApprovalSpecification.canBeApproved(SupplierStatus.BLACKLISTED)).toBe(false);
    });
  });

  describe('SupplierLifecyclePolicy', () => {
    it('should throw if blacklisted is activated', () => {
      expect(() => SupplierLifecyclePolicy.ensureCanActivate(SupplierStatus.BLACKLISTED, [], [], undefined))
        .toThrow('Cannot activate a blacklisted supplier');
    });

    it('should throw if not active and suspended', () => {
      expect(() => SupplierLifecyclePolicy.ensureCanSuspend(SupplierStatus.INACTIVE))
        .toThrow('Only active suppliers can be suspended');
    });
  });

  describe('SupplierValidationPolicy', () => {
    it('should throw if code changed while active', () => {
      expect(() => SupplierValidationPolicy.ensureCodeImmutable(true, 'NEW', 'OLD'))
        .toThrow('Supplier code is immutable after activation');
    });

    it('should pass if code unchanged while active', () => {
      expect(() => SupplierValidationPolicy.ensureCodeImmutable(true, 'OLD', 'OLD')).not.toThrow();
    });

    it('should pass if code changed while inactive', () => {
      expect(() => SupplierValidationPolicy.ensureCodeImmutable(false, 'NEW', 'OLD')).not.toThrow();
    });
  });

  describe('SupplierApprovalPolicy', () => {
    it('should throw if status cannot be approved', () => {
      expect(() => SupplierApprovalPolicy.ensureCanApprove(SupplierStatus.ACTIVE))
        .toThrow('Supplier is not in a state that can be approved');
    });
  });
});
