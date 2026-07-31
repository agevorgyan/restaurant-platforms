/**
 * Enterprise Prompt Management Platform - Prompt Aggregate Root
 *
 * Manages versioned prompts, template variable binding, governance approval workflow,
 * evaluation testing, and immutability enforcement for published prompts.
 */

import { PromptStatus, PromptType, EvaluationStatus } from '../enums/prompt.enums';
import {
  PromptId,
  PromptVersion,
  PromptTemplate,
  PromptVariable,
  PromptMetadata,
  PromptEvaluation,
  PromptScore,
  PromptOutput,
} from '../value-objects/prompt-vo';
import { BaseDomainEvent } from '../events/ai.events';
import {
  PromptCreatedEvent,
  PromptUpdatedEvent,
  PromptSubmittedForReviewEvent,
  PromptApprovedEvent,
  PromptPublishedEvent,
  PromptDeprecatedEvent,
  PromptEvaluatedEvent,
} from '../events/prompt.events';
import { PublishedPromptImmutableException, PromptApprovalException } from '../exceptions/prompt.exceptions';

export interface PromptAggregateProps {
  id: PromptId;
  tenantId: string;
  name: string;
  type: PromptType;
  version: PromptVersion;
  status: PromptStatus;
  template: PromptTemplate;
  variables: PromptVariable[];
  metadata: PromptMetadata;
  evaluation?: PromptEvaluation;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PromptAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: PromptAggregateProps) {}

  public static create(params: {
    id?: PromptId;
    tenantId?: string;
    name: string;
    type?: PromptType;
    version?: string;
    templateText: string;
    author: string;
    description: string;
    category?: string;
    tags?: string[];
  }): PromptAggregate {
    const id = params.id || PromptId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const type = params.type || PromptType.SYSTEM_PROMPT;
    const version = PromptVersion.create(params.version || '1.0.0');
    const template = PromptTemplate.create(params.templateText);
    const metadata = PromptMetadata.create({
      author: params.author,
      description: params.description,
      category: params.category,
      tags: params.tags,
    });

    const extractedVars = template.extractVariables();
    const variables = extractedVars.map(v => PromptVariable.create(v));

    const now = new Date();
    const aggregate = new PromptAggregate({
      id,
      tenantId,
      name: params.name,
      type,
      version,
      status: PromptStatus.DRAFT,
      template,
      variables,
      metadata,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new PromptCreatedEvent(id.getValue(), tenantId, params.name, type, version.getValue(), now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): PromptId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getType(): PromptType { return this.props.type; }
  public getVersion(): PromptVersion { return this.props.version; }
  public getStatus(): PromptStatus { return this.props.status; }
  public getTemplate(): PromptTemplate { return this.props.template; }
  public getVariables(): PromptVariable[] { return [...this.props.variables]; }
  public getMetadata(): PromptMetadata { return this.props.metadata; }
  public getEvaluation(): PromptEvaluation | undefined { return this.props.evaluation; }
  public getApprovedBy(): string | undefined { return this.props.approvedBy; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public updateTemplate(newTemplateText: string): void {
    if (this.props.status === PromptStatus.PUBLISHED) {
      throw new PublishedPromptImmutableException(this.getId().getValue(), this.getVersion().getValue());
    }

    const template = PromptTemplate.create(newTemplateText);
    const extractedVars = template.extractVariables();
    const variables = extractedVars.map(v => PromptVariable.create(v));

    this.props.template = template;
    this.props.variables = variables;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PromptUpdatedEvent(this.getId().getValue(), this.getTenantId(), this.getVersion().getValue(), new Date())
    );
  }

  public submitForReview(submittedBy: string): void {
    if (this.props.status !== PromptStatus.DRAFT) {
      throw new PromptApprovalException(`Only DRAFT prompts can be submitted for review. Current: ${this.props.status}`);
    }
    const now = new Date();
    this.props.status = PromptStatus.REVIEW;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new PromptSubmittedForReviewEvent(this.getId().getValue(), this.getTenantId(), submittedBy, now)
    );
  }

  public approve(approvedBy: string): void {
    if (this.props.status !== PromptStatus.REVIEW && this.props.status !== PromptStatus.DRAFT) {
      throw new PromptApprovalException(`Cannot approve prompt in state '${this.props.status}'`);
    }
    const now = new Date();
    this.props.status = PromptStatus.APPROVED;
    this.props.approvedBy = approvedBy;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new PromptApprovedEvent(this.getId().getValue(), this.getTenantId(), approvedBy, now)
    );
  }

  public publish(): void {
    if (this.props.status !== PromptStatus.APPROVED && this.props.status !== PromptStatus.DRAFT) {
      throw new PromptApprovalException(`Prompt must be APPROVED or DRAFT before publication. Current: ${this.props.status}`);
    }
    const now = new Date();
    this.props.status = PromptStatus.PUBLISHED;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new PromptPublishedEvent(this.getId().getValue(), this.getTenantId(), this.getVersion().getValue(), now)
    );
  }

  public evaluate(scoreNumber: number, feedback: string = ''): PromptEvaluation {
    const score = PromptScore.create(scoreNumber);
    const evalStatus = scoreNumber >= 70 ? EvaluationStatus.PASSED : EvaluationStatus.FAILED;
    const evaluation = PromptEvaluation.create(evalStatus, score, feedback);

    this.props.evaluation = evaluation;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PromptEvaluatedEvent(this.getId().getValue(), this.getTenantId(), evalStatus, scoreNumber, new Date())
    );

    return evaluation;
  }

  public renderPrompt(variables: Record<string, unknown>): PromptOutput {
    const rendered = this.props.template.render(variables);
    return PromptOutput.create(rendered, Object.keys(variables).length);
  }

  public publishNewVersion(newVersionStr: string, newTemplateText: string): PromptAggregate {
    const newVer = PromptVersion.create(newVersionStr);
    const newAggregate = PromptAggregate.create({
      tenantId: this.getTenantId(),
      name: this.getName(),
      type: this.getType(),
      version: newVer.getValue(),
      templateText: newTemplateText,
      author: this.getMetadata().author,
      description: this.getMetadata().description,
      category: this.getMetadata().category,
      tags: this.getMetadata().tags,
    });

    newAggregate.approve(this.getMetadata().author);
    newAggregate.publish();

    return newAggregate;
  }

  public rollback(targetVersionStr: string, previousTemplateText: string): PromptAggregate {
    return this.publishNewVersion(targetVersionStr, previousTemplateText);
  }
}
