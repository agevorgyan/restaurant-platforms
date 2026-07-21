/**
 * Pure contracts defining how Marketing Integration communicates with other bounded contexts.
 * No infrastructure code, purely Domain-level interfaces.
 */

export interface ICustomerIntegration {
  getCustomerProfile(customerId: string): Promise<{ id: string, name: string, segment: string, birthday?: string }>;
  updateCustomerSegment(customerId: string, newSegment: string): Promise<void>;
}

export interface IOrderIntegration {
  getOrderDetails(orderId: string): Promise<{ id: string, customerId: string, amount: number, items: string[] }>;
  applyDiscountToCart(cartId: string, discountPayload: any): Promise<void>;
}

export interface IRestaurantIntegration {
  getRestaurantInfo(restaurantId: string): Promise<{ id: string, name: string, isActive: boolean }>;
}

export interface IMenuIntegration {
  getMenuItems(categoryIds: string[]): Promise<{ id: string, name: string, categoryId: string }[]>;
}

export interface IPricingIntegration {
  calculateOrderPricing(orderData: any, policies: any[]): Promise<{ finalAmount: number, discountsApplied: any[] }>;
}

export interface IInventoryIntegration {
  reservePromotionalItems(productId: string, quantity: number): Promise<boolean>;
}

export interface ILoyaltyIntegration {
  getLoyaltyBalance(customerId: string): Promise<{ points: number, tier: string }>;
  addLoyaltyPoints(customerId: string, points: number, reason: string): Promise<void>;
  removeLoyaltyPoints(customerId: string, points: number, reason: string): Promise<void>;
}

export interface IIdentityIntegration {
  getUserContext(userId: string): Promise<{ id: string, roles: string[] }>;
}

export interface INotificationIntegration {
  scheduleDelivery(templateId: string, recipient: any, variables: Record<string, any>): Promise<void>;
  cancelDelivery(notificationId: string): Promise<void>;
}

export interface IReportingIntegration {
  logCampaignMetrics(campaignId: string, metrics: any): Promise<void>;
}

export interface IAnalyticsIntegration {
  trackMarketingEvent(eventName: string, payload: any, timestamp: string): Promise<void>;
}
