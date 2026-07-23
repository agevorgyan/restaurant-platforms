import { AggregateRoot } from '@saas/core';
import { GoodsReceiptId } from '../value-objects/goods-receipt-id.value-object';
import { GoodsReceiptNumber } from '../value-objects/goods-receipt/goods-receipt-number.value-object';
import { GoodsReceiptReference } from '../value-objects/goods-receipt/goods-receipt-reference.value-object';
import { GoodsReceiptStatus } from '../enums/procurement.enums';
import { ReceiptType } from '../value-objects/goods-receipt/receipt-type.value-object';
import { ReceiptDate } from '../value-objects/goods-receipt/receipt-date.value-object';
import { ReceivedBy } from '../value-objects/goods-receipt/received-by.value-object';
import { WarehouseReference } from '../value-objects/goods-receipt/warehouse-reference.value-object';
import { ReceivingLocation } from '../value-objects/goods-receipt/receiving-location.value-object';
import { PurchaseOrderReference } from '../value-objects/purchase-order/purchase-order-reference.value-object';
import { SupplierReference } from '../value-objects/supplier-reference.value-object';
import { GoodsReceiptVersion } from '../value-objects/goods-receipt/goods-receipt-version.value-object';

import { GoodsReceiptLine } from '../entities/goods-receipt/goods-receipt-line.entity';
import { BatchReceipt } from '../entities/goods-receipt/batch-receipt.entity';
import { SerialNumberAssignment } from '../entities/goods-receipt/serial-number-assignment.entity';
import { QualityInspection } from '../entities/goods-receipt/quality-inspection.entity';
import { DamageReport } from '../entities/goods-receipt/damage-report.entity';
import { ReceivingDocument } from '../entities/goods-receipt/receiving-document.entity';
import { ReceiptAttachment } from '../entities/goods-receipt/receipt-attachment.entity';

import {
  GoodsReceiptCreatedEvent,
  GoodsReceiptStartedEvent,
  GoodsReceiptCompletedEvent,
  GoodsReceiptRejectedEvent,
  GoodsReceiptCancelledEvent,
  GoodsReceiptLineAddedEvent,
  GoodsReceiptInspectionCompletedEvent,
  BatchRecordedEvent,
  SerialNumbersAssignedEvent,
  DamageReportedEvent
} from '../events/goods-receipt.events';

import { GoodsReceiptLifecyclePolicy, InspectionPolicy, ReceivingPolicy } from '../policies/goods-receipt.policy';
import {
  GoodsReceiptConsistencySpecification,
  ReceiptInspectionSpecification,
  BatchValidationSpecification,
  SerialNumberSpecification,
  GoodsReceiptLineSpecification
} from '../specifications/goods-receipt.specifications';

export interface GoodsReceiptProps {
  number?: GoodsReceiptNumber;
  reference?: GoodsReceiptReference;
  status: GoodsReceiptStatus;
  type: ReceiptType;
  receiptDate?: ReceiptDate;
  receivedBy?: ReceivedBy;
  warehouseReference?: WarehouseReference;
  receivingLocation?: ReceivingLocation;
  
  purchaseOrderReference: PurchaseOrderReference;
  supplierReference: SupplierReference;
  
  version: GoodsReceiptVersion;
  
  lines: GoodsReceiptLine[];
  batches: BatchReceipt[];
  serialNumbers: SerialNumberAssignment[];
  qualityInspection?: QualityInspection;
  damageReports: DamageReport[];
  documents: ReceivingDocument[];
  attachments: ReceiptAttachment[];
  
  createdAt: Date;
  updatedAt: Date;
}

export class GoodsReceipt extends AggregateRoot<GoodsReceiptProps> {
  get number(): GoodsReceiptNumber | undefined { return this.props.number; }
  get reference(): GoodsReceiptReference | undefined { return this.props.reference; }
  get status(): GoodsReceiptStatus { return this.props.status; }
  get type(): ReceiptType { return this.props.type; }
  get receiptDate(): ReceiptDate | undefined { return this.props.receiptDate; }
  get receivedBy(): ReceivedBy | undefined { return this.props.receivedBy; }
  get warehouseReference(): WarehouseReference | undefined { return this.props.warehouseReference; }
  get receivingLocation(): ReceivingLocation | undefined { return this.props.receivingLocation; }
  
  get purchaseOrderReference(): PurchaseOrderReference { return this.props.purchaseOrderReference; }
  get supplierReference(): SupplierReference { return this.props.supplierReference; }
  get version(): GoodsReceiptVersion { return this.props.version; }
  
  get lines(): GoodsReceiptLine[] { return [...this.props.lines]; }
  get batches(): BatchReceipt[] { return [...this.props.batches]; }
  get serialNumbers(): SerialNumberAssignment[] { return [...this.props.serialNumbers]; }
  get qualityInspection(): QualityInspection | undefined { return this.props.qualityInspection; }
  get damageReports(): DamageReport[] { return [...this.props.damageReports]; }
  get documents(): ReceivingDocument[] { return [...this.props.documents]; }
  get attachments(): ReceiptAttachment[] { return [...this.props.attachments]; }

