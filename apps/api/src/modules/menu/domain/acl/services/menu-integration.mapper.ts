export class MenuIntegrationMapper {
  public static mapInbound<T>(payload: any, schemaMap: (p: any) => T): T {
    // Pure transformation, no side effects
    return schemaMap(payload);
  }

  public static mapOutbound<T>(domainEvent: any, schemaMap: (e: any) => T): T {
    return schemaMap(domainEvent);
  }
}