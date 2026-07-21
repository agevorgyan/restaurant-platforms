import { AggregateRoot } from '@saas/core';
import { PricingSessionId } from '../value-objects/pricing-session-id.value-object';
import { PricingContext } from '../value-objects/pricing-context.value-object';
import { PricingResult } from '../value-objects/pricing-result.value-object';
import { PricingSnapshot } from '../value-objects/pricing-snapshot.value-object';
import { PricingVersion } from '../value-objects/pricing-version.value-object';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';
import { PricingLineItem } from '../entities/pricing-line-item.entity';
import { PricingAdjustment } from '../entities/pricing-adjustment.entity';
import { AppliedPricingRule } from '../entities/applied-pricing-rule.entity';
import { AppliedTax } from '../entities/applied-tax.entity';
import { AppliedCharge } from '../entities/applied-charge.entity';
import {
  PricingSessionCreated,
  PricingCalculated,
  PricingRecalculated,
  PricingSnapshotGenerated,
  PricingSessionClosed
} from '../events/pricing-session-events';
import { PricingContextSpecification } from '../specifications/pricing-context.specification';
import { PricingPipelineSpecification } from '../specifications/pricing-pipeline.specification';

export interface PricingSessionProps {
  id: PricingSessionId;
  context: PricingContext;
  version: PricingVersion;
  isClosed: boolean;
  lineItems: PricingLineItem[];
  adjustments: PricingAdjustment[];
  appliedRules: AppliedPricingRule[];
  appliedTaxes: AppliedTax[];
  appliedCharges: AppliedCharge[];
  result?: PricingResult;
  snapshot?: PricingSnapshot;
  trace?: CalculationTrace;
}

export class PricingSession extends AggregateRoot<PricingSessionProps> {
  private constructor(props: PricingSessionProps) {
    super(props.id.value, props);
  }

  public static create(
    id: PricingSessionId,
    context: PricingContext
  ): PricingSession {
    const contextSpec = new PricingContextSpecification();
    if (!contextSpec.isSatisfiedBy(context)) {
      throw new Error('Invalid pricing context');
    }

    const session = new PricingSession({
      id,
      context,
      version: PricingVersion.initial(),
      isClosed: false,
      lineItems: [],
      adjustments: [],
      appliedRules: [],
      appliedTaxes: [],
      appliedCharges: [],
    });

    session.addDomainEvent(new PricingSessionCreated(id));
    return session;
  }

  get sessionId(): PricingSessionId { return this.props.id; }
  get context(): PricingContext { return this.props.context; }
  get version(): PricingVersion { return this.props.version; }
  get isClosed(): boolean { return this.props.isClosed; }
  get lineItems(): PricingLineItem[] { return [...this.props.lineItems]; }
  get result(): PricingResult | undefined { return this.props.result; }
  get snapshot(): PricingSnapshot | undefined { return this.props.snapshot; }
  get trace(): CalculationTrace | undefined { return this.props.trace; }
  get appliedRules(): AppliedPricingRule[] { return [...this.props.appliedRules]; }
  get appliedTaxes(): AppliedTax[] { return [...this.props.appliedTaxes]; }
  get appliedCharges(): AppliedCharge[] { return [...this.props.appliedCharges]; }

  public addLineItem(item: PricingLineItem): void {
    if (this.props.isClosed) {
      throw new Error('Cannot modify a closed pricing session');
    }
    if (this.props.result) {
      throw new Error('Cannot modify line items after calculation. Create a new session or recalculate.');
    }
    if (this.props.lineItems.some(i => i.id === item.id)) {
      throw new Error('Duplicate line items are not allowed');
    }
    this.props.lineItems.push(item);
  }

  public completeCalculation(
    result: PricingResult,
    trace: CalculationTrace,
    appliedRules: AppliedPricingRule[],
    appliedTaxes: AppliedTax[],
    appliedCharges: AppliedCharge[]
  ): void {
    if (this.props.isClosed) {
      throw new Error('Cannot calculate a closed pricing session');
    }
    
    const pipelineSpec = new PricingPipelineSpecification();
    if (!pipelineSpec.isSatisfiedBy(trace)) {
      throw new Error('Calculation trace does not satisfy pipeline requirements (missing stages or incorrect order)');
    }

    this.props.result = result;
    this.props.trace = trace;
    this.props.appliedRules = appliedRules;
    this.props.appliedTaxes = appliedTaxes;
    this.props.appliedCharges = appliedCharges;

    if (this.props.version.value === 1) {
      this.addDomainEvent(new PricingCalculated(this.props.id, this.props.version));
    } else {
      this.addDomainEvent(new PricingRecalculated(this.props.id, this.props.version));
    }
  }

  public attachSnapshot(snapshot: PricingSnapshot): void {
    if (this.props.isClosed) {
      throw new Error('Cannot attach snapshot to a closed pricing session');
    }
    if (!this.props.result) {
      throw new Error('Cannot attach snapshot without a valid calculation result');
    }
    if (snapshot.version !== this.props.version.value) {
      throw new Error('Snapshot version mismatch');
    }

    this.props.snapshot = snapshot;
    this.addDomainEvent(new PricingSnapshotGenerated(this.props.id, snapshot.hash));
  }

  public recalculate(): void {
    if (this.props.isClosed) {
      throw new Error('Cannot recalculate a closed pricing session');
    }
    this.props.version = this.props.version.next();
    this.props.result = undefined;
    this.props.snapshot = undefined;
    this.props.trace = undefined;
    this.props.appliedRules = [];
    this.props.appliedTaxes = [];
    this.props.appliedCharges = [];
  }

  public close(): void {
    if (this.props.isClosed) return;
    if (!this.props.snapshot) {
      throw new Error('Cannot close a pricing session without generating a snapshot');
    }
    this.props.isClosed = true;
    this.addDomainEvent(new PricingSessionClosed(this.props.id));
  }
}
