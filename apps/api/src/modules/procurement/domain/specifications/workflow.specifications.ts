export class WorkflowConsistencySpecification {
  public static isSatisfiedBy(context: any): boolean {
    return !!context && !!context.correlationId;
  }
}

export class ApprovalWorkflowSpecification {
  public static isSatisfiedBy(plan: any): boolean {
    return plan.requiredApprovers && plan.requiredApprovers.length > 0;
  }
}

export class SupplierSelectionSpecification {
  public static isSatisfiedBy(supplierStatus: string): boolean {
    return supplierStatus === 'ACTIVE';
  }
}

export class PurchaseOrderGenerationSpecification {
  public static isSatisfiedBy(requisitionStatus: string): boolean {
    return requisitionStatus === 'APPROVED';
  }
}

export class ReceivingCompletionSpecification {
  public static isSatisfiedBy(receiptStatus: string): boolean {
    return receiptStatus === 'COMPLETED' || receiptStatus === 'PARTIALLY_RECEIVED';
  }
}