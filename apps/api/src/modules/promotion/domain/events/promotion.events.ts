import { IPromotion } from '../entities/promotion.interface';

export class PromotionCreatedEvent {
  constructor(public readonly promotion: IPromotion) {}
}

export class PromotionUpdatedEvent {
  constructor(public readonly promotion: IPromotion) {}
}

export class PromotionExpiredEvent {
  constructor(public readonly promotionId: string) {}
}
