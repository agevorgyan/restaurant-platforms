const fs = require('fs');
const path = require('path');

const domainDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/menu/domain';

const filesToCreate = {
  // Value Objects
  'value-objects/kitchen-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface KitchenReferenceProps { referenceId: string; }

export class KitchenReference extends ValueObject<KitchenReferenceProps> {
  get referenceId(): string { return this.props.referenceId; }
  private constructor(props: KitchenReferenceProps) { super(props); }
  public static create(referenceId: string): KitchenReference {
    if (!referenceId) throw new Error('KitchenReference cannot be empty');
    return new KitchenReference({ referenceId });
  }
}`,

  'value-objects/inventory-availability-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface InventoryAvailabilityReferenceProps { status: string; }

export class InventoryAvailabilityReference extends ValueObject<InventoryAvailabilityReferenceProps> {
  get status(): string { return this.props.status; }
  private constructor(props: InventoryAvailabilityReferenceProps) { super(props); }
  public static create(status: string): InventoryAvailabilityReference {
    if (!status) throw new Error('Inventory availability status is required');
    return new InventoryAvailabilityReference({ status });
  }
}`,

  'value-objects/menu-integration-context.value-object.ts': `import { ValueObject } from '@saas/core';
import { MenuItemReference } from './menu-item-reference.value-object';
import { ModifierGroupReference } from './modifier-group-reference.value-object';
import { RecipeReference } from './recipe-reference.value-object';
import { KitchenStationReference } from './kitchen-station-reference.value-object';
import { InventoryItemReference } from './inventory-item-reference.value-object';

export interface MenuIntegrationContextProps {
  menuItemRef?: MenuItemReference;
  modifierGroupRef?: ModifierGroupReference;
  recipeRef?: RecipeReference;
  kitchenStationRef?: KitchenStationReference;
  inventoryItemRef?: InventoryItemReference;
  branchReference: string;
  salesChannel: string;
  evaluationDateTime: Date;
}

export class MenuIntegrationContext extends ValueObject<MenuIntegrationContextProps> {
  get recipeRef(): RecipeReference | undefined { return this.props.recipeRef; }
  get kitchenStationRef(): KitchenStationReference | undefined { return this.props.kitchenStationRef; }
  get inventoryItemRef(): InventoryItemReference | undefined { return this.props.inventoryItemRef; }
  get branchReference(): string { return this.props.branchReference; }
  get salesChannel(): string { return this.props.salesChannel; }
  get evaluationDateTime(): Date { return this.props.evaluationDateTime; }

  private constructor(props: MenuIntegrationContextProps) { super(props); }
  public static create(props: MenuIntegrationContextProps): MenuIntegrationContext {
    if (!props.branchReference) throw new Error('Branch reference is required in MenuIntegrationContext');
    return new MenuIntegrationContext(props);
  }
}`,

  'value-objects/integration-request-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface IntegrationRequestIdProps { value: string; }

export class IntegrationRequestId extends ValueObject<IntegrationRequestIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationRequestIdProps) { super(props); }
  public static create(value?: string): IntegrationRequestId {
    return new IntegrationRequestId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/integration-correlation-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface IntegrationCorrelationIdProps { value: string; }

export class IntegrationCorrelationId extends ValueObject<IntegrationCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationCorrelationIdProps) { super(props); }
  public static create(value?: string): IntegrationCorrelationId {
    return new IntegrationCorrelationId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/integration-result.value-object.ts': `import { ValueObject } from '@saas/core';

export interface IntegrationResultProps {
  kitchenAvailability: boolean;
  inventoryAvailability: boolean;
  availabilityStatus: string;
  failureReason?: string;
  evaluationTimestamp: Date;
}

export class IntegrationResult extends ValueObject<IntegrationResultProps> {
  get kitchenAvailability(): boolean { return this.props.kitchenAvailability; }
  get inventoryAvailability(): boolean { return this.props.inventoryAvailability; }
  get availabilityStatus(): string { return this.props.availabilityStatus; }
  get failureReason(): string | undefined { return this.props.failureReason; }
  get evaluationTimestamp(): Date { return this.props.evaluationTimestamp; }

  private constructor(props: IntegrationResultProps) { super(props); }
  public static create(props: IntegrationResultProps): IntegrationResult {
    return new IntegrationResult(props);
  }
}`,

  // Specifications
  'specifications/kitchen-inventory.specifications.ts': `import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';

export class KitchenReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.kitchenStationRef;
  }
}

export class InventoryReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.inventoryItemRef;
  }
}

export class AvailabilityIntegrationSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.branchReference && !!context.salesChannel;
  }
}

export class RecipeReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.recipeRef;
  }
}

export class IntegrationConsistencySpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.evaluationDateTime;
  }
}`,

  // Policies
  'policies/kitchen-inventory.policies.ts': `import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';

