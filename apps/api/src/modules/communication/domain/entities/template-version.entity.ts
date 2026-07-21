import { Entity } from '@saas/core';
import { NotificationSubject } from '../value-objects/notification-subject.value-object';
import { NotificationBody } from '../value-objects/notification-body.value-object';
import { NotificationLanguage } from '../value-objects/notification-language.value-object';

export interface TemplateVersionProps {
  versionNumber: number;
  language: NotificationLanguage;
  subject: NotificationSubject;
  body: NotificationBody;
  isPublished: boolean;
  publishedAt?: Date;
}

export class TemplateVersion extends Entity<TemplateVersionProps> {
  private constructor(id: string, props: TemplateVersionProps) {
    super(id, props);
  }

  public static create(
    id: string,
    versionNumber: number,
    language: NotificationLanguage,
    subject: NotificationSubject,
    body: NotificationBody
  ): TemplateVersion {
    if (versionNumber <= 0) {
      throw new Error('Version number must be positive');
    }
    return new TemplateVersion(id, {
      versionNumber,
      language,
      subject,
      body,
      isPublished: false,
    });
  }

  get versionNumber(): number { return this.props.versionNumber; }
  get language(): NotificationLanguage { return this.props.language; }
  get subject(): NotificationSubject { return this.props.subject; }
  get body(): NotificationBody { return this.props.body; }
  get isPublished(): boolean { return this.props.isPublished; }
  get publishedAt(): Date | undefined { return this.props.publishedAt; }

  public publish(): void {
    if (this.props.isPublished) {
      throw new Error('This template version is already published');
    }
    this.props.isPublished = true;
    this.props.publishedAt = new Date();
  }
}
