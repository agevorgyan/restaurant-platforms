/**
 * Enterprise Authentication Experience Platform - Value Objects
 *
 * Immutable Value Objects encapsulating login requests, session context, user identity,
 * organization context, route protection rules, auth states, session expiration, and device sessions.
 */

import { AuthenticationStatus, SessionStatus } from '../enums/auth-experience.enums';

/**
 * LoginRequest Value Object
 */
export class LoginRequest {
  public readonly email: string;
  public readonly password?: string;
  public readonly mfaCode?: string;
  public readonly rememberDevice: boolean;

  private constructor(email: string, password?: string, mfaCode?: string, rememberDevice: boolean = false) {
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required for login');
    }
    this.email = email.trim().toLowerCase();
    this.password = password;
    this.mfaCode = mfaCode;
    this.rememberDevice = rememberDevice;
  }

  public static create(props: {
    email: string;
    password?: string;
    mfaCode?: string;
    rememberDevice?: boolean;
  }): LoginRequest {
    return new LoginRequest(props.email, props.password, props.mfaCode, props.rememberDevice);
  }
}

/**
 * UserIdentity Value Object
 */
export class UserIdentity {
  public readonly userId: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly avatarUrl?: string;

  private constructor(userId: string, email: string, fullName: string, avatarUrl?: string) {
    this.userId = userId;
    this.email = email;
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
  }

  public static create(props: {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  }): UserIdentity {
    return new UserIdentity(props.userId, props.email, props.fullName, props.avatarUrl);
  }
}

/**
 * OrganizationContext Value Object
 */
export class OrganizationContext {
  public readonly orgId: string;
  public readonly orgName: string;
  public readonly orgSlug: string;
  public readonly roles: string[];
  public readonly permissions: string[];

  private constructor(orgId: string, orgName: string, orgSlug: string, roles: string[], permissions: string[]) {
    this.orgId = orgId;
    this.orgName = orgName;
    this.orgSlug = orgSlug;
    this.roles = roles;
    this.permissions = permissions;
  }

  public static create(props: {
    orgId: string;
    orgName: string;
    orgSlug: string;
    roles?: string[];
    permissions?: string[];
  }): OrganizationContext {
    return new OrganizationContext(
      props.orgId,
      props.orgName,
      props.orgSlug,
      props.roles || ['ROLE_USER'],
      props.permissions || ['read:dashboard']
    );
  }
}

/**
 * SessionExpiration Value Object
 */
export class SessionExpiration {
  public readonly expiresAt: Date;
  public readonly warningWindowMs: number;

  private constructor(expiresAt: Date, warningWindowMs: number = 300000) {
    this.expiresAt = expiresAt;
    this.warningWindowMs = warningWindowMs;
  }

  public static create(expiresAt: Date, warningWindowMs?: number): SessionExpiration {
    return new SessionExpiration(expiresAt, warningWindowMs);
  }

  public get isExpired(): boolean {
    return Date.now() >= this.expiresAt.getTime();
  }

  public get isWarningActive(): boolean {
    return Date.now() >= this.expiresAt.getTime() - this.warningWindowMs;
  }
}

/**
 * DeviceSession Value Object
 */
export class DeviceSession {
  public readonly deviceId: string;
  public readonly deviceName: string;
  public readonly ipAddress: string;
  public readonly userAgent: string;
  public readonly lastActiveAt: Date;

  private constructor(deviceId: string, deviceName: string, ipAddress: string, userAgent: string, lastActiveAt: Date) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.lastActiveAt = lastActiveAt;
  }

  public static create(props: {
    deviceId: string;
    deviceName: string;
    ipAddress?: string;
    userAgent?: string;
    lastActiveAt?: Date;
  }): DeviceSession {
    return new DeviceSession(
      props.deviceId,
      props.deviceName,
      props.ipAddress || '127.0.0.1',
      props.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      props.lastActiveAt || new Date()
    );
  }
}

/**
 * SessionContext Value Object (Cookie-based session context)
 */
export class SessionContext {
  public readonly sessionId: string;
  public readonly user: UserIdentity;
  public readonly currentOrg: OrganizationContext;
  public readonly status: SessionStatus;
  public readonly expiration: SessionExpiration;
  public readonly device: DeviceSession;

  private constructor(props: {
    sessionId: string;
    user: UserIdentity;
    currentOrg: OrganizationContext;
    status: SessionStatus;
    expiration: SessionExpiration;
    device: DeviceSession;
  }) {
    this.sessionId = props.sessionId;
    this.user = props.user;
    this.currentOrg = props.currentOrg;
    this.status = props.status;
    this.expiration = props.expiration;
    this.device = props.device;
  }

  public static create(props: {
    sessionId: string;
    user: UserIdentity;
    currentOrg: OrganizationContext;
    status?: SessionStatus;
    expiration?: SessionExpiration;
    device?: DeviceSession;
  }): SessionContext {
    const exp = props.expiration || SessionExpiration.create(new Date(Date.now() + 8 * 60 * 60 * 1000));
    const dev = props.device || DeviceSession.create({ deviceId: 'dev-1', deviceName: 'MacBook Pro' });
    return new SessionContext({
      sessionId: props.sessionId,
      user: props.user,
      currentOrg: props.currentOrg,
      status: props.status || SessionStatus.ACTIVE,
      expiration: exp,
      device: dev,
    });
  }
}

/**
 * RouteProtection Value Object
 */
export class RouteProtection {
  public readonly path: string;
  public readonly requiresAuthentication: boolean;
  public readonly requiredRoles: string[];
  public readonly redirectPath: string;

  private constructor(path: string, requiresAuth: boolean = true, requiredRoles: string[] = [], redirectPath: string = '/auth/login') {
    this.path = path;
    this.requiresAuthentication = requiresAuth;
    this.requiredRoles = requiredRoles;
    this.redirectPath = redirectPath;
  }

  public static create(props: {
    path: string;
    requiresAuthentication?: boolean;
    requiredRoles?: string[];
    redirectPath?: string;
  }): RouteProtection {
    return new RouteProtection(props.path, props.requiresAuthentication, props.requiredRoles, props.redirectPath);
  }
}

/**
 * AuthenticationState Value Object
 */
export class AuthenticationState {
  public readonly status: AuthenticationStatus;
  public readonly session?: SessionContext;
  public readonly errorMessage?: string;

  private constructor(status: AuthenticationStatus, session?: SessionContext, errorMessage?: string) {
    this.status = status;
    this.session = session;
    this.errorMessage = errorMessage;
  }

  public static anonymous(): AuthenticationState {
    return new AuthenticationState(AuthenticationStatus.ANONYMOUS);
  }

  public static authenticated(session: SessionContext): AuthenticationState {
    return new AuthenticationState(AuthenticationStatus.AUTHENTICATED, session);
  }

  public static error(message: string): AuthenticationState {
    return new AuthenticationState(AuthenticationStatus.ANONYMOUS, undefined, message);
  }
}
