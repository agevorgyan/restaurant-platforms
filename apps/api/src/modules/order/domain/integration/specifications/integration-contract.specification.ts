export class IntegrationContractSpecification {
  public isSatisfiedBy(payload: any, requiredFields: string[]): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null) {
        return false;
      }
    }

    return true;
  }
}
