export class IntegrationContractSpecification {
  public isSatisfiedBy(payload: any): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    // Basic heuristic: check if no top-level properties are undefined/null when they shouldn't be
    // A robust implementation would use a schema validator (Zod/Joi), but for DDD we can do this simply
    for (const key of Object.keys(payload)) {
      if (payload[key] === undefined) {
        return false; // Rejects missing required properties
      }
    }

    return true;
  }
}
