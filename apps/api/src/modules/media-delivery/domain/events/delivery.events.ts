export class MediaCached {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly cacheKey: string,
    public readonly edgeLocation: string
  ) {}
}

export class MediaDelivered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly provider: string,
    public readonly bytesDelivered: number
  ) {}
}

export class CacheInvalidated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly cacheKey: string,
    public readonly provider: string
  ) {}
}

export class MediaUrlGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly url: string,
    public readonly isSigned: boolean,
    public readonly expiresAt?: Date
  ) {}
}

export class DeliveryFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly provider: string,
    public readonly errorCode: string,
    public readonly errorMessage: string
  ) {}
}
