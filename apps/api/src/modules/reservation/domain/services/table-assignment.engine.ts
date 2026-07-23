import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { AssignmentDecision } from '../value-objects/assignment-decision.value-object';
import { AssignmentReason } from '../value-objects/assignment-reason.value-object';
import { CapacityEvaluationService } from './capacity-evaluation.service';
import { ReservationConflictDetector } from './reservation-conflict.detector';
import { SeatingOptimizationService } from './seating-optimization.service';
import { TableAssignmentResolver } from './table-assignment.resolver';
import { TableAssignmentPolicy, CapacityPolicy, SeatingOptimizationPolicy } from '../policies/assignment.policies';
import { AssignmentSpecification } from '../specifications/assignment.specifications';
import { TableReference } from '../value-objects/table-reference.value-object';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';
import { 
  TableAssignmentEvaluatedEvent, 
  CapacityValidatedEvent, 
  ReservationConflictDetectedEvent, 
  SeatingOptimizedEvent,
  AssignmentApprovedEvent,
  AssignmentRejectedEvent
} from '../events/assignment.events';

export class TableAssignmentEngine {
  private readonly capacityEvaluationService = new CapacityEvaluationService();
  private readonly conflictDetector = new ReservationConflictDetector();
  private readonly seatingOptimizationService = new SeatingOptimizationService();
  private readonly assignmentResolver = new TableAssignmentResolver();
  private readonly assignmentSpecification = new AssignmentSpecification();

  constructor(private readonly eventPublisher: EventPublisher) {}

  public execute(
    context: TableAssignmentContext, 
    availableTables: { ref: TableReference, capacity: number }[],
    existingAllocations: any[]
  ): AssignmentDecision {
    
    // 1 & 2 & 3. Initial Validation (Branch, Time, Capacity)
    TableAssignmentPolicy.enforce(context);
    if (!this.assignmentSpecification.isSatisfiedBy(context)) {
      return this.reject(context, [AssignmentReason.create('Invalid assignment specifications (duration/capacity)')]);
    }

    const totalAvailable = availableTables.reduce((sum, t) => sum + t.capacity, 0);
    const capacityEval = this.capacityEvaluationService.evaluate(context, totalAvailable);
    this.eventPublisher.publish(new CapacityValidatedEvent(context.reservationRef.reference, capacityEval.isSufficient));
    
    if (!capacityEval.isSufficient) {
      return this.reject(context, [AssignmentReason.create(`Insufficient capacity. Deficit: ${capacityEval.deficit}`)]);
    }

    // 4 & 5. Conflict Detection & Table Availability
    const conflictEval = this.conflictDetector.detectConflicts(context, existingAllocations);
    if (conflictEval.hasConflict) {
      this.eventPublisher.publish(new ReservationConflictDetectedEvent(context.reservationRef.reference, conflictEval.reason!.reason));
      return this.reject(context, [AssignmentReason.create(conflictEval.reason!.reason)]);
    }

    // 6. Seating Optimization
    const plan = this.seatingOptimizationService.optimize(context, availableTables);
    SeatingOptimizationPolicy.evaluate(plan.tables.length);
    CapacityPolicy.enforce(plan.totalCapacity, context.requiredCapacity.required);
    this.eventPublisher.publish(new SeatingOptimizedEvent(context.reservationRef.reference));

    // 7. Assignment Decision
    const decision = this.assignmentResolver.resolveApproval(plan);
    this.eventPublisher.publish(new AssignmentApprovedEvent(context.reservationRef.reference, plan.tables.map(t => t.tableId)));
    this.eventPublisher.publish(new TableAssignmentEvaluatedEvent(context.reservationRef.reference, true));
    
    return decision;
  }

  private reject(context: TableAssignmentContext, reasons: AssignmentReason[]): AssignmentDecision {
    const decision = this.assignmentResolver.resolveRejection(reasons);
    this.eventPublisher.publish(new AssignmentRejectedEvent(context.reservationRef.reference, reasons.map(r => r.reason)));
    this.eventPublisher.publish(new TableAssignmentEvaluatedEvent(context.reservationRef.reference, false));
    return decision;
  }
}