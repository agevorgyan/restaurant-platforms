import {
  UserId,
  AuthenticationId,
  SessionId,
  TrustedDeviceId,
  IpAddress,
  DeviceFingerprint,
} from '../value-objects';

export class UserAuthenticated {
  constructor(
    public readonly userId: UserId,
    public readonly authenticationId: AuthenticationId,
    public readonly sessionId: SessionId,
    public readonly timestamp: Date,
  ) {}
}

export class AuthenticationSucceeded {
  constructor(
    public readonly authenticationId: AuthenticationId,
    public readonly userId: UserId,
    public readonly method: string,
    public readonly timestamp: Date,
  ) {}
}

export class AuthenticationFailed {
  constructor(
    public readonly reason: string,
    public readonly ipAddress: IpAddress,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly timestamp: Date,
    public readonly userId?: UserId,
  ) {}
}

export class MfaChallengeIssued {
  constructor(
    public readonly authenticationId: AuthenticationId,
    public readonly userId: UserId,
    public readonly method: string,
    public readonly timestamp: Date,
  ) {}
}

export class MfaVerified {
  constructor(
    public readonly authenticationId: AuthenticationId,
    public readonly userId: UserId,
    public readonly method: string,
    public readonly timestamp: Date,
  ) {}
}

export class SessionCreated {
  constructor(
    public readonly sessionId: SessionId,
    public readonly userId: UserId,
    public readonly ipAddress: IpAddress,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly timestamp: Date,
  ) {}
}

export class SessionRevoked {
  constructor(
    public readonly sessionId: SessionId,
    public readonly userId: UserId,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

export class DeviceTrusted {
  constructor(
    public readonly deviceId: TrustedDeviceId,
    public readonly userId: UserId,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly timestamp: Date,
  ) {}
}

export class PasswordChanged {
  constructor(
    public readonly userId: UserId,
    public readonly timestamp: Date,
  ) {}
}
