import { NotificationTemplate } from '../aggregates/notification-template.aggregate';

export interface NotificationTemplateRepository {
  findById(id: string): Promise<NotificationTemplate | null>;
  findByName(name: string): Promise<NotificationTemplate | null>;
  save(template: NotificationTemplate): Promise<void>;
}
