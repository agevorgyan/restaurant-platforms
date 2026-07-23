import { AggregateRoot } from '@saas/core';
import { PurchaseOrderId } from '../value-objects/purchase-order-id.value-object';
import { PurchaseOrderNumber } from '../value-objects/purchase-order/purchase-order-number.value-object';
import { PurchaseOrderReference } from '../value-objects/purchase-order/purchase-order-reference.value-object';
import { PurchaseOrderStatus } from '../enums/procurement.enums';
import { PurchaseOrderType } from '../value-objects/purchase-order/purchase-order-type.value-object';
import { OrderCurrency } from '../value-objects/purchase-order/order-currency.value-object';
import { PurchaseOrderAmount } from '../value-objects/purchase-order/purchase-order-amount.value-object';
import { PurchaseOrderVersion } from '../value-objects/purchase-order/purchase-order-version.value-object';
import { SupplierReference } from '../value-objects/supplier-reference.value-object';
import { PurchaseRequisitionReference } from '../value-objects/purchase-order/purchase-requisition-reference.value-object';
import { BuyerReference } from '../value-objects/purchase-order/buyer-reference.value-object';
import { ShippingAddress } from '../value-objects/purchase-order/shipping-address.value-object';
import { BillingAddress } from '../value-objects/purchase-order/billing-address.value-object';
import { Incoterm } from '../value-objects/purchase-order/incoterm.value-object';

import { PurchaseOrderLine } from '../entities/purchase-order/purchase-order-line.entity';
import { DeliverySchedule } from '../entities/purchase-order/delivery-schedule.entity';
import { PaymentTerms } from '../entities/purchase-order/payment-terms.entity';
import { PurchaseOrderNote } from '../entities/purchase-order/purchase-order-note.entity';
import { SupplierConfirmation } from '../entities/purchase-order/supplier-confirmation.entity';
import { PurchaseOrderAttachment } from '../entities/purchase-order/purchase-order-attachment.entity';

import {
  PurchaseOrderCreatedEvent,
  PurchaseOrderSubmittedEvent,
  PurchaseOrderConfirmedEvent,
  PurchaseOrderCancelledEvent,
  PurchaseOrderClosedEvent,
  PurchaseOrderLineAddedEvent,
  PurchaseOrderLineRemovedEvent,
  DeliveryScheduleUpdatedEvent,
  SupplierConfirmationReceivedEvent,
  PurchaseOrderPartiallyReceivedEvent,
  PurchaseOrderFullyReceivedEvent
} from '../events/purchase-order.events';

import { PurchaseOrderLifecyclePolicy, PurchaseOrderValidationPolicy } from '../policies/purchase-order.policy';
import { PurchaseOrderConsistencySpecification } from '../specifications/purchase-order.specifications';

export interface PurchaseOrderProps {
  number?: PurchaseOrderNumber;
  reference?: PurchaseOrderReference;
  status: PurchaseOrderStatus;
  type: PurchaseOrderType;
  currency: OrderCurrency;
  totalAmount: PurchaseOrderAmount;
  version: PurchaseOrderVersion;
  
  supplierReference: SupplierReference;
  requisitionReference?: PurchaseRequisitionReference;
  buyerReference: BuyerReference;
  
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  incoterm?: Incoterm;
  