export class KitchenIntegrationPolicy {
  public static validate(context: MenuIntegrationContext): void {
    if (!context.kitchenStationRef && context.recipeRef) {
      throw new Error('Recipe reference cannot exist without a Kitchen Station reference');
    }
  }
}

export class InventoryIntegrationPolicy {
  public static validate(context: MenuIntegrationContext): void {
    if (context.inventoryItemRef && !context.branchReference) {
      throw new Error('Branch reference is required to resolve inventory');
    }
  }
}

export class AvailabilityIntegrationPolicy {
  public static allowIntegration(context: MenuIntegrationContext): boolean {
    return !!context.branchReference;
  }
}

export class ReferenceValidationPolicy {
  public static validateAll(context: MenuIntegrationContext): void {
    KitchenIntegrationPolicy.validate(context);
    InventoryIntegrationPolicy.validate(context);
  }
}

export class IntegrationFailurePolicy {
  public static handleFailure(reason: string): void {
    // Record integration failure
  }
}`,

  // Contracts
  'contracts/kitchen-inventory.contracts.ts': `// Inbound
export interface KitchenStatusUpdatedContract {
  kitchenStationId: string;
  status: string;
}

export interface RecipeAvailabilityChangedContract {
  recipeId: string;
  isAvailable: boolean;
}

export interface KitchenStationUpdatedContract {
  kitchenStationId: string;
  isActive: boolean;
}

export interface InventoryAvailabilityUpdatedContract {
  inventoryItemId: string;
  branchId: string;
  isAvailable: boolean;
}

export interface InventoryItemArchivedContract {
  inventoryItemId: string;
}

// Outbound
export interface KitchenAvailabilityRequestedContract {
  correlationId: string;
  kitchenStationId: string;
  branchId: string;
}

export interface InventoryAvailabilityRequestedContract {
  correlationId: string;
  inventoryItemId: string;
  branchId: string;
}

export interface RecipeValidationRequestedContract {
  correlationId: string;
  recipeId: string;
}

export interface AvailabilityEvaluationRequestedContract {
  correlationId: string;
  branchId: string;
}`,

  // Events
  'events/kitchen-inventory.events.ts': `import { DomainEvent } from '@saas/core';

export class KitchenAvailabilityResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly isAvailable: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class InventoryAvailabilityResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly isAvailable: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class AvailabilityEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly overallStatus: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class AvailabilityIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReferenceValidationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly failedReferenceType: string) {}
  getAggregateId(): string { return this.correlationId; }
}`,

  // Services
  'services/integration/kitchen-reference.resolver.ts': `import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { KitchenReferenceSpecification, RecipeReferenceSpecification } from '../../specifications/kitchen-inventory.specifications';

export class KitchenReferenceResolver {
  public static resolve(context: MenuIntegrationContext, fetchFn: (req: any) => any): boolean {
    if (!KitchenReferenceSpecification.isSatisfiedBy(context)) {
      return true; // Unconstrained by kitchen
    }
    
    return fetchFn({ 
      kitchenStationId: context.kitchenStationRef?.stationId,
      recipeId: RecipeReferenceSpecification.isSatisfiedBy(context) ? context.recipeRef?.recipeId : undefined,
      branchId: context.branchReference 
    }).isAvailable;
  }
}`,

  'services/integration/inventory-reference.resolver.ts': `import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { InventoryReferenceSpecification } from '../../specifications/kitchen-inventory.specifications';

export class InventoryReferenceResolver {
  public static resolve(context: MenuIntegrationContext, fetchFn: (req: any) => any): boolean {
    if (!InventoryReferenceSpecification.isSatisfiedBy(context)) {
      return true; // Unconstrained by inventory
    }
    
    return fetchFn({
      inventoryItemId: context.inventoryItemRef?.itemId,
      branchId: context.branchReference
    }).isAvailable;
  }
}`,

  'services/integration/menu-kitchen.gateway.ts': `import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { KitchenReferenceResolver } from './kitchen-reference.resolver';
