import { Entity } from '@saas/core';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { AuthorizationReference } from '../value-objects/authorization-reference.value-object';

export interface AuthorizationProps {
  reference: AuthorizationReference;
  amount: PaymentAmount;
  expiresAt: Date;
  isVoided: boolean;
  createdAt: Date;
}

export class Authorization extends Entity<AuthorizationProps> {
  private constructor(props: AuthorizationProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    reference: AuthorizationReference,
    amount: PaymentAmount,
    expiresAt: Date,
    id?: string
  ): Authorization {
    if (!reference || !amount || !expiresAt) {
      throw new Error('Authorization must have reference, amount, and expiresAt');
    }
    
    return new Authorization({
      reference,
      amount,
      expiresAt,
      isVoided: false,
      createdAt: new Date()
    }, id);
  }

  public void(): void {
    if (this.props.isVoided) {
      throw new Error('Authorization is already voided');
    }
    this.props.isVoided = true;
  }

  public isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt.getTime() <= now.getTime();
  }

  get reference(): AuthorizationReference { return this.props.reference; }
  get amount(): PaymentAmount { return this.props.amount; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get isVoided(): boolean { return this.props.isVoided; }
  get createdAt(): Date { return this.props.createdAt; }
}
