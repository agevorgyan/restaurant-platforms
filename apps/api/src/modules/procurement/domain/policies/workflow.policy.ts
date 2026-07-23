export class WorkflowPolicy {
  public static ensureIdempotency(executionHistory: string[], currentStep: string): void {
    if (executionHistory.includes(currentStep)) {
      throw new Error(`Workflow step ${currentStep} has already been executed. Workflow operations must be idempotent.`);
    }
  }
}

export class ApprovalWorkflowPolicy {
  public static requiresApproval(amount: number): boolean {
    return amount > 0;
  }
}

export class SupplierSelectionPolicy {
  public static ensureSupplierActive(status: string): void {
    if (status !== 'ACTIVE') {
      throw new Error('Supplier must be Active to be selected for a workflow');
    }
  }
}

export class ReceivingPolicy {
  public static ensureReceiptCompleteBeforeWorkflowEnd(receiptStatus: string): void {
    if (receiptStatus !== 'COMPLETED' && receiptStatus !== 'FULLY_RECEIVED') {
      throw new Error('Goods Receipt required before workflow completion');
    }
  }
}

export class WorkflowValidationPolicy {
  public static ensureCorrelationIdPropagated(context: any, request: any): void {
    if (context.correlationId.value !== request.correlationId.value) {
      throw new Error('Correlation ID must be propagated across workflow');
    }
  }

  public static ensureOrchestrationViaAggregateAPIs(): void {
    // Structural policy: "Workflow never bypasses Aggregate methods"
    // "Workflow never mutates Aggregate state directly"
    // "All orchestration uses public Aggregate APIs"
  }
}