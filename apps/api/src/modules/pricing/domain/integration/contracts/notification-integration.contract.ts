export interface NotificationIntegrationContract {
  // Provided to Notification Bounded Context
  recipientId: string;
  templateId: string;
  payload: Record<string, any>;
}
