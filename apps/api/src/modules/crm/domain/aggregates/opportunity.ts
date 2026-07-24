import { AggregateRoot } from '@saas/domain';
import {
  OpportunityId,
  OpportunityNumber,
  OpportunityStatus,
  OpportunityStatusEnum,
  OpportunityStage,
  OpportunityStageEnum,
  OpportunitySource,
  EstimatedCloseDate,
  WinProbability,
  Currency,
  OpportunityPriority,
  ExpectedRevenue
} from '../value-objects/opportunity-core';
import { OpportunityContact } from '../entities/opportunity-contact';
import { OpportunityProduct } from '../entities/opportunity-product';
import { OpportunityCompetitor } from '../entities/opportunity-competitor';
import { OpportunityNote } from '../entities/opportunity-note';
import { OpportunityHistoryEntry } from '../entities/opportunity-history-entry';
import {
  OpportunityCreated,
  OpportunityAssigned,
  OpportunityStageChanged,
  OpportunityRevenueUpdated,
  OpportunityWon,
  OpportunityLost,
  OpportunityReopened,
  OpportunityArchived
} from '../events/opportunity-events';

export class Opportunity extends AggregateRoot<OpportunityId> {
  private _status: OpportunityStatus;
  private _stage: OpportunityStage;
  private _winProbability: WinProbability;
  private _expectedRevenue: ExpectedRevenue;
  private _assigneeId: string | null = null;
  
  private _contacts: OpportunityContact[] = [];
  private _products: OpportunityProduct[] = [];
  private _competitors: OpportunityCompetitor[] = [];
  private _notes: OpportunityNote[] = [];
  private _history: OpportunityHistoryEntry[] = [];

  constructor(
    id: OpportunityId,
    public readonly opportunityNumber: OpportunityNumber,
    public readonly leadId: string, // Link to originating Lead
    public readonly source: OpportunitySource,
    public readonly currency: Currency,
    public readonly estimatedCloseDate: EstimatedCloseDate,
    public readonly priority: OpportunityPriority,
    status: OpportunityStatus = OpportunityStatus.create(OpportunityStatusEnum.OPEN),
    stage: OpportunityStage = OpportunityStage.create(OpportunityStageEnum.DISCOVERY),
    winProbability: WinProbability = WinProbability.create(10),
    expectedRevenue: ExpectedRevenue = ExpectedRevenue.create({ amount: 0, currency: currency.toValue() })
  ) {
    super(id);
    this._status = status;
    this._stage = stage;
    this._winProbability = winProbability;
    this._expectedRevenue = expectedRevenue;
  }

  public static create(
    opportunityNumber: string,
    leadId: string,
    source: string,
    currencyCode: string,
    closeDate: Date,
    priority: string,
    initialRevenueAmount: number
  ): Opportunity {
    const id = OpportunityId.generate();
    const currency = Currency.create(currencyCode);
    
    const opportunity = new Opportunity(
      id,
      OpportunityNumber.create(opportunityNumber),
      leadId,
      OpportunitySource.create(source),
      currency,
      EstimatedCloseDate.create(closeDate),
      OpportunityPriority.create(priority),
      OpportunityStatus.create(OpportunityStatusEnum.OPEN),
      OpportunityStage.create(OpportunityStageEnum.DISCOVERY),
      WinProbability.create(10),
      ExpectedRevenue.create({ amount: initialRevenueAmount, currency: currency.toValue() })
    );

    opportunity.record(new OpportunityCreated(id.toValue(), opportunity.version(), {
      opportunityId: id.toValue(),
      leadId: leadId
    }));

    return opportunity;
  }

  get status(): OpportunityStatus { return this._status; }
  get stage(): OpportunityStage { return this._stage; }
  get winProbability(): WinProbability { return this._winProbability; }
  get expectedRevenue(): ExpectedRevenue { return this._expectedRevenue; }
  get assigneeId(): string | null { return this._assigneeId; }

