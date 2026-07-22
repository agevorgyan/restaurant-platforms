export class InventoryEventRegistry {
  private readonly inboundRegistry = new Map<string, string>();
  private readonly outboundRegistry = new Map<string, string[]>();

  public registerOutbound(domainEventName: string, integrationEventName: string): void {
    const existing = this.outboundRegistry.get(domainEventName) || [];
    if (!existing.includes(integrationEventName)) {
      this.outboundRegistry.set(domainEventName, [...existing, integrationEventName]);
    }
  }

  public registerInbound(integrationEventName: string, domainAction: string): void {
    this.inboundRegistry.set(integrationEventName, domainAction);
  }

  public getOutboundEventsFor(domainEventName: string): string[] {
    return this.outboundRegistry.get(domainEventName) || [];
  }

  public getInboundActionFor(integrationEventName: string): string | undefined {
    return this.inboundRegistry.get(integrationEventName);
  }
}
