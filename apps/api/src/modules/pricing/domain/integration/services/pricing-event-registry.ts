export class PricingEventRegistry {
  private static registeredEvents = new Map<string, any>();

  public static register(eventName: string, eventConstructor: any): void {
    if (this.registeredEvents.has(eventName)) {
      throw new Error(`Event ${eventName} is already registered.`);
    }
    this.registeredEvents.set(eventName, eventConstructor);
  }

  public static getConstructor(eventName: string): any {
    return this.registeredEvents.get(eventName);
  }

  public static isRegistered(eventName: string): boolean {
    return this.registeredEvents.has(eventName);
  }

  public static clear(): void {
    this.registeredEvents.clear();
  }
}