  private constructor(props: GoodsReceiptProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    purchaseOrderReference: PurchaseOrderReference,
    supplierReference: SupplierReference,
    type: ReceiptType
  ): GoodsReceipt {
    const id = GoodsReceiptId.generate().value;
    const gr = new GoodsReceipt({
      status: GoodsReceiptStatus.DRAFT,
      type,
      purchaseOrderReference,
      supplierReference,
      version: GoodsReceiptVersion.initial(),
      lines: [],
      batches: [],
      serialNumbers: [],
      damageReports: [],
      documents: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }, id);

    gr.addDomainEvent(new GoodsReceiptCreatedEvent(id));
    return gr;
  }

  public startReceiving(date: ReceiptDate, receivedBy: ReceivedBy): void {
    GoodsReceiptLifecyclePolicy.ensureCanStartReceiving(this.props.status);
    if (!ReceivingPolicy.isReceiptDateValid(date.date)) {
      throw new Error('Receipt date cannot be in the future');
    }
    this.props.status = GoodsReceiptStatus.RECEIVING;
    this.props.receiptDate = date;
    this.props.receivedBy = receivedBy;
    this.markModified();
    this.addDomainEvent(new GoodsReceiptStartedEvent(this._id));
  }

  public addLine(line: GoodsReceiptLine): void {
    if (this.props.status === GoodsReceiptStatus.COMPLETED || this.props.status === GoodsReceiptStatus.CANCELLED) {
      throw new Error('Cannot add lines to a completed or cancelled receipt');
    }
    this.props.lines.push(line);
    this.markModified();
    this.addDomainEvent(new GoodsReceiptLineAddedEvent(this._id, line.id.toString()));
  }

  public recordBatch(batch: BatchReceipt): void {
    this.props.batches.push(batch);
    if (!BatchValidationSpecification.isSatisfiedBy(this.props.batches)) {
      this.props.batches.pop();
      throw new Error('Duplicate batch numbers are not allowed');
    }
    this.markModified();
    this.addDomainEvent(new BatchRecordedEvent(this._id, batch.id.toString()));
  }

  public assignSerialNumber(serial: SerialNumberAssignment): void {
    this.props.serialNumbers.push(serial);
    if (!SerialNumberSpecification.isSatisfiedBy(this.props.serialNumbers)) {
      this.props.serialNumbers.pop();
      throw new Error('Duplicate serial numbers are not allowed');
    }
    this.markModified();
    this.addDomainEvent(new SerialNumbersAssignedEvent(this._id, serial.id.toString()));
  }

  public reportDamage(report: DamageReport): void {
    this.props.damageReports.push(report);
    this.markModified();
    this.addDomainEvent(new DamageReportedEvent(this._id, report.id.toString()));
  }

  public recordInspection(inspection: QualityInspection): void {
    GoodsReceiptLifecyclePolicy.ensureCanInspect(this.props.status);
    this.props.qualityInspection = inspection;
    this.props.status = GoodsReceiptStatus.INSPECTION;
    this.markModified();
    this.addDomainEvent(new GoodsReceiptInspectionCompletedEvent(this._id, inspection.id.toString()));
  }

  public complete(number: GoodsReceiptNumber): void {
    GoodsReceiptLifecyclePolicy.ensureCanComplete(this.props.status);
    if (!GoodsReceiptLineSpecification.isSatisfiedBy(this.props.lines)) {
      throw new Error('Cannot complete a goods receipt without any lines');
    }
    if (!GoodsReceiptConsistencySpecification.isSatisfiedBy(this.props.lines)) {
      throw new Error('Receipt quantities do not match (accepted + rejected !== received)');
    }
    if (InspectionPolicy.isInspectionRequired() && !ReceiptInspectionSpecification.isSatisfiedBy(this.props.qualityInspection)) {
      throw new Error('Inspection is required before completing the goods receipt');
    }
    
    this.props.number = number;
    this.props.status = GoodsReceiptStatus.COMPLETED;
    this.markModified();
    this.addDomainEvent(new GoodsReceiptCompletedEvent(this._id));
  }

  public reject(): void {
    if (this.props.status === GoodsReceiptStatus.COMPLETED || this.props.status === GoodsReceiptStatus.CANCELLED) {
      throw new Error('Cannot reject a completed or cancelled receipt');
    }
    this.props.status = GoodsReceiptStatus.REJECTED;
    this.markModified();
    this.addDomainEvent(new GoodsReceiptRejectedEvent(this._id));
  }

  public cancel(): void {
    GoodsReceiptLifecyclePolicy.ensureCanCancel(this.props.status);
    this.props.status = GoodsReceiptStatus.CANCELLED;
    this.markModified();
    this.addDomainEvent(new GoodsReceiptCancelledEvent(this._id));
  }

  private markModified(): void {
    this.props.updatedAt = new Date();
    this.props.version = this.props.version.increment();
  }
}
