export class MarketingEventRegistry {
  private static registeredEvents = new Map<string, { eventName: string, version: number }>();

  public static registerEvent(eventName: string, version: number = 1): void {
    const key = `${eventName}_v${version}`;
    
    if (this.registeredEvents.has(key)) {
      throw new Error(`Event ${eventName} version ${version} is already registered in the Integration Layer.`);
    }

    this.registeredEvents.set(key, { eventName, version });
  }

  public static isRegistered(eventName: string, version: number = 1): boolean {
    return this.registeredEvents.has(`${eventName}_v${version}`);
  }

  public static getRegisteredEvents(): string[] {
    return Array.from(this.registeredEvents.keys());
  }

  public static clear(): void {
    this.registeredEvents.clear();
  }
}
