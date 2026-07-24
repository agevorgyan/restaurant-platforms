import { Specification } from '@saas/domain-rules';

export interface SchedulePeriodContext {
  newScheduleStart: Date;
  newScheduleEnd: Date;
  existingSchedules: { start: Date; end: Date }[];
}

export class SchedulePeriodSpecification extends Specification<SchedulePeriodContext> {
  public isSatisfiedBy(candidate: SchedulePeriodContext): boolean {
    const start = candidate.newScheduleStart.getTime();
    const end = candidate.newScheduleEnd.getTime();
    
    // Period cannot overlap with another active schedule for the same branch (assumed existingSchedules are for same branch)
    for (const schedule of candidate.existingSchedules) {
      if (start < schedule.end.getTime() && schedule.start.getTime() < end) {
        return false;
      }
    }
    return true;
  }
}

export interface ShiftBelongsToScheduleContext {
  shiftStart: Date;
  shiftEnd: Date;
  scheduleStart: Date;
  scheduleEnd: Date;
}

export class ShiftBelongsToScheduleSpecification extends Specification<ShiftBelongsToScheduleContext> {
  public isSatisfiedBy(candidate: ShiftBelongsToScheduleContext): boolean {
    return candidate.shiftStart >= candidate.scheduleStart && candidate.shiftEnd <= candidate.scheduleEnd;
  }
}

export interface ScheduleConflictContext {
  hasConflicts: boolean;
}

export class ScheduleConflictSpecification extends Specification<ScheduleConflictContext> {
  public isSatisfiedBy(candidate: ScheduleConflictContext): boolean {
    return !candidate.hasConflicts;
  }
}

export interface PublishedScheduleContext {
  isPublished: boolean;
}

export class PublishedScheduleSpecification extends Specification<PublishedScheduleContext> {
  public isSatisfiedBy(candidate: PublishedScheduleContext): boolean {
    return candidate.isPublished;
  }
}
