import { CreateKitchenDisplayDto, UpdateKitchenDisplayDto } from '../dto/kitchen-display.dto';

export const validateCreateKitchenDisplay = (dto: CreateKitchenDisplayDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.kitchenId) errors.push('kitchenId is required');
  if (!dto.stationId) errors.push('stationId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.layout) errors.push('layout is required');
  if (dto.refreshIntervalSeconds === undefined || dto.refreshIntervalSeconds === null || !Number.isInteger(dto.refreshIntervalSeconds) || dto.refreshIntervalSeconds <= 0) {
    errors.push('refreshIntervalSeconds must be an integer greater than zero');
  }
  if (!dto.configuration) {
    errors.push('configuration is required');
  } else {
    if (typeof dto.configuration.showCompletedTickets !== 'boolean') errors.push('configuration.showCompletedTickets must be boolean');
    if (typeof dto.configuration.showTimers !== 'boolean') errors.push('configuration.showTimers must be boolean');
    if (typeof dto.configuration.audioAlertsEnabled !== 'boolean') errors.push('configuration.audioAlertsEnabled must be boolean');
  }
  if (!dto.filters) {
    errors.push('filters is required');
  }
  return errors;
};

export const validateUpdateKitchenDisplay = (dto: UpdateKitchenDisplayDto): string[] => {
  const errors: string[] = [];
  if (dto.refreshIntervalSeconds !== undefined && (!Number.isInteger(dto.refreshIntervalSeconds) || dto.refreshIntervalSeconds <= 0)) {
    errors.push('refreshIntervalSeconds must be an integer greater than zero');
  }
  return errors;
};
