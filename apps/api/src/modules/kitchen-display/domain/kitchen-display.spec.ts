import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { DisplayLayout } from './value-objects/display-layout.value-object';
import { DisplayStatus } from './value-objects/display-status.value-object';
import { DisplayRefreshPolicy } from './value-objects/display-refresh-policy.value-object';
import { DisplayConfiguration } from './value-objects/display-configuration.value-object';
import { DisplayFilter } from './value-objects/display-filter.value-object';
import { validateCreateKitchenDisplay, validateUpdateKitchenDisplay } from '../application/validation/kitchen-display.schema';
import { KitchenDisplayDomainService } from './services/kitchen-display.domain.service';
import { IKitchenDisplayRepository } from './repositories/kitchen-display.repository.interface';
import { IKitchenDisplay } from './entities/kitchen-display.interface';

describe('Kitchen Display Domain', () => {
  describe('Value Objects', () => {
    it('DisplayLayout should validate types', () => {
      assert.doesNotThrow(() => new DisplayLayout('Grid'));
      assert.throws(() => new DisplayLayout('Invalid' as any), /Invalid display layout/);
    });

    it('DisplayStatus should validate status', () => {
      assert.doesNotThrow(() => new DisplayStatus('Active'));
      assert.throws(() => new DisplayStatus('Invalid' as any), /Invalid display status/);
      assert.strictEqual(new DisplayStatus('Active').isActive(), true);
      assert.strictEqual(new DisplayStatus('Inactive').isActive(), false);
    });

    it('DisplayRefreshPolicy should validate interval', () => {
      assert.doesNotThrow(() => new DisplayRefreshPolicy(10));
      assert.throws(() => new DisplayRefreshPolicy(0), /Refresh interval must be an integer greater than zero/);
    });

    it('DisplayConfiguration should validate flags', () => {
      assert.doesNotThrow(() => new DisplayConfiguration(true, false, true));
      assert.throws(() => new DisplayConfiguration('true' as any, false, true), /Configuration flags must be booleans/);
    });

    it('DisplayFilter should validate arrays', () => {
      assert.doesNotThrow(() => new DisplayFilter(['Food'], ['High']));
      assert.throws(() => new DisplayFilter('Food' as any, []), /Categories filter must be an array/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateKitchenDisplayDto', () => {
      const errors = validateCreateKitchenDisplay({
        restaurantId: '',
        branchId: '',
        kitchenId: '',
        stationId: '',
        name: '',
        layout: '',
        refreshIntervalSeconds: 0,
        configuration: null as any,
        filters: null as any
      });
      assert.strictEqual(errors.includes('name is required'), true);
      assert.strictEqual(errors.includes('refreshIntervalSeconds must be an integer greater than zero'), true);
      assert.strictEqual(errors.includes('configuration is required'), true);
    });
    
    it('should validate UpdateKitchenDisplayDto', () => {
      const errors = validateUpdateKitchenDisplay({ refreshIntervalSeconds: -1 });
      assert.strictEqual(errors.includes('refreshIntervalSeconds must be an integer greater than zero'), true);
    });
  });

  describe('Domain Service', () => {
    let mockDisplay: IKitchenDisplay;
    
    const mockRepo: IKitchenDisplayRepository = {
      findById: async () => mockDisplay,
      findByNameAndStationId: async () => null,
      save: async (d) => { mockDisplay = d; }
    };

    it('should create a display in Inactive state', async () => {
      const service = new KitchenDisplayDomainService(mockRepo);
      const display = await service.createDisplay('d1', {
        restaurantId: 'r1',
        branchId: 'b1',
        kitchenId: 'k1',
        stationId: 's1',
        name: 'Main Screen',
        layout: 'Grid',
        refreshIntervalSeconds: 10,
        configuration: {
          showCompletedTickets: true,
          showTimers: true,
          audioAlertsEnabled: false
        },
        filters: {}
      });

      assert.strictEqual(display.id, 'd1');
      assert.strictEqual(display.status.isActive(), false);
    });

    it('should prevent receiving updates if Inactive', async () => {
      const service = new KitchenDisplayDomainService(mockRepo);
      try {
        await service.receiveTicketUpdate('d1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Active displays may receive updates');
      }
    });

    it('should activate display and receive updates', async () => {
      const service = new KitchenDisplayDomainService(mockRepo);
      await service.activateDisplay('d1');
      assert.strictEqual(mockDisplay.status.isActive(), true);
      
      assert.doesNotThrow(async () => {
        await service.receiveTicketUpdate('d1');
      });
    });

    it('should update display', async () => {
      const service = new KitchenDisplayDomainService(mockRepo);
      await service.updateDisplay('d1', { layout: 'Kanban', refreshIntervalSeconds: 15 });
      assert.strictEqual(mockDisplay.layout.value, 'Kanban');
      assert.strictEqual(mockDisplay.refreshPolicy.intervalSeconds, 15);
    });
  });
});
