import { IDomainService } from '@saas/domain';
import { Schedule } from '../aggregates/schedule';
import { Shift } from '../aggregates/shift';
import { ScheduleConflict } from '../entities/schedule-conflict';

export class ScheduleConflictDetectionService implements IDomainService {
  public detectConflicts(schedule: Schedule, shifts: Shift[]): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    const staffShifts = new Map<string, Shift[]>();

    // Group shifts by staff
    for (const shift of shifts) {
      for (const assigned of shift.assignedEmployees.employees) {
        const staffId = assigned.staffId.toValue();
        if (!staffShifts.has(staffId)) {
          staffShifts.set(staffId, []);
        }
        staffShifts.get(staffId)!.push(shift);
      }
    }

    // Check overlaps
    for (const [staffId, staffShiftList] of staffShifts.entries()) {
      for (let i = 0; i < staffShiftList.length; i++) {
        for (let j = i + 1; j < staffShiftList.length; j++) {
          const shift1 = staffShiftList[i];
          const shift2 = staffShiftList[j];

          const start1 = shift1.shiftStartTime.toValue().getTime();
          const end1 = shift1.shiftEndTime.toValue().getTime();
          const start2 = shift2.shiftStartTime.toValue().getTime();
          const end2 = shift2.shiftEndTime.toValue().getTime();

          if (start1 < end2 && start2 < end1) {
            conflicts.push(ScheduleConflict.create(
              `Overlapping shifts for staff ${staffId}`,
              [shift1.id.toValue(), shift2.id.toValue()]
            ));
          }
        }
      }
    }
    return conflicts;
  }
}

export class SchedulePlanningService implements IDomainService {
  public calculateRequiredCoverage(expectedLoad: number): number {
    // Simple heuristic for required staff count based on expected load
    return Math.ceil(expectedLoad / 10);
  }
}

export class ScheduleOptimizationService implements IDomainService {
  public optimizeShiftPlacements(shifts: Shift[]): Shift[] {
    // In a real system, this would use a constraint solver
    // Here we just return the shifts
    return shifts;
  }
}
