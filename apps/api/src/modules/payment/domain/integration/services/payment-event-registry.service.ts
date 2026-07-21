export class PaymentEventRegistry {
  private readonly registry = new Map<string, string[]>();

  public register(domainEventName: string, integrationEventNames: string[]): void {
    if (this.registry.has(domainEventName)) {
      throw new Error(`Domain event ${domainEventName} is already registered.`);
    }
    this.registry.set(domainEventName, integrationEventNames);
  }

  public getIntegrationEventsFor(domainEventName: string): string[] {
    return this.registry.get(domainEventName) || [];
  }
}
