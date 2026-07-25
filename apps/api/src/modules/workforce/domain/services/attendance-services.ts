import { IDomainService } from '@saas/domain';
import { AttendanceBreak } from '../entities/attendance-break';

export class AttendanceCalculationService implements IDomainService {
  public calculateTotalWorkedMinutes(checkIn: Date, checkOut: Date, breaks: AttendanceBreak[]): number {
    const totalMinutes = Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000);
    let totalBreakMinutes = 0;

    for (const b of breaks) {
      if (b.endTime) {
        totalBreakMinutes += b.durationMinutes;
      }
    }

    return Math.max(0, totalMinutes - totalBreakMinutes);
  }
}

export class OvertimeCalculationService implements IDomainService {
  public calculateOvertimeMinutes(workedMinutes: number, expectedMinutes: number): number {
    return Math.max(0, workedMinutes - expectedMinutes);
  }
}

export class AttendanceCorrectionService implements IDomainService {
  public validateCorrection(proposedCheckIn: Date, proposedCheckOut: Date): boolean {
    return proposedCheckOut > proposedCheckIn;
  }
}
