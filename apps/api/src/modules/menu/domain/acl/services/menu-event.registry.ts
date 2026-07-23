export class MenuEventRegistry {
  private handlers = new Map<string, any>();

  public register(eventType: string, handler: any): void {
    this.handlers.set(eventType, handler);
  }

  public getHandler(eventType: string): any {
    return this.handlers.get(eventType);
  }
}