export interface PromotionAppliedPayload {
  orderId: string;
  promotionId: string;
  discountAmount: number;
}

export interface CouponRedeemedPayload {
  orderId: string;
  couponCode: string;
  discountAmount: number;
}
