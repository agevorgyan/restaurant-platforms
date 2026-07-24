import { AggregateRoot } from '@saas/domain';
import {
  JourneyId,
  JourneyNumber,
  JourneyStage,
  JourneyStageEnum,
  JourneyStatus,
  JourneyStatusEnum,
  JourneyType,
  CustomerReference,
  JourneyStartDate,
  JourneyEndDate,
  HealthScore,
  RiskLevel,
  RiskLevelEnum
} from '../value-objects/customer-journey-core';
import { JourneyMilestone } from '../entities/journey-milestone';
import { JourneyGoal } from '../entities/journey-goal';
import { JourneyCheckpoint } from '../entities/journey-checkpoint';
import { JourneyTag } from '../entities/journey-tag';
import { JourneyHistoryEntry } from '../entities/journey-history-entry';
import {
  JourneyCreated,
  JourneyStageAdvanced,
  JourneyHealthUpdated,
  JourneyMilestoneAdded,
  JourneyMilestoneCompleted,
  JourneyPaused,
  JourneyResumed,
  JourneyClosed,
  JourneyArchived
} from '../events/customer-journey-events';
import { JourneyStageSpecification, JourneyHealthSpecification } from '../rules/crm-rules';

export class CustomerJourney extends AggregateRoot<JourneyId> {
  private _status: JourneyStatus;
  private _stage: JourneyStage;
  private _healthScore: HealthScore;
  private _riskLevel: RiskLevel;
  private _endDate: JourneyEndDate | null = null;
  
  private _milestones: JourneyMilestone[] = [];
  private _goals: JourneyGoal[] = [];
  private _checkpoints: JourneyCheckpoint[] = [];
  private _tags: JourneyTag[] = [];
  private _history: JourneyHistoryEntry[] = [];

  constructor(
    id: JourneyId,
    public readonly journeyNumber: JourneyNumber,
    public readonly customerReference: CustomerReference,
    public readonly journeyType: JourneyType,
    public readonly startDate: JourneyStartDate,
    status: JourneyStatus = JourneyStatus.create(JourneyStatusEnum.ACTIVE),
    stage: JourneyStage = JourneyStage.create(JourneyStageEnum.ANONYMOUS),
    healthScore: HealthScore = HealthScore.create(100),
    riskLevel: RiskLevel = RiskLevel.create(RiskLevelEnum.LOW)
  ) {
    super(id);
    this._status = status;
    this._stage = stage;
    this._healthScore = healthScore;
    this._riskLevel = riskLevel;
  }

  public static create(
    journeyNumber: string,
    customerReference: string,
    journeyType: string,
    createdBy: string
  ): CustomerJourney {
    const id = JourneyId.generate();
    
    const journey = new CustomerJourney(
      id,
      JourneyNumber.create(journeyNumber),
      CustomerReference.create(customerReference),
      JourneyType.create(journeyType),
      JourneyStartDate.create(new Date())
    );

    journey._history.push(JourneyHistoryEntry.create('CREATED', createdBy, `Journey started for ${customerReference}`));

    journey.record(new JourneyCreated(id.toValue(), journey.version(), {
      journeyId: id.toValue(),
      customerReference,
      journeyType
    }));

    return journey;
  }

  get status(): JourneyStatus { return this._status; }
  get stage(): JourneyStage { return this._stage; }
  get healthScore(): HealthScore { return this._healthScore; }
  get riskLevel(): RiskLevel { return this._riskLevel; }
  get endDate(): JourneyEndDate | null { return this._endDate; }

