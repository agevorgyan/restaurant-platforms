import { AvailabilityContext } from '../contexts/availability.context';
import { CapacityForecast } from '../value-objects/capacity-forecast.value-object';
import { CapacityForecastSpecification } from '../specifications/availability.specifications';
import { CapacityForecastPolicy } from '../policies/availability.policies';

export class CapacityForecastService {
  private readonly spec = new CapacityForecastSpecification();
  public validateAndForecast(context: AvailabilityContext, forecast: CapacityForecast): boolean {
    const isValid = this.spec.isSatisfiedBy(context, forecast);
    CapacityForecastPolicy.enforce(isValid);
    return isValid;
  }
}