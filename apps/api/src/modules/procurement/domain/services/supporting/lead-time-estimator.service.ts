import { DeliveryPlan } from '../../value-objects/workflow/delivery-plan.value-object';

export class LeadTimeEstimator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public estimateLeadTime(supplierId: string, items: any[]): DeliveryPlan {
    const estimatedDays = 5;
    const date = new Date();
    date.setDate(date.getDate() + estimatedDays);
    return DeliveryPlan.create({
      estimatedLeadTimeDays: estimatedDays,
      expectedDeliveryDate: date,
      targetWarehouseId: 'WH-MAIN'
    });
  }
}