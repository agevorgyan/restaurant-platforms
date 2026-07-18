export class GoodsReceiptCreatedEvent {
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptPostedEvent {
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptCancelledEvent {
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptLineRejectedEvent {
  constructor(
    public readonly receiptId: string,
    public readonly restaurantId: string,
    public readonly lineId: string,
    public readonly ingredientId: string,
    public readonly rejectedQuantity: number
  ) {}
}
