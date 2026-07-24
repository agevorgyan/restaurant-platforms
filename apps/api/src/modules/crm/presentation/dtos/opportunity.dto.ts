export class CreateOpportunityDto {
  opportunityNumber!: string;
  leadId!: string;
  source!: string;
  currencyCode!: string;
  closeDate!: Date;
  priority!: string;
  initialRevenueAmount!: number;
}

export class AssignOpportunityDto {
  assigneeId!: string;
  assignerId!: string;
}

export class AdvanceOpportunityStageDto {
  newStage!: string;
  advancedBy!: string;
}

export class UpdateWinProbabilityDto {
  probability!: number;
  updatedBy!: string;
}

export class UpdateExpectedRevenueDto {
  amount!: number;
  updatedBy!: string;
}

export class MarkOpportunityWonDto {
  markedBy!: string;
}

export class MarkOpportunityLostDto {
  reason!: string;
  markedBy!: string;
}

export class ReopenOpportunityDto {
  reopenedBy!: string;
}

export class ArchiveOpportunityDto {
  archivedBy!: string;
}
