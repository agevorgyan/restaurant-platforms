import { AggregateRoot } from '@saas/core';
import { NotificationTemplateId } from '../value-objects/notification-template-id.value-object';
import { NotificationCategory } from '../value-objects/notification-category.value-object';
import { NotificationStatus, NotificationTemplateStatusEnum } from '../value-objects/notification-status.value-object';
import { NotificationLanguage } from '../value-objects/notification-language.value-object';
import { TemplateVersion } from '../entities/template-version.entity';
import { TemplateVariable } from '../entities/template-variable.entity';
import {
  NotificationTemplateCreated,
  NotificationTemplatePublished,
  NotificationTemplateArchived,
} from '../events/communication-events';

export interface NotificationTemplateProps {
  id: NotificationTemplateId;
  name: string;
  category: NotificationCategory;
  defaultLanguage: NotificationLanguage;
  status: NotificationStatus;
  versions: TemplateVersion[];
  variables: TemplateVariable[];
}

export class NotificationTemplate extends AggregateRoot<NotificationTemplateProps> {
  private constructor(props: NotificationTemplateProps) {
    super(props.id.value, props);
  }

  public static create(
    id: NotificationTemplateId,
    name: string,
    category: NotificationCategory,
    defaultLanguage: NotificationLanguage
  ): NotificationTemplate {
    if (!name || name.trim().length === 0) {
      throw new Error('Template name cannot be empty');
    }

    const template = new NotificationTemplate({
      id,
      name,
      category,
      defaultLanguage,
      status: NotificationStatus.initial(),
      versions: [],
      variables: [],
    });

    template.addDomainEvent(new NotificationTemplateCreated(id.value, name));

    return template;
  }

  get templateId(): NotificationTemplateId { return this.props.id; }
  get name(): string { return this.props.name; }
  get category(): NotificationCategory { return this.props.category; }
  get defaultLanguage(): NotificationLanguage { return this.props.defaultLanguage; }
  get status(): NotificationStatus { return this.props.status; }
  get versions(): TemplateVersion[] { return [...this.props.versions]; }
  get variables(): TemplateVariable[] { return [...this.props.variables]; }

  public addVariable(variable: TemplateVariable): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify variables of an archived template');
    }
    if (this.props.variables.some(v => v.name === variable.name)) {
      throw new Error(`Variable ${variable.name} already exists in this template`);
    }
    this.props.variables.push(variable);
  }

  public addVersion(version: TemplateVersion): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot add versions to an archived template');
    }
    if (this.props.versions.some(v => v.versionNumber === version.versionNumber && v.language.code === version.language.code)) {
      throw new Error(`Version ${version.versionNumber} for language ${version.language.code} already exists`);
    }

    // Validate that the version body contains the required placeholders
    this.validatePlaceholders(version.body.value);

    this.props.versions.push(version);
  }

  public publishVersion(versionId: string): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot publish versions of an archived template');
    }
    
    const version = this.props.versions.find(v => v.id === versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    version.publish();
    
    if (this.props.status.isDraft()) {
      this.props.status = NotificationStatus.create(NotificationTemplateStatusEnum.PUBLISHED);
    }
    
    this.addDomainEvent(new NotificationTemplatePublished(this.id, version.id));
  }

  public archive(): void {
    if (this.props.status.isArchived()) return;
    
    this.props.status = NotificationStatus.create(NotificationTemplateStatusEnum.ARCHIVED);
    this.addDomainEvent(new NotificationTemplateArchived(this.id));
  }

  private validatePlaceholders(bodyText: string): void {
    // Expected placeholder syntax is {{VariableName}}
    for (const variable of this.props.variables) {
      if (variable.isRequired) {
        const placeholder = `{{${variable.name}}}`;
        if (!bodyText.includes(placeholder)) {
          throw new Error(`Template body is missing required placeholder: ${placeholder}`);
        }
      }
    }
  }
}