  lines: PurchaseOrderLine[];
  deliverySchedule?: DeliverySchedule;
  paymentTerms?: PaymentTerms;
  notes: PurchaseOrderNote[];
  supplierConfirmation?: SupplierConfirmation;
  attachments: PurchaseOrderAttachment[];
  
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseOrder extends AggregateRoot<PurchaseOrderProps> {
  get number(): PurchaseOrderNumber | undefined { return this.props.number; }
  get reference(): PurchaseOrderReference | undefined { return this.props.reference; }
  get status(): PurchaseOrderStatus { return this.props.status; }
  get type(): PurchaseOrderType { return this.props.type; }
  get currency(): OrderCurrency { return this.props.currency; }
  get totalAmount(): PurchaseOrderAmount { return this.props.totalAmount; }
  get version(): PurchaseOrderVersion { return this.props.version; }
  get supplierReference(): SupplierReference { return this.props.supplierReference; }
  get requisitionReference(): PurchaseRequisitionReference | undefined { return this.props.requisitionReference; }
  get buyerReference(): BuyerReference { return this.props.buyerReference; }
  get shippingAddress(): ShippingAddress { return this.props.shippingAddress; }
  get billingAddress(): BillingAddress { return this.props.billingAddress; }
  get incoterm(): Incoterm | undefined { return this.props.incoterm; }
  
  get lines(): PurchaseOrderLine[] { return [...this.props.lines]; }
  get deliverySchedule(): DeliverySchedule | undefined { return this.props.deliverySchedule; }
  get paymentTerms(): PaymentTerms | undefined { return this.props.paymentTerms; }
  get notes(): PurchaseOrderNote[] { return [...this.props.notes]; }
  get supplierConfirmation(): SupplierConfirmation | undefined { return this.props.supplierConfirmation; }
  get attachments(): PurchaseOrderAttachment[] { return [...this.props.attachments]; }

  private constructor(props: PurchaseOrderProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    supplierReference: SupplierReference,
    buyerReference: BuyerReference,
    type: PurchaseOrderType,
    currency: OrderCurrency,
    shippingAddress: ShippingAddress,
    billingAddress: BillingAddress
  ): PurchaseOrder {
    const id = PurchaseOrderId.generate().value;
    const po = new PurchaseOrder({
      status: PurchaseOrderStatus.DRAFT,
      type,
      currency,
      totalAmount: PurchaseOrderAmount.zero(),
      version: PurchaseOrderVersion.initial(),
      supplierReference,
      buyerReference,
      shippingAddress,
      billingAddress,
      lines: [],
      notes: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }, id);

    po.addDomainEvent(new PurchaseOrderCreatedEvent(id));
    return po;
  }

  public updateNumber(newNumber: PurchaseOrderNumber): void {
    const isSubmitted = this.props.status !== PurchaseOrderStatus.DRAFT;
    if (this.props.number) {
      PurchaseOrderValidationPolicy.ensureNumberImmutable(isSubmitted, newNumber.value, this.props.number.value);
    }
    this.props.number = newNumber;
    this.markModified();
  }

  public addLine(line: PurchaseOrderLine): void {
    PurchaseOrderValidationPolicy.ensureLinesImmutableAfterConfirmation(this.props.status);
    this.props.lines.push(line);
    this.recalculateTotal();
    this.markModified();
    this.addDomainEvent(new PurchaseOrderLineAddedEvent(this._id, line.id.toString()));
  }

  public removeLine(lineId: string): void {
    PurchaseOrderValidationPolicy.ensureLinesImmutableAfterConfirmation(this.props.status);
    this.props.lines = this.props.lines.filter(l => l.id.toString() !== lineId);
    this.recalculateTotal();
    this.markModified();
    this.addDomainEvent(new PurchaseOrderLineRemovedEvent(this._id, lineId));
  }

  public updateDeliverySchedule(schedule: DeliverySchedule): void {
    PurchaseOrderValidationPolicy.ensureLinesImmutableAfterConfirmation(this.props.status);
    this.props.deliverySchedule = schedule;
    this.markModified();
    this.addDomainEvent(new DeliveryScheduleUpdatedEvent(this._id));
  }

  public submit(): void {
    PurchaseOrderLifecyclePolicy.ensureCanSubmit(this.props.status, this.props.lines);
    if (!PurchaseOrderConsistencySpecification.isSatisfiedBy(this.props.lines, this.props.totalAmount)) {
      throw new Error('Purchase order total amount does not match sum of lines');
    }
    this.props.status = PurchaseOrderStatus.PENDING_SUPPLIER_CONFIRMATION;
    this.markModified();
    this.addDomainEvent(new PurchaseOrderSubmittedEvent(this._id));
  }

  public confirmBySupplier(confirmation: SupplierConfirmation): void {
    PurchaseOrderLifecyclePolicy.ensureCanConfirm(this.props.status);
    this.props.supplierConfirmation = confirmation;
    this.props.status = PurchaseOrderStatus.CONFIRMED;
    this.markModified();
    this.addDomainEvent(new SupplierConfirmationReceivedEvent(this._id));
    this.addDomainEvent(new PurchaseOrderConfirmedEvent(this._id));
  }

  public markPartiallyReceived(): void {
    if (this.props.status !== PurchaseOrderStatus.CONFIRMED && this.props.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
      throw new Error('Can only receive from CONFIRMED or PARTIALLY_RECEIVED status');
    }
    this.props.status = PurchaseOrderStatus.PARTIALLY_RECEIVED;
    this.markModified();
    this.addDomainEvent(new PurchaseOrderPartiallyReceivedEvent(this._id));
  }

  public markFullyReceived(): void {
    if (this.props.status !== PurchaseOrderStatus.CONFIRMED && this.props.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
      throw new Error('Can only receive from CONFIRMED or PARTIALLY_RECEIVED status');
    }
    this.props.status = PurchaseOrderStatus.FULLY_RECEIVED;
    this.markModified();
    this.addDomainEvent(new PurchaseOrderFullyReceivedEvent(this._id));
  }

  public close(): void {
    if (this.props.status !== PurchaseOrderStatus.FULLY_RECEIVED) {
      throw new Error('Can only close FULLY_RECEIVED purchase orders');
    }
    this.props.status = PurchaseOrderStatus.CLOSED;
    this.markModified();
    this.addDomainEvent(new PurchaseOrderClosedEvent(this._id));
  }

  public cancel(): void {
    PurchaseOrderLifecyclePolicy.ensureCanCancel(this.props.status);
    this.props.status = PurchaseOrderStatus.CANCELLED;
    this.markModified();
    this.addDomainEvent(new PurchaseOrderCancelledEvent(this._id));
  }

  private recalculateTotal(): void {
    const total = this.props.lines.reduce((sum, line) => sum + line.totalPrice.amount, 0);
    this.props.totalAmount = PurchaseOrderAmount.create(total);
  }

  private markModified(): void {
    this.props.updatedAt = new Date();
    this.props.version = this.props.version.increment();
  }
}
