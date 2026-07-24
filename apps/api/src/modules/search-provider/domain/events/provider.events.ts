export class ProviderRegistered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly providerId: string,
    public readonly providerName: string
  ) {}
}

export class ProviderEnabled {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly providerId: string
  ) {}
}

export class ProviderDisabled {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly providerId: string,
    public readonly reason: string
  ) {}
}

export class ProviderHealthChanged {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly providerId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string
  ) {}
}

export class ProviderFailedOver {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly failedProviderId: string,
    public readonly backupProviderId: string
  ) {}
}

export class ProviderRecovered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly providerId: string
  ) {}
}

export class SearchProviderChanged {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly activeProviderId: string
  ) {}
}
