import { IRefund } from '../entities/refund.interface';

export class RefundRequestedEvent {
  constructor(public readonly refund: IRefund) {}
}

export class RefundApprovedEvent {
  constructor(public readonly refund: IRefund) {}
}

export class RefundRejectedEvent {
  constructor(public readonly refund: IRefund) {}
}

export class RefundCompletedEvent {
  constructor(public readonly refund: IRefund) {}
}
