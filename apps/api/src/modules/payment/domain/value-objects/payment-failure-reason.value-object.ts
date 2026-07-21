import { ValueObject } from '@saas/core';

export enum PaymentFailureReasonEnum {
  INSUFFICIENT_FUNDS = 'InsufficientFunds',
  CARD_DECLINED = 'CardDeclined',
  EXPIRED_CARD = 'ExpiredCard',
  FRAUD_DETECTED = 'FraudDetected',
  GATEWAY_ERROR = 'GatewayError',
  NETWORK_ERROR = 'NetworkError',
  INVALID_CVV = 'InvalidCVV',
  UNKNOWN = 'Unknown'
}

export interface PaymentFailureReasonProps {
  value: PaymentFailureReasonEnum;
}

export class PaymentFailureReason extends ValueObject<PaymentFailureReasonProps> {
  private constructor(props: PaymentFailureReasonProps) {
    super(props);
  }

  public static create(value: PaymentFailureReasonEnum): PaymentFailureReason {
    if (!Object.values(PaymentFailureReasonEnum).includes(value)) {
      throw new Error(`Unsupported payment failure reason: ${value}`);
    }
    return new PaymentFailureReason({ value });
  }

  get value(): PaymentFailureReasonEnum {
    return this.props.value;
  }
}
