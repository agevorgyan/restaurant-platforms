import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { QueueCapacity } from './value-objects/queue-capacity.value-object';
import { QueuePosition } from './value-objects/queue-position.value-object';
import { QueuePriority } from './value-objects/queue-priority.value-object';
import { validateCreateKitchenQueue, validateEnqueueTicket, validateReorderTicket } from '../application/validation/kitchen-queue.schema';
import { KitchenQueueDomainService } from './services/kitchen-queue.domain.service';
import { IKitchenQueueRepository } from './repositories/kitchen-queue.repository.interface';
import { IKitchenQueue } from './entities/kitchen-queue.interface';

describe('Kitchen Queue Domain', () => {
  describe('Value Objects', () => {
    it('QueueCapacity should create valid capacity', () => {
      assert.doesNotThrow(() => new QueueCapacity(10));
      assert.throws(() => new QueueCapacity(0), /Queue capacity must be an integer greater than zero/);
      assert.throws(() => new QueueCapacity(-5), /Queue capacity must be an integer greater than zero/);
    });

    it('QueueCapacity should accurately detect when exceeded', () => {
      const capacity = new QueueCapacity(5);
      assert.strictEqual(capacity.isExceeded(4), false);
      assert.strictEqual(capacity.isExceeded(5), true);
      assert.strictEqual(capacity.isExceeded(6), true);
    });

    it('QueuePosition should create valid positions', () => {
      assert.doesNotThrow(() => new QueuePosition(0));
      assert.doesNotThrow(() => new QueuePosition(10));
      assert.throws(() => new QueuePosition(-1), /Queue position must be a non-negative integer/);
    });

    it('QueuePriority should create valid priorities and weights', () => {
      const p1 = new QueuePriority('Low');
      const p2 = new QueuePriority('Rush');
      assert.strictEqual(p1.getWeight(), 1);
      assert.strictEqual(p2.getWeight(), 4);
      assert.throws(() => new QueuePriority('Invalid' as any), /Invalid queue priority/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateKitchenQueueDto', () => {
      const errors = validateCreateKitchenQueue({
        restaurantId: '',
        branchId: '',
        kitchenId: '',
        stationId: '',
        strategy: '',
        capacity: 0
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('stationId is required'), true);
      assert.strictEqual(errors.includes('capacity must be an integer greater than zero'), true);
    });

    it('should validate EnqueueTicketDto', () => {
      const errors = validateEnqueueTicket({ ticketId: '', priority: '' });
      assert.strictEqual(errors.includes('ticketId is required'), true);
      assert.strictEqual(errors.includes('priority is required'), true);
    });

    it('should validate ReorderTicketDto', () => {
      const errors = validateReorderTicket({ ticketId: '', newPosition: -5 });
      assert.strictEqual(errors.includes('ticketId is required'), true);
      assert.strictEqual(errors.includes('newPosition must be a non-negative integer'), true);
    });
  });

  describe('Domain Service', () => {
    let mockQueue: IKitchenQueue;
    
    const mockRepo: IKitchenQueueRepository = {
      findById: async () => mockQueue,
      findByStationId: async () => null,
      save: async (q) => { mockQueue = q; }
    };
    
    it('should create a valid queue', async () => {
      const service = new KitchenQueueDomainService(mockRepo);
      mockQueue = await service.createQueue('q1', {
        restaurantId: 'r1',
        branchId: 'b1',
        kitchenId: 'k1',
        stationId: 's1',
        strategy: 'FIFO',
        capacity: 5
      });
      assert.strictEqual(mockQueue.id, 'q1');
      assert.strictEqual(mockQueue.strategy, 'FIFO');
    });

    it('should prevent enqueueing if ticket status is not Queued', async () => {
      const service = new KitchenQueueDomainService(mockRepo);
      try {
        await service.enqueueTicket('q1', { ticketId: 't1', priority: 'Normal' }, 'Pending');
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only tickets in Queued state may enter the queue');
      }
    });

    it('should enqueue ticket and respect capacity', async () => {
      const service = new KitchenQueueDomainService(mockRepo);
      
      await service.enqueueTicket('q1', { ticketId: 't1', priority: 'Normal' }, 'Queued');
      assert.strictEqual(mockQueue.tickets.length, 1);

      await service.enqueueTicket('q1', { ticketId: 't2', priority: 'Normal' }, 'Queued');
      await service.enqueueTicket('q1', { ticketId: 't3', priority: 'Normal' }, 'Queued');
      await service.enqueueTicket('q1', { ticketId: 't4', priority: 'Normal' }, 'Queued');
      await service.enqueueTicket('q1', { ticketId: 't5', priority: 'Normal' }, 'Queued');

      try {
        await service.enqueueTicket('q1', { ticketId: 't6', priority: 'Normal' }, 'Queued');
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Queue capacity exceeded');
      }
    });

    it('should reorder ticket manually if not FIFO', async () => {
      mockQueue.strategy = 'Priority';
      const service = new KitchenQueueDomainService(mockRepo);
      await service.reorderTicket('q1', { ticketId: 't5', newPosition: 0 });
      assert.strictEqual(mockQueue.tickets[0].ticketId, 't5');
      assert.strictEqual(mockQueue.tickets[0].position.position, 0);
    });

    it('should prevent reordering if FIFO', async () => {
      mockQueue.strategy = 'FIFO';
      const service = new KitchenQueueDomainService(mockRepo);
      try {
        await service.reorderTicket('q1', { ticketId: 't1', newPosition: 1 });
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Reordering is not allowed for FIFO strategy');
      }
    });

    it('should remove completed or cancelled tickets', async () => {
      const service = new KitchenQueueDomainService(mockRepo);
      await service.removeCompletedOrCancelledTicket('q1', 't1', 'Completed');
      assert.strictEqual(mockQueue.tickets.find(t => t.ticketId === 't1'), undefined);
    });

    it('should throw when removing ticket with invalid status via strict method', async () => {
      const service = new KitchenQueueDomainService(mockRepo);
      try {
        await service.removeCompletedOrCancelledTicket('q1', 't2', 'Ready');
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Completed or Cancelled tickets can be removed via this method');
      }
    });
  });
});
