import { AggregateRoot } from '@saas/domain';
import {
  LeadId,
  LeadNumber,
  LeadStatus,
  LeadStatusEnum,
  LeadSource,
  LeadScore,
  ContactInformation,
  ExpectedRevenue,
  AcquisitionChannel,
  Industry,
  Priority
} from '../value-objects/lead-core';
import { LeadContact } from '../entities/lead-contact';
import { LeadTag } from '../entities/lead-tag';
import { LeadQualification } from '../entities/lead-qualification';
import { LeadHistoryEntry } from '../entities/lead-history-entry';
import {
  LeadCreated,
  LeadQualified,
  LeadDisqualified,
  LeadAssigned,
  LeadConvertedToOpportunity,
  LeadConvertedToCustomer,
  LeadArchived
} from '../events/lead-events';
import { LeadQualificationService, LeadScoringService, LeadConversionService } from '../services/crm-services';

export class Lead extends AggregateRoot<LeadId> {
  private _status: LeadStatus;
  private _score: LeadScore;
  private _assigneeId: string | null = null;
  
  private _contacts: LeadContact[] = [];
  private _tags: LeadTag[] = [];
  private _qualifications: LeadQualification[] = [];
  private _history: LeadHistoryEntry[] = [];
  
  constructor(
    id: LeadId,
    public readonly leadNumber: LeadNumber,
    public readonly source: LeadSource,
    public readonly contactInfo: ContactInformation,
    public readonly expectedRevenue: ExpectedRevenue,
    public readonly channel: AcquisitionChannel,
    public readonly industry: Industry,
    public readonly priority: Priority,
    status: LeadStatus = LeadStatus.create(LeadStatusEnum.NEW),
    score: LeadScore = LeadScore.create(0)
  ) {
    super(id);
    this._status = status;
    this._score = score;
  }

  public static create(
    leadNumber: string,
    source: string,
    contactInfoProps: any,
    revenueProps: any,
    channel: string,
    industry: string,
    priority: string
  ): Lead {
    const id = LeadId.generate();
    const lead = new Lead(
      id,
      LeadNumber.create(leadNumber),
      LeadSource.create(source),
      ContactInformation.create(contactInfoProps),
      ExpectedRevenue.create(revenueProps),
      AcquisitionChannel.create(channel),
      Industry.create(industry),
      Priority.create(priority)
    );

    lead.record(new LeadCreated(id.toValue(), lead.version(), {
      leadId: id.toValue(),
      email: lead.contactInfo.value.email,
      source: lead.source.toValue()
    }));

    return lead;
  }

  get status(): LeadStatus { return this._status; }
  get score(): LeadScore { return this._score; }
  get assigneeId(): string | null { return this._assigneeId; }

  public assignOwner(assigneeId: string, assignerId: string): void {
    this.assertNotArchived();
    this._assigneeId = assigneeId;
    this._history.push(LeadHistoryEntry.create('ASSIGNED', assignerId, `Assigned to ${assigneeId}`));

    this.record(new LeadAssigned(this.id.toValue(), this.version(), {
      leadId: this.id.toValue(),
      assigneeId
    }));
  }

  public qualify(qualifiedBy: string, qualificationService: LeadQualificationService, criteriaMet: string[], notes: string): void {
    this.assertNotArchived();
    this.assertNotConverted();

    const hasEmail = !!this.contactInfo.value.email;
    const hasPhone = !!this.contactInfo.value.phone;

    if (!qualificationService.canQualify(this._score.toValue(), hasEmail, hasPhone)) {
      throw new Error('Lead does not meet qualification criteria (score >= 50 and contact info present).');
    }

    this._status = LeadStatus.create(LeadStatusEnum.QUALIFIED);
    const qualification = LeadQualification.create(true, qualifiedBy, criteriaMet, notes);
    this._qualifications.push(qualification);

    this.record(new LeadQualified(this.id.toValue(), this.version(), {
      leadId: this.id.toValue(),
      qualifiedBy,
      score: this._score.toValue()
    }));
  }

  public disqualify(disqualifiedBy: string, reason: string): void {
    this.assertNotArchived();
    this.assertNotConverted();

    this._status = LeadStatus.create(LeadStatusEnum.DISQUALIFIED);
    const qualification = LeadQualification.create(false, disqualifiedBy, [], reason);
    this._qualifications.push(qualification);

    this.record(new LeadDisqualified(this.id.toValue(), this.version(), {
      leadId: this.id.toValue(),
      reason
    }));
  }

  public updateScore(scoringService: LeadScoringService): void {
    this.assertNotArchived();
    this.assertNotConverted();

    const newScoreValue = scoringService.calculateScore(
      this.industry.toValue(),
      this.expectedRevenue.value.amount,
      this._contacts.length
    );

    this._score = LeadScore.create(newScoreValue);
  }

  public convertToOpportunity(convertedBy: string, conversionService: LeadConversionService): string {
    this.assertNotArchived();
    if (this._status.toValue() !== LeadStatusEnum.QUALIFIED) {
      throw new Error('Only QUALIFIED leads can be converted to an Opportunity.');
    }

    const opportunityId = conversionService.generateOpportunityReference(this.id.toValue());
    this._status = LeadStatus.create(LeadStatusEnum.CONVERTED);
    this._history.push(LeadHistoryEntry.create('CONVERTED_TO_OPPORTUNITY', convertedBy, `Converted to ${opportunityId}`));

    this.record(new LeadConvertedToOpportunity(this.id.toValue(), this.version(), {
      leadId: this.id.toValue(),
      opportunityId
    }));

    return opportunityId;
  }

  public convertToCustomer(convertedBy: string, customerId: string): void {
    this.assertNotArchived();
    if (this._status.toValue() !== LeadStatusEnum.QUALIFIED) {
      throw new Error('Only QUALIFIED leads can be converted to a Customer.');
    }

    this._status = LeadStatus.create(LeadStatusEnum.CONVERTED);
    this._history.push(LeadHistoryEntry.create('CONVERTED_TO_CUSTOMER', convertedBy, `Converted to ${customerId}`));

    this.record(new LeadConvertedToCustomer(this.id.toValue(), this.version(), {
      leadId: this.id.toValue(),
      customerId
    }));
  }

  public archive(archivedBy: string): void {
    if (this._status.toValue() === LeadStatusEnum.ARCHIVED) return;

    this._status = LeadStatus.create(LeadStatusEnum.ARCHIVED);
    this._history.push(LeadHistoryEntry.create('ARCHIVED', archivedBy, 'Lead archived manually.'));

    this.record(new LeadArchived(this.id.toValue(), this.version(), {
      leadId: this.id.toValue()
    }));
  }

  private assertNotArchived(): void {
    if (this._status.toValue() === LeadStatusEnum.ARCHIVED) {
      throw new Error('Archived leads are immutable.');
    }
  }

  private assertNotConverted(): void {
    if (this._status.toValue() === LeadStatusEnum.CONVERTED) {
      throw new Error('Lead cannot be modified after conversion.');
    }
  }
}
