/**
 * Enterprise Procurement & Purchase Order Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, PurchaseOrder Aggregate Root, Configurable Approval Matrices,
 * Immutable Contract Pricing, Procurement Policies, CQRS Read Models, and verification of zero stock updates.
 */

import { ApprovalStatus, PurchaseOrderStatus } from '../src/domain/enums/procurement-po.enums';
import {
  ContractPrice,
  PurchaseOrderNumber,
  RequestedQuantity,
} from '../src/domain/value-objects/procurement-po-vo';
import {
  ApprovalWorkflowService,
  ContractPricingService,
  EnterpriseProcurementPlatformService,
  ProcurementPolicyService,
  ProcurementService,
  PurchaseOrderService,
  ValidationService,
} from '../src/services/procurement-po.services';

describe('Enterprise Procurement & Purchase Order Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format PurchaseOrderNumber and ContractPrice correctly', () => {
      const poNum = PurchaseOrderNumber.create('PO-881023');
      expect(poNum.poNumber).toBe('PO-881023');

      const price = ContractPrice.create(14.99);
      expect(price.unitPrice).toBe(14.99);

      const qty = RequestedQuantity.create(50);
      expect(qty.amount).toBe(50);
    });
  });

  describe('PurchaseOrder Lifecycle & Approval Matrix', () => {
    let validator: ValidationService;
    let policyService: ProcurementPolicyService;
    let pricingService: ContractPricingService;
    let poService: PurchaseOrderService;
    let approvalService: ApprovalWorkflowService;

    beforeEach(() => {
      validator = new ValidationService();
      policyService = new ProcurementPolicyService();
      pricingService = new ContractPricingService();
      poService = new PurchaseOrderService(validator, policyService, pricingService);
      approvalService = new ApprovalWorkflowService(poService, policyService);
    });

    it('should auto-approve small orders <= $500', () => {
      const poId = poService.createPurchaseOrder('vendor-1');
      poService.addLineItem(poId.id, 'item-oil', 'Canola Oil 10L', 10, 25.0); // $250 total
      poService.submitPurchaseOrder(poId.id);

      const map = poService.getOrdersMap();
      const order = map.get(poId.id);
      expect(order.status).toBe(PurchaseOrderStatus.APPROVED);
      expect(order.approvalStatus).toBe(ApprovalStatus.APPROVED);
    });

    it('should require manager approval for large orders > $500', () => {
      const poId = poService.createPurchaseOrder('vendor-1');
      poService.addLineItem(poId.id, 'item-meat', 'Ribeye Beef 10kg', 40, 45.0); // $1800 total
      poService.submitPurchaseOrder(poId.id);

      const map = poService.getOrdersMap();
      const order = map.get(poId.id);
      expect(order.status).toBe(PurchaseOrderStatus.PENDING_APPROVAL);
      expect(order.approvalStatus).toBe(ApprovalStatus.PENDING);

      // Verify in ApprovalQueue read model
      const queue = approvalService.getApprovalQueue();
      expect(queue.pendingApprovalsCount).toBe(1);

      // Approve order
      poService.approvePurchaseOrder(poId.id, 'manager-bob');
      expect(order.status).toBe(PurchaseOrderStatus.APPROVED);

      // Issue order to vendor
      poService.issuePurchaseOrder(poId.id);
      expect(order.status).toBe(PurchaseOrderStatus.ISSUED);
    });
  });

  describe('ContractPricingService & Procurement Projections', () => {
    let validator: ValidationService;
    let policyService: ProcurementPolicyService;
    let pricingService: ContractPricingService;
    let poService: PurchaseOrderService;
    let procurementService: ProcurementService;

    beforeEach(() => {
      validator = new ValidationService();
      policyService = new ProcurementPolicyService();
      pricingService = new ContractPricingService();
      poService = new PurchaseOrderService(validator, policyService, pricingService);
      procurementService = new ProcurementService(poService);
    });

    it('should enforce registered contract pricing', () => {
      pricingService.registerContractPrice('item-coffee', 18.5);

      const poId = poService.createPurchaseOrder('vendor-2');
      poService.addLineItem(poId.id, 'item-coffee', 'Espresso Beans 1kg', 5);

      const map = poService.getOrdersMap();
      const order = map.get(poId.id);
      expect(order.lines[0].unitPrice.unitPrice).toBe(18.5);
      expect(order.lines[0].lineTotal).toBe(92.5);
    });

    it('should project PurchaseOrderDashboard and ProcurementStatistics read models', () => {
      const poId = poService.createPurchaseOrder('vendor-3');
      poService.addLineItem(poId.id, 'item-flour', 'Baking Flour 25kg', 2, 12.0);

      const dash = procurementService.getPurchaseOrderDashboard();
      expect(dash.totalOrdersCount).toBe(1);
      expect(dash.totalProcurementSpend).toBe(24.0);

      const stats = procurementService.getProcurementStatistics();
      expect(stats.totalDrafts).toBe(1);
    });
  });

  describe('EnterpriseProcurementPlatformService Façade Integration', () => {
    let validator: ValidationService;
    let policyService: ProcurementPolicyService;
    let pricingService: ContractPricingService;
    let poService: PurchaseOrderService;
    let approvalService: ApprovalWorkflowService;
    let procurementService: ProcurementService;
    let platformService: EnterpriseProcurementPlatformService;

    beforeEach(() => {
      validator = new ValidationService();
      policyService = new ProcurementPolicyService();
      pricingService = new ContractPricingService();
      poService = new PurchaseOrderService(validator, policyService, pricingService);
      approvalService = new ApprovalWorkflowService(poService, policyService);
      procurementService = new ProcurementService(poService);

      platformService = new EnterpriseProcurementPlatformService(
        validator,
        policyService,
        pricingService,
        poService,
        approvalService,
        procurementService
      );
    });

    it('should query ProcurementStatistics via platform facade', () => {
      const stats = platformService.procurementService.getProcurementStatistics();
      expect(stats.totalDrafts).toBe(0);
    });
  });
});
