export class CreateInteractionDto {
  interactionNumber!: string;
  type!: string;
  channel!: string;
  direction!: string;
  subject!: string;
  occurredAt!: Date;
  durationSeconds!: number;
  participants!: { entityType: 'LEAD' | 'CUSTOMER' | 'USER' | 'EXTERNAL', entityId: string, role: string }[];
}

export class AssignInteractionDto {
  assigneeId!: string;
  assignerId!: string;
}

export class AddInteractionNoteDto {
  authorId!: string;
  content!: string;
}

export class ScheduleFollowUpDto {
  scheduledDate!: Date;
  assignedTo!: string;
  description!: string;
  scheduledBy!: string;
}

export class RecordOutcomeDto {
  outcome!: string;
  recordedBy!: string;
}

export class CloseInteractionDto {
  closedBy!: string;
}

export class ArchiveInteractionDto {
  archivedBy!: string;
}
