/**
 * Enterprise Mobile Foundation Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Device Type Detection, React Native App Lifecycle Transitions,
 * Universal Deep Link Parsing, Native Hardware Abstraction (Camera, Biometrics, Bluetooth), and CQRS Read Models.
 */

import { AppState, DeviceType } from '../src/domain/enums/mobile-foundation.enums';
import {
  DeepLink,
  DeviceCapabilities,
  MobileAppInfo,
  MobileDeviceInfo,
  MobileEnvironment,
  MobileSession,
} from '../src/domain/value-objects/mobile-foundation-vo';
import {
  CapabilityService,
  DeepLinkService,
  DeviceService,
  EnterpriseMobileFoundationPlatformService,
  LifecycleService,
  MobileRuntimeService,
  NavigationService,
} from '../src/services/mobile-foundation.services';

describe('Enterprise Mobile Foundation Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format MobileDeviceInfo correctly', () => {
      const dev = MobileDeviceInfo.create({ deviceType: DeviceType.HANDHELD_POS, osName: 'Android' });
      expect(dev.deviceType).toBe(DeviceType.HANDHELD_POS);
      expect(dev.osName).toBe('Android');
    });

    it('should parse deep link URLs correctly', () => {
      const link = DeepLink.parse('restaurant-erp://orders/104?tenant=bistro-1');
      expect(link.scheme).toBe('restaurant-erp');
      expect(link.hostname).toBe('orders');
      expect(link.path).toBe('/104');
      expect(link.queryParams['tenant']).toBe('bistro-1');

      expect(() => DeepLink.parse('invalid-url')).toThrow();
    });

    it('should initialize MobileSession with mandatory tenant and user context', () => {
      const sess = MobileSession.create({ userId: 'usr-waiter-1', tenantId: 'tenant-pizza' });
      expect(sess.userId).toBe('usr-waiter-1');
      expect(sess.tenantId).toBe('tenant-pizza');
    });
  });

  describe('Device & Lifecycle Services', () => {
    let deviceService: DeviceService;
    let lifecycleService: LifecycleService;

    beforeEach(() => {
      deviceService = new DeviceService();
      lifecycleService = new LifecycleService();
    });

    it('should retrieve current device info and device catalog', () => {
      const info = deviceService.getDeviceInfo();
      expect(info.osName).toBe('iOS');

      const catalog = deviceService.getDeviceCatalog();
      expect(catalog.totalDevicesRegistered).toBe(1);
    });

    it('should track React Native app state transitions', () => {
      expect(lifecycleService.getCurrentState().state).toBe(AppState.FOREGROUND);

      lifecycleService.setAppState(AppState.BACKGROUND);
      expect(lifecycleService.getCurrentState().state).toBe(AppState.BACKGROUND);

      const history = lifecycleService.getLifecycleHistory();
      expect(history.totalStateTransitionsCount).toBe(2);
    });
  });

  describe('DeepLink & Hardware Capability Services', () => {
    let deepLinkService: DeepLinkService;
    let capabilityService: CapabilityService;

    beforeEach(() => {
      deepLinkService = new DeepLinkService();
      capabilityService = new CapabilityService();
    });

    it('should resolve universal deep links via DeepLinkService', () => {
      const resolved = deepLinkService.parseAndResolve('restaurant-erp://tables/12');
      expect(resolved.hostname).toBe('tables');
      expect(resolved.path).toBe('/12');
    });

    it('should query native hardware capabilities and permission status', () => {
      const caps = capabilityService.getCapabilities();
      expect(caps.camera.isAvailable).toBe(true);

      const perm = capabilityService.getPermissionStatus();
      expect(perm.cameraPermission).toBe('granted');
      expect(perm.biometricsPermission).toBe('granted');
    });
  });

  describe('EnterpriseMobileFoundationPlatformService & Read Models', () => {
    let runtimeService: MobileRuntimeService;
    let deviceService: DeviceService;
    let lifecycleService: LifecycleService;
    let navigationService: NavigationService;
    let deepLinkService: DeepLinkService;
    let capabilityService: CapabilityService;
    let platformService: EnterpriseMobileFoundationPlatformService;

    beforeEach(() => {
      runtimeService = new MobileRuntimeService();
      deviceService = new DeviceService();
      lifecycleService = new LifecycleService();
      navigationService = new NavigationService();
      deepLinkService = new DeepLinkService();
      capabilityService = new CapabilityService();

      platformService = new EnterpriseMobileFoundationPlatformService(
        runtimeService,
        deviceService,
        lifecycleService,
        navigationService,
        deepLinkService,
        capabilityService
      );
    });

    it('should query Mobile Runtime metadata and Capability Catalog read model', () => {
      const appInfo = runtimeService.getAppInfo();
      expect(appInfo.appName).toContain('Gourmet ERP Mobile');

      const capCatalog = capabilityService.getCapabilityCatalog();
      expect(capCatalog.totalCapabilitiesCount).toBe(5);
    });
  });
});
