export class TimeRangeDto {
  startTime: string;
  endTime: string;
}

export class ScheduleDto {
  daysOfWeek: string[];
  timeRanges: TimeRangeDto[];
}

export class UpdateProductAvailabilityDto {
  productId: string;
  availabilityMode: string;
  alwaysAvailable: boolean;
  enabled: boolean;
  seasonal: boolean;
  priority: number;
  timezone: string;
  branchIds?: string[];
  startDate?: string;
  endDate?: string;
  schedule?: ScheduleDto;
}
