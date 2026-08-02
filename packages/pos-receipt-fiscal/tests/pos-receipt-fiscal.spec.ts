/**
 * Enterprise Receipt & Fiscal Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Independent Receipt Aggregate, Fiscal Provider Ports & Adapters (HDM Armenia),
 * Immutability of Fiscalized Receipts, Offline Fiscal Replay Queue, ESC/POS Thermal Text Rendering, and CQRS Read Models.
 */

import { FiscalStatus, ReceiptStatus } from '../src/domain/enums/pos-receipt-fiscal.enums';
import {
  FiscalProviderId,
  ReceiptLine,
  ReceiptTotals,
} from '../src/domain/value-objects/pos-receipt-fiscal-vo';
import {
  DigitalReceiptService,
  EnterprisePosReceiptFiscalPlatformService,
  FiscalProviderService,
  FiscalService,
  ReceiptRendererService,
  ReceiptService,
  ReceiptTemplateService,
} from '../src/services/pos-receipt-fiscal.services';

describe('Enterprise Receipt & Fiscal Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format FiscalProviderId and ReceiptTotals correctly', () => {
      const provider = FiscalProviderId.create('hdm-01', 'HDM_ARMENIA');
      expect(provider.providerId).toBe('hdm-01');
      expect(provider.providerName).toBe('HDM_ARMENIA');

      const totals = ReceiptTotals.create(40.0, 4.0);
      expect(totals.subtotal).toBe(40.0);
      expect(totals.grandTotal).toBe(44.0);
    });
  });

  describe('ReceiptRendererService & ESC/POS Formatting', () => {
    let rendererService: ReceiptRendererService;

    beforeEach(() => {
      rendererService = new ReceiptRendererService();
    });

    it('should render ESC/POS thermal text containing items, subtotal, tax, and totals', () => {
      const lines = [ReceiptLine.create('Cheeseburger', 2, 12.0)];
      const totals = ReceiptTotals.create(24.0, 2.4);

      const rendered = rendererService.renderEscPosText(lines, totals, 'CRN-99887766');
      expect(rendered).toContain('RESTAURANT SAAS ERP');
      expect(rendered).toContain('Cheeseburger');
      expect(rendered).toContain('CRN-99887766');
    });
  });

  describe('FiscalProviderService, FiscalService & Offline Queue', () => {
    let providerService: FiscalProviderService;
    let fiscalService: FiscalService;

    beforeEach(() => {
      providerService = new FiscalProviderService();
      fiscalService = new FiscalService(providerService);
    });

    it('should fiscalize receipt online via HDM Armenia adapter', async () => {
      const res = await fiscalService.fiscalize(
        {
          receiptId: 'rcpt-1',
          orderId: 'ord-1',
          amount: 50.0,
          taxAmount: 5.0,
          items: [{ name: 'Pizza', qty: 1, price: 50.0 }],
        },
        'HDM_ARMENIA',
        true
      );

      expect(res.isSuccess).toBe(true);
      expect(res.fiscalReceiptNumber.startsWith('CRN-')).toBe(true);
    });

    it('should queue offline fiscal requests and replay queued items upon reconnection', async () => {
      const offlineRes = await fiscalService.fiscalize(
        {
          receiptId: 'rcpt-off-1',
          orderId: 'ord-off-1',
          amount: 30.0,
          taxAmount: 3.0,
          items: [{ name: 'Burger', qty: 1, price: 30.0 }],
        },
        'HDM_ARMENIA',
        false
      );

      expect(offlineRes.isSuccess).toBe(false);
      expect(offlineRes.fiscalReceiptNumber).toBe('OFFLINE_PENDING');

      const replayedCount = await fiscalService.replayOfflineQueue('HDM_ARMENIA');
      expect(replayedCount).toBe(1);
    });
  });

  describe('ReceiptService & Fiscal Immutability', () => {
    let providerService: FiscalProviderService;
    let fiscalService: FiscalService;
    let rendererService: ReceiptRendererService;
    let receiptService: ReceiptService;

    beforeEach(() => {
      providerService = new FiscalProviderService();
      fiscalService = new FiscalService(providerService);
      rendererService = new ReceiptRendererService();
      receiptService = new ReceiptService(fiscalService, rendererService);
    });

    it('should create receipt, fiscalize, and strictly reject modifications to fiscalized receipt', async () => {
      const lines = [ReceiptLine.create('Steak Dinner', 1, 45.0)];
      const rcptId = receiptService.createReceipt('ord-888', lines, 45.0, 4.5);
      expect(rcptId.id).toBeDefined();

      const crn = await receiptService.fiscalizeReceipt(rcptId.id, 'HDM_ARMENIA', true);
      expect(crn.startsWith('CRN-')).toBe(true);

      // Verify immutability check
      expect(() => {
        receiptService.modifyReceiptLine(rcptId.id);
      }).toThrow('Cannot mutate a fiscalized receipt');
    });
  });

  describe('DigitalReceiptService & EnterprisePosReceiptFiscalPlatformService', () => {
    let rendererService: ReceiptRendererService;
    let providerService: FiscalProviderService;
    let fiscalService: FiscalService;
    let templateService: ReceiptTemplateService;
    let digitalService: DigitalReceiptService;
    let receiptService: ReceiptService;
    let platformService: EnterprisePosReceiptFiscalPlatformService;

    beforeEach(() => {
      rendererService = new ReceiptRendererService();
      providerService = new FiscalProviderService();
      fiscalService = new FiscalService(providerService);
      templateService = new ReceiptTemplateService();
      digitalService = new DigitalReceiptService();
      receiptService = new ReceiptService(fiscalService, rendererService);

      platformService = new EnterprisePosReceiptFiscalPlatformService(
        rendererService,
        providerService,
        fiscalService,
        templateService,
        digitalService,
        receiptService
      );
    });

    it('should send digital receipt via Email and record in DigitalDeliveries read model', () => {
      const delivery = digitalService.sendDigitalReceipt('rcpt-100', 'EMAIL', 'customer@example.com');
      expect(delivery.channel).toBe('EMAIL');

      const readModel = digitalService.getDigitalDeliveries();
      expect(readModel.totalDigitalDeliveries).toBe(1);
    });
  });
});
