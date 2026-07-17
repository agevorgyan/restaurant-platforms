import { Injectable, BadRequestException } from '@nestjs/common';
import { AvailabilityDay, AvailabilityDayType } from '../../domain/value-objects/availability-day.value-object';
import { AvailabilityTimeRange } from '../../domain/value-objects/availability-time-range.value-object';
import { AvailabilitySchedule } from '../../domain/value-objects/availability-schedule.value-object';
import { ProductAvailabilityPolicy, AvailabilityMode } from '../../domain/value-objects/product-availability-policy.value-object';
import { UpdateProductAvailabilityDto } from '../dto/product-availability.dto';
import { validateUpdateProductAvailability } from '../validation/product-availability.schema';
import { ProductAvailabilityUpdatedEvent } from '../../domain/events/product-availability.events';

@Injectable()
export class ProductAvailabilityService {
  
  async updateAvailability(dto: UpdateProductAvailabilityDto): Promise<ProductAvailabilityPolicy> {
    const errors = validateUpdateProductAvailability(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    let schedule: AvailabilitySchedule | undefined = undefined;

    if (dto.schedule) {
      const days = dto.schedule.daysOfWeek.map(d => new AvailabilityDay(d as AvailabilityDayType));
      const ranges = dto.schedule.timeRanges.map(tr => new AvailabilityTimeRange(tr.startTime, tr.endTime));
      schedule = new AvailabilitySchedule(days, ranges);
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    // This will trigger the strict validation rules inside the Value Object
    const policy = new ProductAvailabilityPolicy(
      dto.availabilityMode as AvailabilityMode,
      dto.alwaysAvailable,
      dto.enabled,
      dto.seasonal,
      dto.priority,
      dto.timezone,
      dto.branchIds,
      startDate,
      endDate,
      schedule
    );

    new ProductAvailabilityUpdatedEvent(dto.productId, policy);

    return policy;
  }
}
