export class InventoryRequestSpecification {
  public static isSatisfiedBy(payload: any): boolean {
    return !!payload && !!payload.correlationId && !!payload.causationId;
  }
}

export class InventoryResponseSpecification {
  public static isSatisfiedBy(response: any): boolean {
    return !!response && !!response.correlationId;
  }
}

export class GoodsReceiptIntegrationSpecification {
  public static isSatisfiedBy(goodsReceiptStatus: string): boolean {
    return goodsReceiptStatus === 'COMPLETED';
  }
}

export class InventoryAcknowledgementSpecification {
  public static isSatisfiedBy(ack: any): boolean {
    return ack && ack.isAcknowledged === true;
  }
}

export class IntegrationIdempotencySpecification {
  public static isSatisfiedBy(processedMessageIds: string[], incomingMessageId: string): boolean {
    return !processedMessageIds.includes(incomingMessageId);
  }
}