/**
 * Enterprise Mobile Foundation Platform - Domain Services
 *
 * Implements core domain services for mobile foundation:
 * 1. MobileRuntimeService (Shared Expo Runtime Initialization)
 * 2. DeviceService (Device Detection & Cataloging)
 * 3. LifecycleService (React Native App State Lifecycle Manager)
 * 4. NavigationService (Expo Router Native Navigation Tracking)
 * 5. DeepLinkService (Universal Link & Deep Link Route Parsing)
 * 6. CapabilityService (Native Hardware & Permission Abstraction)
 * 7. EnterpriseMobileFoundationPlatformService (Primary Application Façade)
 */

import { AppState, DeviceType } from '../domain/enums/mobile-foundation.enums';
import {
  AppLifecycleState,
  DeepLink,
  DeviceCapabilities,
  HardwareCapability,
  MobileAppInfo,
  MobileDeviceInfo,
  MobileEnvironment,
} from '../domain/value-objects/mobile-foundation-vo';
import {
  CapabilityCatalogReadModel,
  DeviceCatalogReadModel,
  LifecycleHistoryReadModel,
  NavigationHistoryReadModel,
  PermissionStatusReadModel,
} from '../read-models/mobile-foundation.read-models';

/**
 * Service 1: MobileRuntimeService
 * Mobile runtime initialization, environment configuration, and app metadata.
 */
export class MobileRuntimeService {
  private readonly appInfo: MobileAppInfo = MobileAppInfo.create();
  private readonly environment: MobileEnvironment = MobileEnvironment.create();

  public getAppInfo(): MobileAppInfo {
    return this.appInfo;
  }

  public getEnvironment(): MobileEnvironment {
    return this.environment;
  }
}

/**
 * Service 2: DeviceService
 * Device detection, type classification, and device catalog.
 */
export class DeviceService {
  private readonly currentDevice: MobileDeviceInfo = MobileDeviceInfo.create();

  public getDeviceInfo(): MobileDeviceInfo {
    return this.currentDevice;
  }

  public getDeviceCatalog(): DeviceCatalogReadModel {
    return {
      totalDevicesRegistered: 1,
      devices: [
        {
          deviceId: this.currentDevice.deviceId,
          deviceType: this.currentDevice.deviceType,
          osName: this.currentDevice.osName,
          osVersion: this.currentDevice.osVersion,
          modelName: this.currentDevice.modelName,
        },
      ],
    };
  }
}

/**
 * Service 3: LifecycleService
 * React Native application state transition tracker.
 */
export class LifecycleService {
  private currentState: AppLifecycleState = AppLifecycleState.create(AppState.FOREGROUND);
  private readonly lifecycleLog: AppLifecycleState[] = [this.currentState];

  public setAppState(state: AppState): AppLifecycleState {
    this.currentState = AppLifecycleState.create(state);
    this.lifecycleLog.unshift(this.currentState);
    return this.currentState;
  }

  public getCurrentState(): AppLifecycleState {
    return this.currentState;
  }

  public getLifecycleHistory(): LifecycleHistoryReadModel {
    return {
      totalStateTransitionsCount: this.lifecycleLog.length,
      currentState: this.currentState.state,
      history: this.lifecycleLog.map((l) => ({
        state: l.state,
        timestamp: l.changedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 4: NavigationService
 * Expo Router & native stack navigation history tracking.
 */
export class NavigationService {
  private readonly historyLog: Array<{ routePath: string; timestamp: Date }> = [];

  public navigateTo(routePath: string): void {
    this.historyLog.unshift({ routePath, timestamp: new Date() });
  }

  public getNavigationHistory(): NavigationHistoryReadModel {
    return {
      totalNavigationsCount: this.historyLog.length,
      history: this.historyLog.map((h) => ({
        routePath: h.routePath,
        timestamp: h.timestamp.toISOString(),
      })),
    };
  }
}

/**
 * Service 5: DeepLinkService
 * Universal Link & Deep Link Route Parser (`restaurant-erp://...`).
 */
export class DeepLinkService {
  public parseAndResolve(url: string): DeepLink {
    return DeepLink.parse(url);
  }
}

/**
 * Service 6: CapabilityService
 * Hardware abstraction and native permission evaluator (Camera, Bluetooth, Biometrics).
 */
export class CapabilityService {
  private readonly capabilities: DeviceCapabilities = DeviceCapabilities.create();

  public getCapabilities(): DeviceCapabilities {
    return this.capabilities;
  }

  public getCapabilityCatalog(): CapabilityCatalogReadModel {
    return {
      totalCapabilitiesCount: 5,
      capabilities: [
        { name: this.capabilities.camera.name, isAvailable: this.capabilities.camera.isAvailable, isGranted: this.capabilities.camera.isGranted },
        { name: this.capabilities.bluetooth.name, isAvailable: this.capabilities.bluetooth.isAvailable, isGranted: this.capabilities.bluetooth.isGranted },
        { name: this.capabilities.biometrics.name, isAvailable: this.capabilities.biometrics.isAvailable, isGranted: this.capabilities.biometrics.isGranted },
        { name: this.capabilities.location.name, isAvailable: this.capabilities.location.isAvailable, isGranted: this.capabilities.location.isGranted },
        { name: this.capabilities.notifications.name, isAvailable: this.capabilities.notifications.isAvailable, isGranted: this.capabilities.notifications.isGranted },
      ],
    };
  }

  public getPermissionStatus(): PermissionStatusReadModel {
    return {
      cameraPermission: 'granted',
      locationPermission: 'granted',
      notificationsPermission: 'granted',
      bluetoothPermission: 'granted',
      biometricsPermission: 'granted',
    };
  }
}

/**
 * Service 7: EnterpriseMobileFoundationPlatformService
 * High-level mobile application façade for Expo & React Native infrastructure.
 */
export class EnterpriseMobileFoundationPlatformService {
  constructor(
    public readonly runtimeService: MobileRuntimeService,
    public readonly deviceService: DeviceService,
    public readonly lifecycleService: LifecycleService,
    public readonly navigationService: NavigationService,
    public readonly deepLinkService: DeepLinkService,
    public readonly capabilityService: CapabilityService
  ) {}
}
