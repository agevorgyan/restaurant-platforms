export type ReturnReasonValue = 
  | 'Damaged' 
  | 'Expired' 
  | 'IncorrectItem' 
  | 'QualityIssue' 
  | 'OverDelivery' 
  | 'SupplierError' 
  | 'Other';

export class ReturnReason {
  constructor(public readonly value: ReturnReasonValue) {
    const validReasons = [
      'Damaged', 
      'Expired', 
      'IncorrectItem', 
      'QualityIssue', 
      'OverDelivery', 
      'SupplierError', 
      'Other'
    ];
    if (!validReasons.includes(value)) {
      throw new Error(`Invalid return reason: ${value}`);
    }
  }
}
