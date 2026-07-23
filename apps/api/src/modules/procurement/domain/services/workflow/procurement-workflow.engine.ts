import { WorkflowRequest } from '../../value-objects/workflow/workflow-request.value-object';
import { WorkflowContext } from '../../value-objects/workflow/workflow-context.value-object';
import { WorkflowExecutionId } from '../../value-objects/workflow/workflow-execution-id.value-object';
import { PurchaseRequisition } from '../../aggregates/purchase-requisition.aggregate';
import { PurchaseOrder } from '../../aggregates/purchase-order.aggregate';
import { GoodsReceipt } from '../../aggregates/goods-receipt.aggregate';
import { WorkflowValidationPolicy } from '../../policies/workflow.policy';
import { PurchaseApprovalEngine } from './purchase-approval.engine';
import { SupplierSelectionEngine } from './supplier-selection.engine';
import { PurchaseOrderGenerationEngine } from './purchase-order-generation.engine';
import { ReceivingCoordinator } from './receiving-coordinator.service';

/**
 * Domain Service: ProcurementWorkflowEngine
 * Orchestrates the procurement lifecycle without owning business state.
 * Never modifies aggregate internals directly (uses public APIs).
 */
export class ProcurementWorkflowEngine {
  constructor(
    private approvalEngine: PurchaseApprovalEngine,
    private supplierEngine: SupplierSelectionEngine,
    private poEngine: PurchaseOrderGenerationEngine,
    private receivingCoordinator: ReceivingCoordinator
  ) {}

  public startWorkflow(request: WorkflowRequest): WorkflowContext {
    WorkflowValidationPolicy.ensureOrchestrationViaAggregateAPIs();
    
    const context = WorkflowContext.create({
      correlationId: request.correlationId,
      executionId: WorkflowExecutionId.create(),
      currentState: 'STARTED',
      payload: { requisitionId: request.requisitionId }
    });
    
    WorkflowValidationPolicy.ensureCorrelationIdPropagated(context, request);
    return context;
  }

  public executeApprovalPhase(context: WorkflowContext, requisition: PurchaseRequisition): WorkflowContext {
    const plan = this.approvalEngine.evaluateApprovalPolicies(requisition);
    this.approvalEngine.resolveApprovalChain(plan, requisition);
    return context.updateState('BUDGET_VALIDATED_AND_APPROVED');
  }

  public executeSupplierSelection(context: WorkflowContext, requisition: PurchaseRequisition, suppliers: any[]): WorkflowContext {
    const eligible = this.supplierEngine.evaluateEligibleSuppliers(requisition, suppliers);
    const result = this.supplierEngine.rankSuppliers(eligible);
    return context.updateState('SUPPLIER_SELECTED', { selectedSupplierId: result.selectedSupplierId });
  }

  public executeOrderGeneration(context: WorkflowContext, requisition: PurchaseRequisition, supplierId: string): WorkflowContext {
    const poRequest = this.poEngine.generatePurchaseOrderRequest(requisition, supplierId);
    // Returns new context indicating PO generation requested
    return context.updateState('PO_GENERATION_REQUESTED', { poRequest });
  }

  public executeReceivingCompletion(context: WorkflowContext, goodsReceipt: GoodsReceipt, purchaseOrder: PurchaseOrder): WorkflowContext {
    this.receivingCoordinator.coordinateGoodsReceiptCompletion(goodsReceipt, purchaseOrder);
    return context.updateState('COMPLETED');
  }
}