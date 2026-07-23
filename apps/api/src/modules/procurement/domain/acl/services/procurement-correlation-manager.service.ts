import { CorrelationSpecification } from '../specifications/acl.specifications';

export class ProcurementCorrelationManager {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ensureCorrelationPropagated(context: any): void {
    if (!CorrelationSpecification.isSatisfiedBy(context)) {
      throw new Error('Correlation and causation IDs must be preserved');
    }
  }
}