import { IDomainService } from '@saas/domain';
import { Shift } from '../aggregates/shift';
import { StaffId } from '../value-objects/staff-id';
import { EmployeeAvailableSpecification, ShiftCapacitySpecification, ShiftTimeSpecification } from '../rules/shift-rules';

export class ShiftValidationService implements IDomainService {
  constructor(private readonly shiftTimeSpec: ShiftTimeSpecification) {}

  public validateShiftTimes(startTime: Date, endTime: Date): void {
    const isValid = this.shiftTimeSpec.isSatisfiedBy({ startTime, endTime });
    if (!isValid) {
      throw new Error('Shift start time must be before end time.');
    }
  }
}

export class ShiftConflictService implements IDomainService {
  public checkConflicts(staffId: StaffId, newShift: Shift, existingShifts: Shift[]): boolean {
    // Check if the new shift overlaps with any existing assigned shifts for this staff member
    const newStart = newShift.shiftStartTime.toValue().getTime();
    const newEnd = newShift.shiftEndTime.toValue().getTime();

    for (const shift of existingShifts) {
      if (shift.assignedEmployees.has(staffId)) {
        const existStart = shift.shiftStartTime.toValue().getTime();
        const existEnd = shift.shiftEndTime.toValue().getTime();

        // Overlap condition
        if (newStart < existEnd && existStart < newEnd) {
          return true; // Conflict found
        }
      }
    }
    return false; // No conflicts
  }
}

export class ShiftAssignmentService implements IDomainService {
  constructor(
    private readonly employeeSpec: EmployeeAvailableSpecification,
    private readonly capacitySpec: ShiftCapacitySpecification,
    private readonly conflictService: ShiftConflictService
  ) {}

  public canAssignEmployee(shift: Shift, staffId: StaffId, existingShifts: Shift[], isAvailable: boolean, exceedsWeeklyHours: boolean): void {
    const capacityCheck = this.capacitySpec.isSatisfiedBy({
      currentAssignedCount: shift.assignedEmployees.count,
      maximumCapacity: shift.maximumCapacity.toValue()
    });

    if (!capacityCheck) {
      throw new Error('Shift maximum capacity exceeded.');
    }

    const hasConflicts = this.conflictService.checkConflicts(staffId, shift, existingShifts);

    const employeeCheck = this.employeeSpec.isSatisfiedBy({
      isAvailable,
      hasOverlappingShifts: hasConflicts,
      exceedsWeeklyHours
    });

    if (!employeeCheck) {
      throw new Error('Employee is not available or has conflicting shifts/hours.');
    }
  }
}
