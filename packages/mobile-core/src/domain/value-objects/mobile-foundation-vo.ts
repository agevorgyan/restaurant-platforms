/**
 * Enterprise Mobile Foundation Platform - Value Objects
 *
 * Immutable Value Objects encapsulating mobile device metadata, application versioning,
 * environment configs, hardware capabilities, app lifecycle states, deep links, and mobile sessions.
 */

import { AppState, DeviceType } from '../enums/mobile-foundation.enums';

/**
 * MobileDeviceInfo Value Object
 */
export class MobileDeviceInfo {
  public readonly deviceId: string;
  public readonly deviceType: DeviceType;
  public readonly osName: 'iOS' | 'Android' | 'WebMobile';
  public readonly osVersion: string;
  public readonly modelName: string;

  private constructor(deviceId: string, deviceType: DeviceType, osName: 'iOS' | 'Android' | 'WebMobile', osVersion: string, modelName: string) {
    this.deviceId = deviceId;
    this.deviceType = deviceType;
    this.osName = osName;
    this.osVersion = osVersion;
    this.modelName = modelName;
  }

  public static create(props: {
    deviceId?: string;
    deviceType?: DeviceType;
    osName?: 'iOS' | 'Android' | 'WebMobile';
    osVersion?: string;
    modelName?: string;
  } = {}): MobileDeviceInfo {
    return new MobileDeviceInfo(
      props.deviceId || `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      props.deviceType || DeviceType.PHONE,
      props.osName || 'iOS',
      props.osVersion || '17.2',
      props.modelName || 'iPhone 15 Pro'
    );
  }
}

/**
 * MobileAppInfo Value Object
 */
export class MobileAppInfo {
  public readonly appId: string;
  public readonly appName: string;
  public readonly version: string;
  public readonly buildNumber: string;

  private constructor(appId: string, appName: string, version: string, buildNumber: string) {
    this.appId = appId;
    this.appName = appName;
    this.version = version;
    this.buildNumber = buildNumber;
  }

  public static create(props: {
    appId?: string;
    appName?: string;
    version?: string;
    buildNumber?: string;
  } = {}): MobileAppInfo {
    return new MobileAppInfo(
      props.appId || 'com.gourmet.restaurant.mobile',
      props.appName || 'Gourmet ERP Mobile',
      props.version || '1.0.0',
      props.buildNumber || '104'
    );
  }
}

/**
 * MobileEnvironment Value Object
 */
export class MobileEnvironment {
  public readonly envName: 'Development' | 'Staging' | 'Production';
  public readonly apiBaseUrl: string;
  public readonly isDebug: boolean;

  private constructor(envName: 'Development' | 'Staging' | 'Production', apiBaseUrl: string, isDebug: boolean) {
    this.envName = envName;
    this.apiBaseUrl = apiBaseUrl;
    this.isDebug = isDebug;
  }

  public static create(props: {
    envName?: 'Development' | 'Staging' | 'Production';
    apiBaseUrl?: string;
    isDebug?: boolean;
  } = {}): MobileEnvironment {
    return new MobileEnvironment(
      props.envName || 'Production',
      props.apiBaseUrl || 'https://api.gourmet-erp.com',
      props.isDebug ?? false
    );
  }
}

/**
 * HardwareCapability Value Object
 */
export class HardwareCapability {
  public readonly name: string;
  public readonly isAvailable: boolean;
  public readonly isGranted: boolean;

  private constructor(name: string, isAvailable: boolean, isGranted: boolean) {
    this.name = name;
    this.isAvailable = isAvailable;
    this.isGranted = isGranted;
  }

  public static create(name: string, isAvailable: boolean = true, isGranted: boolean = true): HardwareCapability {
    return new HardwareCapability(name, isAvailable, isGranted);
  }
}

/**
 * DeviceCapabilities Value Object
 */
export class DeviceCapabilities {
  public readonly camera: HardwareCapability;
  public readonly bluetooth: HardwareCapability;
  public readonly biometrics: HardwareCapability;
  public readonly location: HardwareCapability;
  public readonly notifications: HardwareCapability;

  private constructor(props: {
    camera: HardwareCapability;
    bluetooth: HardwareCapability;
    biometrics: HardwareCapability;
    location: HardwareCapability;
    notifications: HardwareCapability;
  }) {
    this.camera = props.camera;
    this.bluetooth = props.bluetooth;
    this.biometrics = props.biometrics;
    this.location = props.location;
    this.notifications = props.notifications;
  }

  public static create(props: {
    camera?: HardwareCapability;
    bluetooth?: HardwareCapability;
    biometrics?: HardwareCapability;
    location?: HardwareCapability;
    notifications?: HardwareCapability;
  } = {}): DeviceCapabilities {
    return new DeviceCapabilities({
      camera: props.camera || HardwareCapability.create('Camera'),
      bluetooth: props.bluetooth || HardwareCapability.create('Bluetooth'),
      biometrics: props.biometrics || HardwareCapability.create('Biometrics'),
      location: props.location || HardwareCapability.create('Location'),
      notifications: props.notifications || HardwareCapability.create('Notifications'),
    });
  }
}

/**
 * AppLifecycleState Value Object
 */
export class AppLifecycleState {
  public readonly state: AppState;
  public readonly changedAt: Date;

  private constructor(state: AppState) {
    this.state = state;
    this.changedAt = new Date();
  }

  public static create(state: AppState): AppLifecycleState {
    return new AppLifecycleState(state);
  }
}

/**
 * DeepLink Value Object
 */
export class DeepLink {
  public readonly rawUrl: string;
  public readonly scheme: string;
  public readonly hostname: string;
  public readonly path: string;
  public readonly queryParams: Record<string, string>;

  private constructor(rawUrl: string, scheme: string, hostname: string, path: string, queryParams: Record<string, string>) {
    this.rawUrl = rawUrl;
    this.scheme = scheme;
    this.hostname = hostname;
    this.path = path;
    this.queryParams = queryParams;
  }

  public static parse(url: string): DeepLink {
    if (!url || !url.includes('://')) {
      throw new Error('Invalid deep link URL format');
    }
    const [scheme, rest] = url.split('://');
    const [hostAndPath, queryStr] = rest.split('?');
    const parts = hostAndPath.split('/');
    const hostname = parts[0];
    const path = '/' + parts.slice(1).join('/');

    const queryParams: Record<string, string> = {};
    if (queryStr) {
      queryStr.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        if (k) queryParams[k] = decodeURIComponent(v || '');
      });
    }

    return new DeepLink(url, scheme, hostname, path, queryParams);
  }
}

/**
 * MobileSession Value Object
 */
export class MobileSession {
  public readonly sessionId: string;
  public readonly userId: string;
  public readonly tenantId: string;
  public readonly startedAt: Date;

  private constructor(sessionId: string, userId: string, tenantId: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.tenantId = tenantId;
    this.startedAt = new Date();
  }

  public static create(props: { sessionId?: string; userId: string; tenantId: string }): MobileSession {
    return new MobileSession(
      props.sessionId || `mob-sess-${Date.now()}`,
      props.userId,
      props.tenantId
    );
  }
}
