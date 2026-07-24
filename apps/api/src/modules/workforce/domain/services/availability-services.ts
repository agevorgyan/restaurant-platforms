import { IDomainService } from '@saas/domain';
import { AvailabilityRequest } from '../entities/availability-request';
import { AvailabilityPeriod } from '../value-objects/availability-period';

export class AvailabilityValidationService implements IDomainService {
  public validateRequest(request: AvailabilityRequest): boolean {
    return request.period.toValue().startDate < request.period.toValue().endDate;
  }
}

export class VacationBalanceService implements IDomainService {
  public calculateRemaining(currentBalance: number, requestedDays: number): number {
    return currentBalance - requestedDays;
  }
}

export class LeaveApprovalService implements IDomainService {
  public canApprove(request: AvailabilityRequest): boolean {
    return request.status.toValue() === 'PENDING';
  }
}

export class ConflictDetectionService implements IDomainService {
  public detectConflicts(newPeriod: AvailabilityPeriod, existingRequests: AvailabilityRequest[]): boolean {
    for (const req of existingRequests) {
      if (req.status.toValue() === 'APPROVED' && req.period.overlaps(newPeriod)) {
        return true;
      }
    }
    return false;
  }
}
