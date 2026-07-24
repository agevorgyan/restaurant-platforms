import { AggregateRoot } from '@saas/domain';
import {
  InteractionId,
  InteractionNumber,
  InteractionType,
  InteractionChannel,
  InteractionChannelEnum,
  InteractionDirection,
  InteractionDirectionEnum,
  InteractionStatus,
  InteractionStatusEnum,
  InteractionSubject,
  OccurredAt,
  Duration,
  Outcome
} from '../value-objects/interaction-core';
import { Participant } from '../entities/interaction-participant';
import { InteractionNote } from '../entities/interaction-note';
import { FollowUpReference } from '../entities/interaction-followup-reference';
import { AttachmentReference } from '../entities/interaction-attachment-reference';
import { InteractionHistoryEntry } from '../entities/interaction-history-entry';
import {
  InteractionCreated,
  InteractionAssigned,
  InteractionOutcomeRecorded,
  InteractionNoteAdded,
  FollowUpScheduled,
  InteractionClosed,
  InteractionArchived
} from '../events/interaction-events';

export class Interaction extends AggregateRoot<InteractionId> {
  private _status: InteractionStatus;
  private _assigneeId: string | null = null;
  private _outcome: Outcome | null = null;
  
  private _participants: Participant[] = [];
  private _notes: InteractionNote[] = [];
  private _followUps: FollowUpReference[] = [];
  private _attachments: AttachmentReference[] = [];
  private _history: InteractionHistoryEntry[] = [];

  constructor(
    id: InteractionId,
    public readonly interactionNumber: InteractionNumber,
    public readonly type: InteractionType,
    public readonly channel: InteractionChannel,
    public readonly direction: InteractionDirection,
    public readonly subject: InteractionSubject,
    public readonly occurredAt: OccurredAt,
    public readonly duration: Duration,
    status: InteractionStatus = InteractionStatus.create(InteractionStatusEnum.OPEN)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    interactionNumber: string,
    type: string,
    channelString: string,
    directionString: string,
    subject: string,
    occurredAt: Date,
    durationSeconds: number,
    participants: { entityType: 'LEAD' | 'CUSTOMER' | 'USER' | 'EXTERNAL', entityId: string, role: string }[]
  ): Interaction {
    if (!participants || participants.length === 0) {
      throw new Error('Every interaction must have at least one participant.');
    }

    const id = InteractionId.generate();
    const channel = InteractionChannel.create(channelString as InteractionChannelEnum);
    
    const interaction = new Interaction(
      id,
      InteractionNumber.create(interactionNumber),
      InteractionType.create(type),
      channel,
      InteractionDirection.create(directionString as InteractionDirectionEnum),
      InteractionSubject.create(subject),
      OccurredAt.create(occurredAt),
      Duration.create(durationSeconds)
    );

    participants.forEach(p => {
      interaction._participants.push(Participant.create(p.entityType, p.entityId, p.role));
    });

    interaction.record(new InteractionCreated(id.toValue(), interaction.version(), {
      interactionId: id.toValue(),
      channel: channel.toValue(),
      type: type
    }));

    return interaction;
  }

  get status(): InteractionStatus { return this._status; }
  get assigneeId(): string | null { return this._assigneeId; }
  get outcome(): Outcome | null { return this._outcome; }
  get participants(): Participant[] { return [...this._participants]; }

  public assignOwner(assigneeId: string, assignerId: string): void {
    this.assertMutable();
    this._assigneeId = assigneeId;
    this._history.push(InteractionHistoryEntry.create('ASSIGNED', assignerId, `Assigned to ${assigneeId}`));

    this.record(new InteractionAssigned(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue(),
      assigneeId
    }));
  }

  public recordOutcome(outcomeStr: string, recordedBy: string): void {
    this.assertMutable();
    this._outcome = Outcome.create(outcomeStr);
    this._history.push(InteractionHistoryEntry.create('OUTCOME_RECORDED', recordedBy, `Outcome recorded.`));

    this.record(new InteractionOutcomeRecorded(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue(),
      outcome: outcomeStr
    }));
  }

  public addNote(authorId: string, content: string): void {
    this.assertMutable();
    this._notes.push(InteractionNote.create(authorId, content));
    
    this.record(new InteractionNoteAdded(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue(),
      authorId
    }));
  }

  public scheduleFollowUp(scheduledDate: Date, assignedTo: string, description: string, scheduledBy: string): void {
    this.assertMutable();
    
    if (scheduledDate < this.occurredAt.toValue()) {
      throw new Error('Follow-up date cannot be earlier than interaction date.');
    }

    this._followUps.push(FollowUpReference.create(scheduledDate, assignedTo, description));
    this._history.push(InteractionHistoryEntry.create('FOLLOW_UP_SCHEDULED', scheduledBy, `Follow up scheduled for ${scheduledDate.toISOString()}`));

    this.record(new FollowUpScheduled(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue(),
      scheduledDate,
      assignedTo
    }));
  }
  
  public attachFile(storageKey: string, fileName: string, mimeType: string, sizeBytes: number, attachedBy: string): void {
    this.assertMutable();
    this._attachments.push(AttachmentReference.create(storageKey, fileName, mimeType, sizeBytes));
    this._history.push(InteractionHistoryEntry.create('FILE_ATTACHED', attachedBy, `Attached ${fileName}`));
  }

  public close(closedBy: string): void {
    this.assertMutable();
    this._status = InteractionStatus.create(InteractionStatusEnum.CLOSED);
    this._history.push(InteractionHistoryEntry.create('CLOSED', closedBy, 'Interaction closed.'));

    this.record(new InteractionClosed(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue()
    }));
  }

  public archive(archivedBy: string): void {
    if (this._status.toValue() === InteractionStatusEnum.ARCHIVED) return;
    this._status = InteractionStatus.create(InteractionStatusEnum.ARCHIVED);
    this._history.push(InteractionHistoryEntry.create('ARCHIVED', archivedBy, 'Interaction archived manually.'));

    this.record(new InteractionArchived(this.id.toValue(), this.version(), {
      interactionId: this.id.toValue()
    }));
  }

  private assertMutable(): void {
    if (this._status.toValue() === InteractionStatusEnum.CLOSED) {
      throw new Error('Closed interactions cannot be modified.');
    }
    if (this._status.toValue() === InteractionStatusEnum.ARCHIVED) {
      throw new Error('Archived interactions are immutable.');
    }
  }
}
