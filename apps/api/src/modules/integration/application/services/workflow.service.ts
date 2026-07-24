import { 
  WorkflowDefinition, 
  WorkflowInstance,
  WorkflowExecution,
  FailedWorkflow,
  WorkflowMetrics
} from '../read-models';

export class WorkflowRegistry {
  private definitions: Map<string, WorkflowDefinition> = new Map();

  public register(def: WorkflowDefinition): void {
    this.definitions.set(def.definitionId, def);
  }

  public getDefinition(id: string): WorkflowDefinition | undefined {
    return this.definitions.get(id);
  }

  public getAll(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }
}

export class RetryService {
  public calculateNextBackoff(attempt: number): number {
    return Math.pow(2, attempt) * 1000;
  }
}

export class TimeoutService {
  public monitorTimeout(instanceId: string, stepId: string, timeoutMs: number): void {
    // Schedule timeout check
    console.log(`[TimeoutService] Monitoring timeout for instance ${instanceId}, step ${stepId}, duration: ${timeoutMs}ms`);
  }
}

export class CompensationService {
  public async compensate(failedInstance: FailedWorkflow): Promise<boolean> {
    console.log(`[CompensationService] Executing compensation for instance ${failedInstance.instanceId}`);
    return true; // Mock success
  }
}

export class SagaCoordinator {
  constructor(private readonly compensationService: CompensationService) {}

  public async handleFailure(instance: WorkflowInstance, error: string): Promise<void> {
    console.log(`[SagaCoordinator] Handling saga failure for instance ${instance.instanceId}: ${error}`);
    await this.compensationService.compensate({
      instanceId: instance.instanceId,
      definitionId: instance.definitionId,
      failedStepId: instance.currentStepId || 'unknown',
      errorMessage: error,
      failedAt: new Date(),
      compensationStatus: 'PENDING'
    });
  }
}

export class WorkflowScheduler {
  public schedule(instance: WorkflowInstance, executeAt: Date): void {
    console.log(`[WorkflowScheduler] Scheduled workflow ${instance.instanceId} to execute at ${executeAt.toISOString()}`);
  }
}

export class WorkflowMonitoringService {
  public getMetrics(): WorkflowMetrics {
    return {
      definitionId: 'global',
      totalStarted: 1500,
      totalCompleted: 1450,
      totalFailed: 50,
      totalCompensated: 48,
      averageDurationMs: 5000
    };
  }
}

export class WorkflowEngine {
  constructor(
    private readonly registry: WorkflowRegistry,
    private readonly sagaCoordinator: SagaCoordinator,
    private readonly timeoutService: TimeoutService
  ) {}

  private instances: Map<string, WorkflowInstance> = new Map();

  public async startWorkflow(definitionId: string, tenantId: string, initialContext: any): Promise<WorkflowInstance> {
    const def = this.registry.getDefinition(definitionId);
    if (!def) throw new Error(`WorkflowDefinition not found: ${definitionId}`);

    const instance: WorkflowInstance = {
      instanceId: crypto.randomUUID(),
      definitionId,
      tenantId,
      status: 'PENDING',
      context: initialContext,
      startedAt: new Date()
    };

    this.instances.set(instance.instanceId, instance);
    
    // Begin execution asynchronously
    this.executeNext(instance).catch(err => {
      this.sagaCoordinator.handleFailure(instance, err.message);
    });

    return instance;
  }

  private async executeNext(instance: WorkflowInstance): Promise<void> {
    instance.status = 'RUNNING';
    // Mock executing steps
    console.log(`[WorkflowEngine] Executing next step for ${instance.instanceId}`);
  }

  public async pause(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) instance.status = 'PAUSED';
  }

  public async resume(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.status = 'RUNNING';
      await this.executeNext(instance);
    }
  }

  public async cancel(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) instance.status = 'CANCELLED';
  }

  public getInstance(instanceId: string): WorkflowInstance | undefined {
    return this.instances.get(instanceId);
  }

  public getAllInstances(): WorkflowInstance[] {
    return Array.from(this.instances.values());
  }
}
