/**
 * Enterprise Mobile Push Notification Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Push Token Registration (Expo, APNs, FCM), Notification Presentation,
 * Deep Link Action Routing, App Icon Badge Synchronization, and CQRS Read Models.
 */

import { NotificationPriority, NotificationStatus } from '../src/domain/enums/mobile-notifications.enums';
import {
  DeepLinkTarget,
  NotificationCategory,
  NotificationPayload,
  PushToken,
} from '../src/domain/value-objects/mobile-notifications-vo';
import {
  BackgroundNotificationService,
  BadgeService,
  DeepLinkService,
  EnterpriseMobileNotificationsPlatformService,
  NotificationPreferenceService,
  NotificationService,
  PushRegistrationService,
} from '../src/services/mobile-notifications.services';

describe('Enterprise Mobile Push Notification Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format PushToken correctly', () => {
      const token = PushToken.create('ExponentPushToken[xxxxxx]', 'Expo');
      expect(token.token).toBe('ExponentPushToken[xxxxxx]');
      expect(token.provider).toBe('Expo');
    });

    it('should format NotificationPayload with DeepLinkTarget correctly', () => {
      const target = DeepLinkTarget.create('restaurant-erp://orders/104');
      const payload = NotificationPayload.create({
        title: 'New Order Received',
        body: 'Table 4 placed an order for $65.00',
        priority: NotificationPriority.HIGH,
        deepLink: target,
      });

      expect(payload.title).toBe('New Order Received');
      expect(payload.deepLink?.url).toBe('restaurant-erp://orders/104');
    });
  });

  describe('PushRegistrationService & NotificationService', () => {
    let registrationService: PushRegistrationService;
    let notificationService: NotificationService;

    beforeEach(() => {
      registrationService = new PushRegistrationService();
      notificationService = new NotificationService();
    });

    it('should register push tokens and track registered device catalog', () => {
      registrationService.registerPushToken('ExponentPushToken[abc12345]', 'Expo');
      registrationService.registerPushToken('apns-device-token-67890', 'APNs');

      const readModel = registrationService.getRegisteredDevices();
      expect(readModel.totalRegisteredDevicesCount).toBe(2);
    });

    it('should present notification and update delivery statistics on open', () => {
      const payload = NotificationPayload.create({
        title: 'Kitchen Order Bumped',
        body: 'Ticket #42 was completed by Chef John',
      });

      const receipt = notificationService.presentNotification(payload);
      expect(receipt.status).toBe(NotificationStatus.DELIVERED);

      notificationService.openNotification(payload.notificationId);

      const stats = notificationService.getDeliveryStatistics();
      expect(stats.totalDelivered).toBe(1);
      expect(stats.totalOpened).toBe(1);
      expect(stats.openRatePercentage).toBe(100);
    });
  });

  describe('BadgeService & DeepLinkService', () => {
    let badgeService: BadgeService;
    let deepLinkService: DeepLinkService;

    beforeEach(() => {
      badgeService = new BadgeService();
      deepLinkService = new DeepLinkService();
    });

    it('should update and query app icon badge count overview', () => {
      badgeService.setBadgeCount(5);

      const overview = badgeService.getBadgeOverview();
      expect(overview.unreadCount).toBe(5);
    });

    it('should resolve deep link target from notification payload', () => {
      const target = DeepLinkTarget.create('restaurant-erp://kds/tickets/42');
      const payload = NotificationPayload.create({
        title: 'New KDS Ticket',
        body: 'Ticket #42 created',
        deepLink: target,
      });

      const resolved = deepLinkService.resolveDeepLinkFromNotification(payload);
      expect(resolved?.url).toBe('restaurant-erp://kds/tickets/42');
    });
  });

  describe('EnterpriseMobileNotificationsPlatformService & Read Models', () => {
    let registrationService: PushRegistrationService;
    let notificationService: NotificationService;
    let preferenceService: NotificationPreferenceService;
    let deepLinkService: DeepLinkService;
    let badgeService: BadgeService;
    let backgroundService: BackgroundNotificationService;
    let platformService: EnterpriseMobileNotificationsPlatformService;

    beforeEach(() => {
      registrationService = new PushRegistrationService();
      notificationService = new NotificationService();
      preferenceService = new NotificationPreferenceService();
      deepLinkService = new DeepLinkService();
      badgeService = new BadgeService();
      backgroundService = new BackgroundNotificationService();

      platformService = new EnterpriseMobileNotificationsPlatformService(
        registrationService,
        notificationService,
        preferenceService,
        deepLinkService,
        badgeService,
        backgroundService
      );
    });

    it('should query Notification Preferences read model', () => {
      const prefs = preferenceService.getPreferences('usr-manager-1');
      expect(prefs.isPushEnabled).toBe(true);
      expect(prefs.activeChannels.length).toBe(3);
    });
  });
});
