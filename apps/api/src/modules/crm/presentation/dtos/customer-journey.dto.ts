export class CreateCustomerJourneyDto {
  journeyNumber!: string;
  customerReference!: string;
  journeyType!: string;
  createdBy!: string;
}

export class AdvanceJourneyStageDto {
  newStage!: string;
  advancedBy!: string;
}

export class AddJourneyMilestoneDto {
  milestoneName!: string;
  addedBy!: string;
}

export class CompleteJourneyMilestoneDto {
  milestoneName!: string;
  completedBy!: string;
  notes?: string;
}

export class PauseJourneyDto {
  pausedBy!: string;
}

export class ResumeJourneyDto {
  resumedBy!: string;
}

export class CloseJourneyDto {
  closedBy!: string;
}

export class ArchiveJourneyDto {
  archivedBy!: string;
}