  public advanceStage(newStageStr: string, advancedBy: string, spec: JourneyStageSpecification): void {
    this.assertMutable();
    
    const oldStage = this._stage.toValue();
    
    if (!spec.isSatisfiedBy({ currentStage: oldStage, nextStage: newStageStr })) {
      throw new Error(`Cannot advance stage from ${oldStage} to ${newStageStr}`);
    }

    this._stage = JourneyStage.create(newStageStr as JourneyStageEnum);
    this._history.push(JourneyHistoryEntry.create('STAGE_ADVANCED', advancedBy, `Stage advanced to ${newStageStr}`));

    this.record(new JourneyStageAdvanced(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue(),
      oldStage: oldStage,
      newStage: newStageStr
    }));
  }

  public updateHealthScore(newScore: number, updatedBy: string, spec: JourneyHealthSpecification): void {
    this.assertMutable();
    
    if (!spec.isSatisfiedBy({ score: newScore })) {
      throw new Error('Invalid health score.');
    }

    this._healthScore = HealthScore.create(newScore);
    
    // Auto-update risk level based on health score
    if (newScore < 30) this._riskLevel = RiskLevel.create(RiskLevelEnum.CRITICAL);
    else if (newScore < 50) this._riskLevel = RiskLevel.create(RiskLevelEnum.HIGH);
    else if (newScore < 75) this._riskLevel = RiskLevel.create(RiskLevelEnum.MEDIUM);
    else this._riskLevel = RiskLevel.create(RiskLevelEnum.LOW);

    this._history.push(JourneyHistoryEntry.create('HEALTH_UPDATED', updatedBy, `Health score updated to ${newScore}`));

    this.record(new JourneyHealthUpdated(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue(),
      healthScore: newScore
    }));
  }

  public addMilestone(name: string, addedBy: string): void {
    this.assertMutable();
    
    const sequence = this._milestones.length + 1;
    this._milestones.push(JourneyMilestone.create(name, sequence));
    this._history.push(JourneyHistoryEntry.create('MILESTONE_ADDED', addedBy, `Added milestone: ${name}`));

    this.record(new JourneyMilestoneAdded(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue(),
      milestoneName: name
    }));
  }

  public completeMilestone(name: string, completedBy: string, notes?: string): void {
    this.assertMutable();
    
    const milestone = this._milestones.find(m => m.name === name);
    if (!milestone) throw new Error('Milestone not found.');
    if (milestone.isCompleted) throw new Error('Milestone is already completed.');

    milestone.complete(completedBy, notes);
    this._history.push(JourneyHistoryEntry.create('MILESTONE_COMPLETED', completedBy, `Completed milestone: ${name}`));

    this.record(new JourneyMilestoneCompleted(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue(),
      milestoneName: name
    }));
  }

  public pause(pausedBy: string): void {
    if (this._status.toValue() !== JourneyStatusEnum.ACTIVE) {
      throw new Error('Only active journeys can be paused.');
    }

    this._status = JourneyStatus.create(JourneyStatusEnum.PAUSED);
    this._history.push(JourneyHistoryEntry.create('PAUSED', pausedBy, 'Journey paused.'));

    this.record(new JourneyPaused(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue()
    }));
  }

  public resume(resumedBy: string): void {
    if (this._status.toValue() !== JourneyStatusEnum.PAUSED) {
      throw new Error('Only paused journeys can be resumed.');
    }

    this._status = JourneyStatus.create(JourneyStatusEnum.ACTIVE);
    this._history.push(JourneyHistoryEntry.create('RESUMED', resumedBy, 'Journey resumed.'));

    this.record(new JourneyResumed(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue()
    }));
  }

  public close(closedBy: string): void {
    this.assertMutable();

    this._status = JourneyStatus.create(JourneyStatusEnum.CLOSED);
    this._endDate = JourneyEndDate.create(new Date());
    this._history.push(JourneyHistoryEntry.create('CLOSED', closedBy, 'Journey closed.'));

    this.record(new JourneyClosed(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue()
    }));
  }

  public archive(archivedBy: string): void {
    if (this._status.toValue() === JourneyStatusEnum.ARCHIVED) return;

    this._status = JourneyStatus.create(JourneyStatusEnum.ARCHIVED);
    this._history.push(JourneyHistoryEntry.create('ARCHIVED', archivedBy, 'Journey archived.'));

    this.record(new JourneyArchived(this.id.toValue(), this.version(), {
      journeyId: this.id.toValue()
    }));
  }

  private assertMutable(): void {
    if (this._status.toValue() === JourneyStatusEnum.CLOSED) {
      throw new Error('Closed journeys cannot be modified.');
    }
    if (this._status.toValue() === JourneyStatusEnum.ARCHIVED) {
      throw new Error('Archived journeys are immutable.');
    }
  }
}
