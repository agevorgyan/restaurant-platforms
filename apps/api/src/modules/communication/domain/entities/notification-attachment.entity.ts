import { Entity } from '@saas/core';

export interface NotificationAttachmentProps {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeInBytes: number;
}

export class NotificationAttachment extends Entity<NotificationAttachmentProps> {
  private constructor(id: string, props: NotificationAttachmentProps) {
    super(id, props);
  }

  public static create(id: string, props: NotificationAttachmentProps): NotificationAttachment {
    if (!props.fileName || !props.fileUrl || !props.mimeType) {
      throw new Error('Attachment must have a valid file name, url, and mime type');
    }
    if (props.sizeInBytes <= 0) {
      throw new Error('Attachment size must be strictly positive');
    }
    return new NotificationAttachment(id, props);
  }
}
