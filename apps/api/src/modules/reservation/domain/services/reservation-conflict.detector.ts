import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { ReservationConflictSpecification } from '../specifications/assignment.specifications';
import { ConflictReason } from '../value-objects/conflict-reason.value-object';

export class ReservationConflictDetector {
  private readonly specification = new ReservationConflictSpecification();

  public detectConflicts(context: TableAssignmentContext, allocations: any[]): { hasConflict: boolean, reason?: ConflictReason } {
    // Determine start and end times for context (mocking times based on context date/time)
    const [hours, minutes] = context.reservationTime.time.split(':').map(Number);
    const startTime = new Date(context.reservationDate.date);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime.getTime() + context.reservationDuration.minutes * 60000);

    const isClear = this.specification.isSatisfiedBy(allocations, startTime, endTime);
    
    if (!isClear) {
      return { hasConflict: true, reason: ConflictReason.create('Temporal overlap with existing table allocation') };
    }

    return { hasConflict: false };
  }
}