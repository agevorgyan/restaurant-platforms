import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  NotificationDispatcher,
  DeliveryTrackingService,
  NotificationScheduler
} from '../../application/services';
import { 
  NotificationDefinition,
  NotificationDelivery,
  NotificationStatistics
} from '../../application/read-models';

@Controller('notifications')
export class EnterpriseNotificationController {
  constructor(
    private readonly dispatcher: NotificationDispatcher,
    private readonly tracking: DeliveryTrackingService,
    private readonly scheduler: NotificationScheduler
  ) {}

  @Get()
  async getNotifications(): Promise<NotificationDelivery[]> {
    // Mock return paginated deliveries
    return [];
  }

  @Get('statistics')
  async getStatistics(@Param('tenantId') tenantId: string): Promise<NotificationStatistics> {
    return this.tracking.getStatistics(tenantId || 'global');
  }

  @Post('send')
  async sendNotification(
    @Body() payload: NotificationDefinition
  ): Promise<NotificationDelivery[]> {
    return this.dispatcher.dispatch(payload);
  }

  @Post('schedule')
  async scheduleNotification(
    @Body() payload: { notification: NotificationDefinition; executeAt: string }
  ): Promise<{ status: string }> {
    this.scheduler.schedule(payload.notification, new Date(payload.executeAt));
    return { status: 'SCHEDULED' };
  }

  @Get(':id')
  async getNotification(@Param('id') id: string): Promise<NotificationDelivery | null> {
    // Mock fetch single delivery state
    return {
      deliveryId: id,
      notificationId: 'notif-123',
      channel: 'EMAIL',
      status: 'DELIVERED'
    };
  }
}
