import { TableAssignmentEngine } from '../services/table-assignment.engine';
import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { ReservationReference } from '../value-objects/reservation-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { RequiredCapacity } from '../value-objects/required-capacity.value-object';
import { TableReference } from '../value-objects/table-reference.value-object';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';

describe('TableAssignmentEngine', () => {
  let engine: TableAssignmentEngine;
  let mockPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    mockPublisher = { publish: jest.fn(), publishAll: jest.fn() } as unknown as jest.Mocked<EventPublisher>;
    engine = new TableAssignmentEngine(mockPublisher);
  });

  const createContext = (capacity: number) => {
    return new TableAssignmentContext(
      ReservationReference.create('res-1'),
      BranchReference.create('branch-1'),
      ReservationDate.create(new Date()),
      ReservationTime.create('19:00'),
      ReservationDuration.create(90),
      RequiredCapacity.create(capacity)
    );
  };

  it('should approve assignment when capacity and availability are sufficient', () => {
    const context = createContext(4);
    const tables = [
      { ref: TableReference.create('table-1'), capacity: 2 },
      { ref: TableReference.create('table-2'), capacity: 4 }
    ];
    const allocations: any[] = [];

    const decision = engine.execute(context, tables, allocations);

    expect(decision.approved).toBe(true);
    expect(decision.rejected).toBe(false);
    expect(decision.suggestedTableReferences.length).toBe(1);
    expect(decision.suggestedTableReferences[0].tableId).toBe('table-2');
    expect(decision.assignedCapacity).toBe(4);
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  it('should reject assignment when capacity is insufficient', () => {
    const context = createContext(10);
    const tables = [
      { ref: TableReference.create('table-1'), capacity: 4 }
    ];
    const allocations: any[] = [];

    const decision = engine.execute(context, tables, allocations);

    expect(decision.approved).toBe(false);
    expect(decision.rejected).toBe(true);
    expect(decision.reasons[0].reason).toContain('Insufficient capacity');
  });

  it('should reject assignment when there is a temporal conflict', () => {
    const context = createContext(4);
    const tables = [
      { ref: TableReference.create('table-1'), capacity: 4 }
    ];
    
    // Simulate an existing allocation that overlaps
    const startTime = new Date(context.reservationDate.date);
    startTime.setHours(18, 30, 0, 0);
    const endTime = new Date(startTime.getTime() + 120 * 60000); // 18:30 to 20:30

    const allocations: any[] = [
      { startTime, endTime }
    ];

    const decision = engine.execute(context, tables, allocations);

    expect(decision.approved).toBe(false);
    expect(decision.reasons[0].reason).toContain('overlap');
  });
});