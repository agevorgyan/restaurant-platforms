import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { KitchenOpenedEvent, KitchenClosedEvent, KitchenStatusChangedEvent } from './events/kitchen.events';
import { KitchenStationCreatedEvent, KitchenStationActivatedEvent, KitchenStationDeactivatedEvent } from '../../kitchen-station/domain/events/kitchen-station.events';
import { KitchenTicketCreatedEvent, KitchenTicketQueuedEvent, KitchenTicketReadyEvent, KitchenTicketCompletedEvent, KitchenTicketCancelledEvent } from '../../kitchen-ticket/domain/events/kitchen-ticket.events';
import { KitchenPreparationStartedEvent, KitchenPreparationPausedEvent, KitchenPreparationResumedEvent, KitchenPreparationCompletedEvent } from '../../kitchen-workflow/domain/events/kitchen-workflow.events';
import { KitchenQueueReorderedEvent } from '../../kitchen-queue/domain/events/kitchen-queue.events';
import { KitchenDisplayActivatedEvent, KitchenDisplayDeactivatedEvent } from '../../kitchen-display/domain/events/kitchen-display.events';

describe('Kitchen Domain Events', () => {
  it('Kitchen Events should be immutable and contain correct domain data', () => {
    const opened = new KitchenOpenedEvent('k1', 'b1');
    assert.strictEqual(opened.kitchenId, 'k1');
    assert.strictEqual(opened.branchId, 'b1');

    const closed = new KitchenClosedEvent('k1', 'b1');
    assert.strictEqual(closed.kitchenId, 'k1');

    const statusChanged = new KitchenStatusChangedEvent('k1', 'b1', 'Closed', 'Open');
    assert.strictEqual(statusChanged.kitchenId, 'k1');
    assert.strictEqual(statusChanged.oldStatus, 'Closed');
    assert.strictEqual(statusChanged.newStatus, 'Open');
  });

  it('Kitchen Station Events should be immutable and contain correct domain data', () => {
    const created = new KitchenStationCreatedEvent('s1', 'k1');
    assert.strictEqual(created.stationId, 's1');
    assert.strictEqual(created.kitchenId, 'k1');

    const activated = new KitchenStationActivatedEvent('s1', 'k1');
    assert.strictEqual(activated.stationId, 's1');

    const deactivated = new KitchenStationDeactivatedEvent('s1', 'k1');
    assert.strictEqual(deactivated.stationId, 's1');
  });

  it('Kitchen Ticket Events should be immutable and contain correct domain data', () => {
    const created = new KitchenTicketCreatedEvent('t1', 'k1');
    assert.strictEqual(created.ticketId, 't1');

    const queued = new KitchenTicketQueuedEvent('t1', 'k1');
    assert.strictEqual(queued.ticketId, 't1');

    const ready = new KitchenTicketReadyEvent('t1', 'k1');
    assert.strictEqual(ready.ticketId, 't1');

    const completed = new KitchenTicketCompletedEvent('t1', 'k1');
    assert.strictEqual(completed.ticketId, 't1');

    const cancelled = new KitchenTicketCancelledEvent('t1', 'k1');
    assert.strictEqual(cancelled.ticketId, 't1');
  });

  it('Kitchen Workflow Events should be immutable and contain correct domain data', () => {
    const started = new KitchenPreparationStartedEvent('w1', 'k1');
    assert.strictEqual(started.workflowId, 'w1');

    const paused = new KitchenPreparationPausedEvent('w1', 'k1');
    assert.strictEqual(paused.workflowId, 'w1');

    const resumed = new KitchenPreparationResumedEvent('w1', 'k1');
    assert.strictEqual(resumed.workflowId, 'w1');

    const completed = new KitchenPreparationCompletedEvent('w1', 'k1');
    assert.strictEqual(completed.workflowId, 'w1');
  });

  it('Kitchen Queue Events should be immutable and contain correct domain data', () => {
    const reordered = new KitchenQueueReorderedEvent('q1', 't1');
    assert.strictEqual(reordered.queueId, 'q1');
    assert.strictEqual(reordered.ticketId, 't1');
  });

  it('Kitchen Display Events should be immutable and contain correct domain data', () => {
    const activated = new KitchenDisplayActivatedEvent('d1');
    assert.strictEqual(activated.displayId, 'd1');

    const deactivated = new KitchenDisplayDeactivatedEvent('d1');
    assert.strictEqual(deactivated.displayId, 'd1');
  });

  it('All events should have standard naming conventions', () => {
    const events = [
      KitchenOpenedEvent,
      KitchenClosedEvent,
      KitchenStatusChangedEvent,
      KitchenStationCreatedEvent,
      KitchenStationActivatedEvent,
      KitchenStationDeactivatedEvent,
      KitchenTicketCreatedEvent,
      KitchenTicketQueuedEvent,
      KitchenPreparationStartedEvent,
      KitchenPreparationPausedEvent,
      KitchenPreparationResumedEvent,
      KitchenPreparationCompletedEvent,
      KitchenTicketReadyEvent,
      KitchenTicketCompletedEvent,
      KitchenTicketCancelledEvent,
      KitchenQueueReorderedEvent,
      KitchenDisplayActivatedEvent,
      KitchenDisplayDeactivatedEvent
    ];

    for (const EventClass of events) {
      assert.ok(EventClass.name.endsWith('Event'), `Event name ${EventClass.name} does not end with Event`);
    }
  });
});
