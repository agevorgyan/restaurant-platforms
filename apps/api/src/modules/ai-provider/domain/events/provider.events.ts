import { ProviderStatusEnum } from '../value-objects';

export class ProviderRegistered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly providerId: string,
    public readonly name: string
  ) {}
}

export class ProviderEnabled {
  public readonly occurredOn: Date = new Date();
  constructor(public readonly providerId: string) {}
}

export class ProviderDisabled {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly providerId: string,
    public readonly reason: string
  ) {}
}

export class ProviderHealthChanged {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly providerId: string,
    public readonly status: ProviderStatusEnum,
    public readonly latencyMs: number
  ) {}
}

export class ModelRegistered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly providerId: string,
    public readonly modelId: string,
    public readonly capabilities: string[]
  ) {}
}

export class ModelDeprecated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly providerId: string,
    public readonly modelId: string
  ) {}
}

export class ProviderFailoverTriggered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly primaryProviderId: string,
    public readonly fallbackProviderId: string,
    public readonly reason: string
  ) {}
}
