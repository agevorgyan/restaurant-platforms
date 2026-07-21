export class OrderEventRegistry {
  private readonly mappings = new Map<string, string[]>();

  public register(domainEventName: string, integrationEventName: string): void {
    const existing = this.mappings.get(domainEventName) || [];
    
    if (existing.includes(integrationEventName)) {
      throw new Error(`Integration mapping already exists: ${domainEventName} -> ${integrationEventName}`);
    }

    existing.push(integrationEventName);
    this.mappings.set(domainEventName, existing);
  }

  public getIntegrationEventsFor(domainEventName: string): string[] {
    return this.mappings.get(domainEventName) || [];
  }
}