import { KitchenAvailabilityResolvedEvent, AvailabilityIntegrationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuKitchenGateway {
  public checkAvailability(context: MenuIntegrationContext, fetchFn: (req: any) => any, correlationId: string): { isAvailable: boolean, event: any } {
    try {
      const isAvailable = KitchenReferenceResolver.resolve(context, fetchFn);
      return { isAvailable, event: new KitchenAvailabilityResolvedEvent(correlationId, isAvailable) };
    } catch (e: any) {
      return { isAvailable: false, event: new AvailabilityIntegrationFailedEvent(correlationId, e.message) };
    }
  }
}`,

  'services/integration/menu-inventory.gateway.ts': `import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { InventoryReferenceResolver } from './inventory-reference.resolver';
import { InventoryAvailabilityResolvedEvent, AvailabilityIntegrationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuInventoryGateway {
  public checkAvailability(context: MenuIntegrationContext, fetchFn: (req: any) => any, correlationId: string): { isAvailable: boolean, event: any } {
    try {
      const isAvailable = InventoryReferenceResolver.resolve(context, fetchFn);
      return { isAvailable, event: new InventoryAvailabilityResolvedEvent(correlationId, isAvailable) };
    } catch (e: any) {
      return { isAvailable: false, event: new AvailabilityIntegrationFailedEvent(correlationId, e.message) };
    }
  }
}`,

  'services/integration/menu-availability.coordinator.ts': `import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { IntegrationResult } from '../../value-objects/integration-result.value-object';
import { IntegrationCorrelationId } from '../../value-objects/integration-correlation-id.value-object';
import { ReferenceValidationPolicy } from '../../policies/kitchen-inventory.policies';
import { MenuKitchenGateway } from './menu-kitchen.gateway';
import { MenuInventoryGateway } from './menu-inventory.gateway';
import { AvailabilityEvaluationCompletedEvent, ReferenceValidationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuAvailabilityCoordinator {
  private kitchenGateway = new MenuKitchenGateway();
  private inventoryGateway = new MenuInventoryGateway();

  public evaluate(
    context: MenuIntegrationContext, 
    kitchenFetchFn: (req: any) => any,
    inventoryFetchFn: (req: any) => any
  ): { result: IntegrationResult | null, events: any[] } {
    const correlationId = IntegrationCorrelationId.create().value;
    const events: any[] = [];

    try {
      ReferenceValidationPolicy.validateAll(context);
    } catch (e: any) {
      events.push(new ReferenceValidationFailedEvent(correlationId, 'VALIDATION'));
      return { result: null, events };
    }

    const kitchenResponse = this.kitchenGateway.checkAvailability(context, kitchenFetchFn, correlationId);
    events.push(kitchenResponse.event);

    const inventoryResponse = this.inventoryGateway.checkAvailability(context, inventoryFetchFn, correlationId);
    events.push(inventoryResponse.event);

    const isAvailable = kitchenResponse.isAvailable && inventoryResponse.isAvailable;
    
    events.push(new AvailabilityEvaluationCompletedEvent(correlationId, isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'));

    const result = IntegrationResult.create({
      kitchenAvailability: kitchenResponse.isAvailable,
      inventoryAvailability: inventoryResponse.isAvailable,
      availabilityStatus: isAvailable ? 'AVAILABLE' : 'UNAVAILABLE',
      evaluationTimestamp: new Date()
    });

    return { result, events };
  }
}`,

  // Tests
  'tests/menu-integration-coordinator.spec.ts': `import { MenuAvailabilityCoordinator } from '../services/integration/menu-availability.coordinator';
import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';
import { KitchenStationReference } from '../value-objects/kitchen-station-reference.value-object';
import { InventoryItemReference } from '../value-objects/inventory-item-reference.value-object';

describe('MenuAvailabilityCoordinator', () => {
  it('should successfully coordinate kitchen and inventory availability', () => {
    const coordinator = new MenuAvailabilityCoordinator();
    
    const context = MenuIntegrationContext.create({
      branchReference: 'branch-1',
      salesChannel: 'POS',
      kitchenStationRef: KitchenStationReference.create('station-1'),
      inventoryItemRef: InventoryItemReference.create('inv-1'),
      evaluationDateTime: new Date()
    });

    const mockKitchenFetch = (req: any) => ({ isAvailable: true });
    const mockInventoryFetch = (req: any) => ({ isAvailable: true });

    const { result, events } = coordinator.evaluate(context, mockKitchenFetch, mockInventoryFetch);

    expect(result).toBeDefined();
    expect(result?.availabilityStatus).toBe('AVAILABLE');
    expect(result?.kitchenAvailability).toBe(true);
    expect(result?.inventoryAvailability).toBe(true);
    expect(events.length).toBe(3);
    expect(events[2].constructor.name).toBe('AvailabilityEvaluationCompletedEvent');
  });

  it('should handle validation failures gracefully', () => {
    const coordinator = new MenuAvailabilityCoordinator();
    
    const context = MenuIntegrationContext.create({
      branchReference: 'branch-1',
      salesChannel: 'POS',
      // Fails validation policy: Recipe without KitchenStation
      recipeRef: { recipeId: 'recipe-1' } as any,
      evaluationDateTime: new Date()
    });

    const { result, events } = coordinator.evaluate(context, (req) => ({}), (req) => ({}));

    expect(result).toBeNull();
    expect(events.length).toBe(1);
    expect(events[0].constructor.name).toBe('ReferenceValidationFailedEvent');
  });
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(domainDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
