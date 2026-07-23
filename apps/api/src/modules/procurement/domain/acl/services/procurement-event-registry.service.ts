export class ProcurementEventRegistry {
  private schemas: Map<string, any> = new Map();

  public registerSchema(eventName: string, schemaDefinition: any): void {
    this.schemas.set(eventName, schemaDefinition);
  }

  public getSchema(eventName: string): any {
    return this.schemas.get(eventName);
  }
}