  public assignOwner(assigneeId: string, assignerId: string): void {
    this.assertMutable();
    this._assigneeId = assigneeId;
    this._history.push(OpportunityHistoryEntry.create('ASSIGNED', assignerId, `Assigned to ${assigneeId}`));

    this.record(new OpportunityAssigned(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue(),
      assigneeId
    }));
  }

  public advanceStage(newStageString: string, advancedBy: string): void {
    this.assertMutable();
    
    const newStage = OpportunityStage.create(newStageString as OpportunityStageEnum);
    
    // In a real implementation we might use OpportunityStageSpecification here 
    // to strictly enforce forward-only motion, but business reality often requires regression.
    const oldStage = this._stage.toValue();
    this._stage = newStage;
    
    this._history.push(OpportunityHistoryEntry.create('STAGE_CHANGED', advancedBy, `Stage changed to ${newStage.toValue()}`));

    this.record(new OpportunityStageChanged(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue(),
      oldStage: oldStage,
      newStage: newStage.toValue()
    }));
  }

  public updateWinProbability(probability: number, updatedBy: string): void {
    this.assertMutable();
    this._winProbability = WinProbability.create(probability);
    this._history.push(OpportunityHistoryEntry.create('PROBABILITY_UPDATED', updatedBy, `Probability set to ${probability}%`));
  }

  public updateExpectedRevenue(amount: number, updatedBy: string): void {
    this.assertMutable();
    this._expectedRevenue = ExpectedRevenue.create({ amount, currency: this.currency.toValue() });
    
    this._history.push(OpportunityHistoryEntry.create('REVENUE_UPDATED', updatedBy, `Revenue set to ${amount} ${this.currency.toValue()}`));

    this.record(new OpportunityRevenueUpdated(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue(),
      newRevenue: amount
    }));
  }

  public markWon(markedBy: string): void {
    this.assertMutable();
    
    this._status = OpportunityStatus.create(OpportunityStatusEnum.WON);
    this._stage = OpportunityStage.create(OpportunityStageEnum.CLOSED);
    this._winProbability = WinProbability.create(100);
    
    this._history.push(OpportunityHistoryEntry.create('WON', markedBy, 'Opportunity marked as WON.'));

    this.record(new OpportunityWon(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue()
    }));
  }

  public markLost(reason: string, markedBy: string): void {
    this.assertMutable();
    
    this._status = OpportunityStatus.create(OpportunityStatusEnum.LOST);
    this._stage = OpportunityStage.create(OpportunityStageEnum.CLOSED);
    this._winProbability = WinProbability.create(0);
    
    this._history.push(OpportunityHistoryEntry.create('LOST', markedBy, `Opportunity marked as LOST. Reason: ${reason}`));

    this.record(new OpportunityLost(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue(),
      reason
    }));
  }

  public reopen(reopenedBy: string): void {
    if (this._status.toValue() === OpportunityStatusEnum.WON) {
      throw new Error('WON opportunities cannot be reopened.');
    }
    if (this._status.toValue() === OpportunityStatusEnum.ARCHIVED) {
      throw new Error('ARCHIVED opportunities cannot be reopened.');
    }
    
    if (this._status.toValue() === OpportunityStatusEnum.LOST) {
      this._status = OpportunityStatus.create(OpportunityStatusEnum.OPEN);
      this._stage = OpportunityStage.create(OpportunityStageEnum.NEGOTIATION);
      this._history.push(OpportunityHistoryEntry.create('REOPENED', reopenedBy, 'Opportunity reopened.'));

      this.record(new OpportunityReopened(this.id.toValue(), this.version(), {
        opportunityId: this.id.toValue()
      }));
    }
  }

  public archive(archivedBy: string): void {
    if (this._status.toValue() === OpportunityStatusEnum.ARCHIVED) return;

    this._status = OpportunityStatus.create(OpportunityStatusEnum.ARCHIVED);
    this._history.push(OpportunityHistoryEntry.create('ARCHIVED', archivedBy, 'Opportunity archived manually.'));

    this.record(new OpportunityArchived(this.id.toValue(), this.version(), {
      opportunityId: this.id.toValue()
    }));
  }

  private assertMutable(): void {
    if (this._status.toValue() === OpportunityStatusEnum.WON) {
      throw new Error('WON opportunities are immutable.');
    }
    if (this._status.toValue() === OpportunityStatusEnum.LOST) {
      throw new Error('LOST opportunities cannot be modified without reopening.');
    }
    if (this._status.toValue() === OpportunityStatusEnum.ARCHIVED) {
      throw new Error('ARCHIVED opportunities are immutable.');
    }
  }
}
