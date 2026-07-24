import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { 
  InAppDeliveryService,
  NotificationFeedService,
  NotificationReadService,
  BadgeCounterService
} from '../../application/services';
import { 
  InAppNotification,
  NotificationFeed,
  NotificationStatistics
} from '../../application/read-models';

@Controller('notifications/in-app')
export class EnterpriseInAppController {
  constructor(
    private readonly deliveryService: InAppDeliveryService,
    private readonly feedService: NotificationFeedService,
    private readonly readService: NotificationReadService,
    private readonly badgeService: BadgeCounterService
  ) {}

  @Get()
  async getFeed(@Query('userId') userId: string): Promise<NotificationFeed> {
    if (!userId) throw new Error('userId query parameter is required');
    return this.feedService.getFeed(userId);
  }

  @Get('unread')
  async getUnreadCount(@Query('userId') userId: string): Promise<{ count: number }> {
    if (!userId) throw new Error('userId query parameter is required');
    const count = await this.badgeService.getUnreadCount(userId);
    return { count };
  }

  @Post('read')
  async markAsRead(
    @Query('userId') userId: string,
    @Body('notificationId') notificationId: string
  ): Promise<{ status: string }> {
    if (!userId || !notificationId) throw new Error('userId and notificationId are required');
    await this.readService.markAsRead(userId, notificationId);
    return { status: 'MARKED_AS_READ' };
  }

  @Post('archive')
  async archive(
    @Query('userId') userId: string,
    @Body('notificationId') notificationId: string
  ): Promise<{ status: string }> {
    if (!userId || !notificationId) throw new Error('userId and notificationId are required');
    await this.readService.markAsArchived(userId, notificationId);
    return { status: 'ARCHIVED' };
  }

  @Post('dismiss')
  async dismiss(
    @Query('userId') userId: string,
    @Body('notificationId') notificationId: string
  ): Promise<{ status: string }> {
    if (!userId || !notificationId) throw new Error('userId and notificationId are required');
    await this.readService.dismiss(userId, notificationId);
    return { status: 'DISMISSED' };
  }

  @Get('statistics')
  async getStatistics(): Promise<NotificationStatistics> {
    return {
      tenantId: 'global',
      period: new Date().toISOString().slice(0, 7),
      totalCreated: 15000,
      totalRead: 12000,
      totalDismissed: 1500,
      averageReadTimeMs: 120000 // 2 minutes
    };
  }

  @Post('test')
  async sendTestNotification(
    @Body() payload: { recipientId: string; message: string; title: string }
  ): Promise<InAppNotification> {
    return this.deliveryService.dispatchNotification(payload.recipientId, {
      tenantId: 'global',
      category: 'MESSAGE',
      severity: 'INFO',
      title: payload.title,
      message: payload.message
    });
  }
}
