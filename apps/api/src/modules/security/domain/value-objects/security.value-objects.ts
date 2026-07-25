export class IdentityId {
  constructor(public readonly value: string) {}
}

export class UserId {
  constructor(public readonly value: string) {}
}

export class AuthenticationId {
  constructor(public readonly value: string) {}
}

export class SessionId {
  constructor(public readonly value: string) {}
}

export class AccessToken {
  constructor(public readonly value: string) {}
}

export class RefreshToken {
  constructor(public readonly value: string) {}
}

export class IdToken {
  constructor(public readonly value: string) {}
}

export class DeviceFingerprint {
  constructor(public readonly value: string) {}
}

export class IpAddress {
  constructor(public readonly value: string) {}
}

export class GeoLocation {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

export class TrustedDeviceId {
  constructor(public readonly value: string) {}
}

export class LoginAttempt {
  constructor(
    public readonly timestamp: Date,
    public readonly successful: boolean,
    public readonly ipAddress: IpAddress,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly location?: GeoLocation,
  ) {}
}
