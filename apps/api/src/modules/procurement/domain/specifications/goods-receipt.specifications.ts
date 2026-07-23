import { GoodsReceiptLine } from '../entities/goods-receipt/goods-receipt-line.entity';
import { QualityInspection } from '../entities/goods-receipt/quality-inspection.entity';
import { BatchReceipt } from '../entities/goods-receipt/batch-receipt.entity';
import { SerialNumberAssignment } from '../entities/goods-receipt/serial-number-assignment.entity';

export class GoodsReceiptConsistencySpecification {
  public static isSatisfiedBy(lines: GoodsReceiptLine[]): boolean {
    return lines.every(line => 
      line.receivedQuantity.amount === (line.acceptedQuantity.amount + line.rejectedQuantity.amount)
    );
  }
}

export class ReceiptInspectionSpecification {
  public static isSatisfiedBy(inspection: QualityInspection | undefined): boolean {
    return !!inspection;
  }
}

export class BatchValidationSpecification {
  public static isSatisfiedBy(batches: BatchReceipt[]): boolean {
    const batchNumbers = batches.map(b => b.batchNumber.value);
    return new Set(batchNumbers).size === batchNumbers.length; // Ensure uniqueness
  }
}

export class SerialNumberSpecification {
  public static isSatisfiedBy(serials: SerialNumberAssignment[]): boolean {
    const serialNumbers = serials.map(s => s.serialNumber);
    return new Set(serialNumbers).size === serialNumbers.length; // Ensure uniqueness
  }
}

export class GoodsReceiptLineSpecification {
  public static isSatisfiedBy(lines: GoodsReceiptLine[]): boolean {
    return lines.length > 0;
  }
}