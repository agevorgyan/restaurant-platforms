import { UpdateProductAvailabilityDto } from '../dto/product-availability.dto';

export const validateUpdateProductAvailability = (dto: UpdateProductAvailabilityDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.productId) errors.push('productId is required');
  if (!dto.availabilityMode) errors.push('availabilityMode is required');
  if (dto.alwaysAvailable === undefined || dto.alwaysAvailable === null) errors.push('alwaysAvailable is required');
  if (dto.enabled === undefined || dto.enabled === null) errors.push('enabled is required');
  if (dto.seasonal === undefined || dto.seasonal === null) errors.push('seasonal is required');
  if (dto.priority === undefined || dto.priority === null) errors.push('priority is required');
  if (!dto.timezone) errors.push('timezone is required');

  if (dto.availabilityMode === 'Scheduled') {
    if (!dto.schedule) {
      errors.push('schedule is required when availabilityMode is Scheduled');
    } else {
      if (!dto.schedule.daysOfWeek || dto.schedule.daysOfWeek.length === 0) {
        errors.push('schedule.daysOfWeek must contain at least one day');
      }
      if (!dto.schedule.timeRanges || dto.schedule.timeRanges.length === 0) {
        errors.push('schedule.timeRanges must contain at least one time range');
      }
    }
  }

  if (dto.availabilityMode === 'Seasonal') {
    if (!dto.startDate || !dto.endDate) {
      errors.push('startDate and endDate are required when availabilityMode is Seasonal');
    }
  }

  return errors;
};
