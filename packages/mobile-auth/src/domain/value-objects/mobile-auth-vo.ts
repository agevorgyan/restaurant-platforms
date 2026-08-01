/**
 * Enterprise Mobile Authentication Platform - Value Objects
 *
 * Immutable Value Objects encapsulating mobile sessions, biometric hardware capabilities,
 * trusted device footprints, encrypted credentials, device identities, auth contexts, organization contexts, and session expirations.
 */

import { AuthenticationStatus, BiometricType } from '../enums/mobile-auth.enums';

/**
 * BiometricCapability Value Object
 */
export class BiometricCapability {
  public readonly type: BiometricType;
  public readonly isEnrolled: boolean;

  private constructor(type: BiometricType, isEnrolled: boolean) {
    this.type = type;
    this.isEnrolled = isEnrolled;
  }

  public static create(type: BiometricType = BiometricType.FACE_ID, isEnrolled: boolean = true): BiometricCapability {
    return new BiometricCapability(type, isEnrolled);
  }
}

/**
 * DeviceIdentity Value Object
 */
export class DeviceIdentity {
  public readonly deviceId: string;
  public readonly deviceName: string;
  public readonly platform: 'iOS' | 'Android';

  private constructor(deviceId: string, deviceName: string, platform: 'iOS' | 'Android') {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.platform = platform;
  }

  public static create(props: { deviceId?: string; deviceName?: string; platform?: 'iOS' | 'Android' } = {}): DeviceIdentity {
    return new DeviceIdentity(
      props.deviceId || `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      props.deviceName || 'iPhone 15 Pro',
      props.platform || 'iOS'
    );
  }
}

/**
 * TrustedDevice Value Object
 */
export class TrustedDevice {
  public readonly identity: DeviceIdentity;
  public readonly isTrusted: boolean;
  public readonly registeredAt: Date;
  public readonly trustScore: number; // 0..100

  private constructor(identity: DeviceIdentity, isTrusted: boolean, registeredAt: Date, trustScore: number) {
    this.identity = identity;
    this.isTrusted = isTrusted;
    this.registeredAt = registeredAt;
    this.trustScore = trustScore;
  }

  public static create(identity: DeviceIdentity, isTrusted: boolean = true, trustScore: number = 95): TrustedDevice {
    return new TrustedDevice(identity, isTrusted, new Date(), trustScore);
  }
}

/**
 * SecureCredential Value Object (Expo Secure Store wrapper)
 */
export class SecureCredential {
  public readonly refreshToken: string;
  public readonly deviceToken: string;

  private constructor(refreshToken: string, deviceToken: string) {
    this.refreshToken = refreshToken;
    this.deviceToken = deviceToken;
  }

  public static create(refreshToken: string, deviceToken: string): SecureCredential {
    return new SecureCredential(refreshToken, deviceToken);
  }
}

/**
 * OrganizationContext Value Object
 */
export class OrganizationContext {
  public readonly orgId: string;
  public readonly orgName: string;
  public readonly roles: string[];

  private constructor(orgId: string, orgName: string, roles: string[]) {
    this.orgId = orgId;
    this.orgName = orgName;
    this.roles = roles;
  }

  public static create(props: { orgId?: string; orgName?: string; roles?: string[] } = {}): OrganizationContext {
    return new OrganizationContext(
      props.orgId || 'org-main-1',
      props.orgName || 'Main Restaurant Enterprise',
      props.roles || ['ROLE_MANAGER']
    );
  }
}

/**
 * SessionExpiration Value Object
 */
export class SessionExpiration {
  public readonly expiresAt: Date;
  public readonly maxOfflineExtensionMs: number;

  private constructor(expiresAt: Date, maxOfflineExtensionMs: number = 24 * 60 * 60 * 1000) {
    this.expiresAt = expiresAt;
    this.maxOfflineExtensionMs = maxOfflineExtensionMs;
  }

  public static create(expiresAt?: Date, maxOfflineExtensionMs?: number): SessionExpiration {
    return new SessionExpiration(expiresAt || new Date(Date.now() + 8 * 60 * 60 * 1000), maxOfflineExtensionMs);
  }

  public get isExpired(): boolean {
    return Date.now() >= this.expiresAt.getTime();
  }
}

/**
 * MobileSession Value Object
 */
export class MobileSession {
  public readonly sessionId: string;
  public readonly userId: string;
  public readonly tenantId: string;
  public readonly currentOrg: OrganizationContext;
  public readonly expiration: SessionExpiration;
  public readonly isBiometricLocked: boolean;

  private constructor(props: {
    sessionId: string;
    userId: string;
    tenantId: string;
    currentOrg: OrganizationContext;
    expiration: SessionExpiration;
    isBiometricLocked: boolean;
  }) {
    this.sessionId = props.sessionId;
    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.currentOrg = props.currentOrg;
    this.expiration = props.expiration;
    this.isBiometricLocked = props.isBiometricLocked;
  }

  public static create(props: {
    sessionId?: string;
    userId: string;
    tenantId: string;
    currentOrg?: OrganizationContext;
    expiration?: SessionExpiration;
    isBiometricLocked?: boolean;
  }): MobileSession {
    return new MobileSession({
      sessionId: props.sessionId || `mob-sess-${Date.now()}`,
      userId: props.userId,
      tenantId: props.tenantId,
      currentOrg: props.currentOrg || OrganizationContext.create(),
      expiration: props.expiration || SessionExpiration.create(),
      isBiometricLocked: props.isBiometricLocked ?? false,
    });
  }
}

/**
 * AuthenticationContext Value Object
 */
export class AuthenticationContext {
  public readonly status: AuthenticationStatus;
  public readonly session?: MobileSession;
  public readonly trustedDevice?: TrustedDevice;

  private constructor(status: AuthenticationStatus, session?: MobileSession, trustedDevice?: TrustedDevice) {
    this.status = status;
    this.session = session;
    this.trustedDevice = trustedDevice;
  }

  public static anonymous(): AuthenticationContext {
    return new AuthenticationContext(AuthenticationStatus.ANONYMOUS);
  }

  public static authenticated(session: MobileSession, trustedDevice?: TrustedDevice): AuthenticationContext {
    return new AuthenticationContext(AuthenticationStatus.AUTHENTICATED, session, trustedDevice);
  }

  public static biometricRequired(session: MobileSession): AuthenticationContext {
    return new AuthenticationContext(AuthenticationStatus.BIOMETRIC_REQUIRED, session);
  }
}
