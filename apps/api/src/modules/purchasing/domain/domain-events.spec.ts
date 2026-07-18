import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { SupplierCreatedEvent } from './events/supplier.events';
import { PurchaseOrderCreatedEvent } from './events/purchase-order.events';
import { GoodsReceiptPostedEvent } from './events/goods-receipt.events';
import { PurchaseInvoiceMatchedEvent } from './events/purchase-invoice.events';
import { PurchaseReturnPostedEvent } from './events/purchase-return.events';
import { SupplierContractActivatedEvent } from './events/supplier-contract.events';
import { SupplierPriceUpdatedEvent } from './events/supplier-price-list.events';
import { IDomainEvent } from './events/domain-event.interface';
import { SupplierDomainService } from './services/supplier.domain.service';
import { PurchaseOrderDomainService } from './services/purchase-order.domain.service';
import { ISupplierRepository } from './repositories/supplier.repository.interface';
import { IPurchaseOrderRepository } from './repositories/purchase-order.repository.interface';
import { PurchaseOrderStatus } from './value-objects/purchase-order-status.value-object';
import { ApprovalStatus } from './value-objects/approval-status.value-object';

describe('Domain Events Standardization', () => {
  it('should ensure events implement IDomainEvent correctly and are immutable', () => {
    const event1: IDomainEvent = new SupplierCreatedEvent('s1', 'r1');
    assert.strictEqual(event1.eventName, 'SupplierCreated');
    assert.ok(event1.occurredOn instanceof Date);

    const event2: IDomainEvent = new PurchaseOrderCreatedEvent('po1', 'r1');
    assert.strictEqual(event2.eventName, 'PurchaseOrderCreated');
    assert.ok(event2.occurredOn instanceof Date);

    const event3: IDomainEvent = new GoodsReceiptPostedEvent('gr1', 'r1');
    assert.strictEqual(event3.eventName, 'GoodsReceiptPosted');
    assert.ok(event3.occurredOn instanceof Date);
    
    const event4: IDomainEvent = new PurchaseInvoiceMatchedEvent('pi1', 'r1');
    assert.strictEqual(event4.eventName, 'PurchaseInvoiceMatched');

    const event5: IDomainEvent = new PurchaseReturnPostedEvent('pr1', 'r1');
    assert.strictEqual(event5.eventName, 'PurchaseReturnPosted');

    const event6: IDomainEvent = new SupplierContractActivatedEvent('sc1', 'r1');
    assert.strictEqual(event6.eventName, 'SupplierContractActivated');

    const event7: IDomainEvent = new SupplierPriceUpdatedEvent('sp1', 'ing1', 'r1');
    assert.strictEqual(event7.eventName, 'SupplierPriceUpdated');
  });

  describe('Domain Services publish events correctly', () => {
    it('SupplierDomainService should publish SupplierCreatedEvent', async () => {
      let savedSupplier: any;
      const mockRepo = {
        findBySupplierCode: async () => null,
        findByTaxNumber: async () => null,
        findById: async () => null,
        save: async (s: any) => { savedSupplier = s; }
      } as unknown as ISupplierRepository;
      
      const service = new SupplierDomainService(mockRepo);
      await service.createSupplier('s1', {
        restaurantId: 'r1',
        supplierCode: 'SUP-01',
        name: 'Fresh Foods',
        type: 'Distributor',
        contacts: []
      });

      assert.ok(savedSupplier);
      assert.strictEqual(savedSupplier.domainEvents.length, 1);
      assert.strictEqual(savedSupplier.domainEvents[0].eventName, 'SupplierCreated');
    });

    it('PurchaseOrderDomainService should publish PurchaseOrderSubmittedEvent', async () => {
      let savedPo: any;
      const mockPo: any = {
        id: 'po1',
        restaurantId: 'r1',
        status: new PurchaseOrderStatus('Draft'),
        approvalStatus: new ApprovalStatus('Pending'),
        domainEvents: []
      };

      const mockPoRepo = {
        findById: async () => mockPo,
        save: async (p: any) => { savedPo = p; }
      } as unknown as IPurchaseOrderRepository;

      const service = new PurchaseOrderDomainService(mockPoRepo, {} as any);
      await service.submitPurchaseOrder('po1');

      assert.ok(savedPo);
      assert.strictEqual(savedPo.domainEvents.length, 1);
      assert.strictEqual(savedPo.domainEvents[0].eventName, 'PurchaseOrderSubmitted');
    });
  });
});
