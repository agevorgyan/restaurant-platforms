export class OrderReferenceSpecification {
  public static isValid(ref: any): boolean {
    return !!ref;
  }
}

export class CustomerOrderSpecification {
  public static isValidContext(context: any): boolean {
    return !!context.customerRef && !!context.orderRef;
  }
}

export class OrderStatisticsSpecification {
  public static isConsistent(stats: any): boolean {
    if (stats.orderCount < 0 || stats.lifetimeSpend < 0) return false;
    return true;
  }
}

export class OrderContractSpecification {
  public static isValidVersion(contract: any): boolean {
    return contract.version === '1.0';
  }
}

export class CustomerEligibilitySpecification {
  public static isEligible(stats: any): boolean {
    return stats.orderCount > 0;
  }
}