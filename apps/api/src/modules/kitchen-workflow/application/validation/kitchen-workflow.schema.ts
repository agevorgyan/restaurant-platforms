import { CreateKitchenWorkflowDto } from '../dto/kitchen-workflow.dto';

export const validateCreateKitchenWorkflow = (dto: CreateKitchenWorkflowDto): string[] => {
  const errors: string[] = [];
  if (!dto.ticketId) errors.push('ticketId is required');
  if (!dto.kitchenId) errors.push('kitchenId is required');
  if (dto.expectedDurationMinutes === undefined || dto.expectedDurationMinutes === null || dto.expectedDurationMinutes < 0) {
    errors.push('expectedDurationMinutes must be zero or positive');
  }
  if (dto.slaThresholdMinutes === undefined || dto.slaThresholdMinutes === null || dto.slaThresholdMinutes < dto.expectedDurationMinutes) {
    errors.push('slaThresholdMinutes must be greater than or equal to expected duration');
  }
  return errors;
};
