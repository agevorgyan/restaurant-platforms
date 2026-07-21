import { ChargeSchedule } from '../entities/charge-schedule.entity';

export class ChargeScheduleSpecification {
  public isSatisfiedBy(schedules: ChargeSchedule[], evaluationDate: Date = new Date()): boolean {
    if (schedules.length === 0) {
      return true; // No schedules = always applicable
    }

    const currentDay = evaluationDate.getDay();
    const currentHours = evaluationDate.getHours().toString().padStart(2, '0');
    const currentMinutes = evaluationDate.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    return schedules.some(schedule => {
      // Must match day of week
      if (!schedule.daysOfWeek.includes(currentDay)) {
        return false;
      }

      // Must be within time window if specified
      if (schedule.startTime && currentTime < schedule.startTime) {
        return false;
      }
      if (schedule.endTime && currentTime > schedule.endTime) {
        return false;
      }

      return true;
    });
  }
}
