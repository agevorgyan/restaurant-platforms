import { ValueObject } from '@saas/core';
import { CustomerReference } from './customer-reference.value-object';
import { LoyaltyAccountReference } from './loyalty-account-reference.value-object';
import { OrderReference } from './order-reference.value-object';
import { PromotionReference } from './promotion-reference.value-object';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { PointsBalance } from './points-balance.value-object';
import { TransactionType } from '../enums/loyalty.enums';

export interface LoyaltyEvaluationContextProps {
  customerRef: CustomerReference;
  loyaltyAccountRef: LoyaltyAccountReference;
  orderRef?: OrderReference;
  promotionRef?: PromotionReference;
  currentTier: LoyaltyTierVo;
  currentPoints: PointsBalance;
  transactionType: TransactionType;
  businessDateTime: Date;
}

export class LoyaltyEvaluationContext extends ValueObject<LoyaltyEvaluationContextProps> {
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get loyaltyAccountRef(): LoyaltyAccountReference { return this.props.loyaltyAccountRef; }
  get orderRef(): OrderReference | undefined { return this.props.orderRef; }
  get promotionRef(): PromotionReference | undefined { return this.props.promotionRef; }
  get currentTier(): LoyaltyTierVo { return this.props.currentTier; }
  get currentPoints(): PointsBalance { return this.props.currentPoints; }
  get transactionType(): TransactionType { return this.props.transactionType; }
  get businessDateTime(): Date { return this.props.businessDateTime; }

  private constructor(props: LoyaltyEvaluationContextProps) { super(props); }
  public static create(props: LoyaltyEvaluationContextProps): LoyaltyEvaluationContext {
    return new LoyaltyEvaluationContext(props);
  }
}