import { AvailabilityContext, AvailabilityContextProps } from '../../value-objects/availability-context.value-object';

export class AvailabilityContextFactory {
  public static createFromRequest(props: AvailabilityContextProps): AvailabilityContext {
    return AvailabilityContext.create(props);
  }
}