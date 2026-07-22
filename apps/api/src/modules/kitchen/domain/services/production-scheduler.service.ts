import { Production } from '../aggregates/production.aggregate';
import { SchedulingPolicy } from '../policies/workflow.policy';

export class ProductionScheduler {
  public scheduleProductionBlock(production: Production, triggeredBy: string): void {
    SchedulingPolicy.validateScheduling(production);
    production.schedule(triggeredBy);
  }
}
