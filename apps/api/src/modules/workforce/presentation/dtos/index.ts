export class CreateStaffDto { employeeNumber!: string; firstName!: string; lastName!: string; email!: string; phoneNumber!: string; jobTitle!: string; employmentType!: string; salary?: number; hourlyRate?: number; }
export class UpdateStaffDto { firstName?: string; lastName?: string; email?: string; phoneNumber?: string; }
export class CreateRoleDto { name!: string; permissions!: string[]; }
export class CreateShiftDto { shiftCode!: string; shiftName!: string; shiftType!: string; startTime!: Date; endTime!: Date; breakDuration!: number; maximumCapacity!: number; }
export class UpdateShiftDto { shiftName?: string; shiftType?: string; startTime?: Date; endTime?: Date; breakDuration?: number; maximumCapacity?: number; }
export class AssignShiftEmployeeDto { staffId!: string; }
export class RemoveShiftEmployeeDto { staffId!: string; }
export class CreateScheduleDto { scheduleCode!: string; scheduleName!: string; startDate!: Date; endDate!: Date; planningWindow!: number; }
export class UpdateScheduleDto { scheduleName?: string; startDate?: Date; endDate?: Date; planningWindow?: number; }
export class AddShiftToScheduleDto { shiftId!: string; }
export class RemoveShiftFromScheduleDto { shiftId!: string; }

export class CheckInDto {
  staffId!: string;
  shiftId!: string;
  source!: 'TERMINAL' | 'MOBILE_APP' | 'MANUAL_ENTRY' | 'SYSTEM';
  checkInTime!: Date;
}

export class CheckOutDto {
  staffId!: string;
  shiftId!: string;
  source!: 'TERMINAL' | 'MOBILE_APP' | 'MANUAL_ENTRY' | 'SYSTEM';
  checkOutTime!: Date;
}

export class BreakStartDto {
  attendanceId!: string;
  startTime!: Date;
}

export class BreakEndDto {
  attendanceId!: string;
  endTime!: Date;
}

export class CorrectAttendanceDto {
  proposedCheckIn!: Date;
  proposedCheckOut!: Date;
  reason!: string;
}
