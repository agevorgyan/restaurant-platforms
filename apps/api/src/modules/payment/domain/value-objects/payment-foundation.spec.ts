import { PaymentId } from './payment-id.value-object';
import { PaymentIntentId } from './payment-intent-id.value-object';
import { TransactionId } from './transaction-id.value-object';
import { PaymentStatus, PaymentStatusEnum } from './payment-status.value-object';
import { PaymentMethod, PaymentMethodEnum } from './payment-method.value-object';
import { PaymentProvider, PaymentProviderEnum } from './payment-provider.value-object';
import { PaymentType, PaymentTypeEnum } from './payment-type.value-object';
import { AuthorizationCode } from './authorization-code.value-object';
import { GatewayReference } from './gateway-reference.value-object';
import { PaymentReference } from './payment-reference.value-object';
import { PaymentMetadata } from './payment-metadata.value-object';
import { PaymentTimestamp } from './payment-timestamp.value-object';
import { IdempotencyKey } from './idempotency-key.value-object';

describe('Payment Foundation Value Objects', () => {

  describe('Identifiers (PaymentId, PaymentIntentId, TransactionId, IdempotencyKey)', () => {
    it('should create valid UUIDs if none provided', () => {
      const pid = PaymentId.create();
      const piid = PaymentIntentId.create();
      const tid = TransactionId.create();
      const key = IdempotencyKey.create();

      expect(pid.value).toBeDefined();
      expect(piid.value).toBeDefined();
      expect(tid.value).toBeDefined();
      expect(key.value).toBeDefined();
    });

    it('should reject invalid UUIDs', () => {
      expect(() => PaymentId.create('invalid-uuid')).toThrow('PaymentId must be a valid UUID');
      expect(() => PaymentIntentId.create('invalid-uuid')).toThrow('PaymentIntentId must be a valid UUID');
      expect(() => TransactionId.create('invalid-uuid')).toThrow('TransactionId must be a valid UUID');
      expect(() => IdempotencyKey.create('invalid-uuid')).toThrow('IdempotencyKey must be a valid UUID');
    });

    it('should accept specific valid UUIDs', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const pid = PaymentId.create(validUuid);
      expect(pid.value).toBe(validUuid);
    });
  });

  describe('Enums (PaymentStatus, PaymentMethod, PaymentProvider, PaymentType)', () => {
    it('should accept supported values', () => {
      expect(PaymentStatus.create(PaymentStatusEnum.AUTHORIZED).value).toBe(PaymentStatusEnum.AUTHORIZED);
      expect(PaymentMethod.create(PaymentMethodEnum.APPLE_PAY).value).toBe(PaymentMethodEnum.APPLE_PAY);
      expect(PaymentProvider.create(PaymentProviderEnum.STRIPE).value).toBe(PaymentProviderEnum.STRIPE);
      expect(PaymentType.create(PaymentTypeEnum.REFUND).value).toBe(PaymentTypeEnum.REFUND);
    });

    it('should reject unsupported values', () => {
      expect(() => PaymentStatus.create('InvalidStatus' as any)).toThrow('Unsupported payment status');
      expect(() => PaymentMethod.create('Bitcoin' as any)).toThrow('Unsupported payment method');
      expect(() => PaymentProvider.create('MyBank' as any)).toThrow('Unsupported payment provider');
      expect(() => PaymentType.create('Donation' as any)).toThrow('Unsupported payment type');
    });
  });

  describe('Strings (AuthorizationCode, GatewayReference, PaymentReference)', () => {
    it('should create successfully for valid strings', () => {
      expect(AuthorizationCode.create('AUTH123').value).toBe('AUTH123');
      expect(GatewayReference.create('GW_9999').value).toBe('GW_9999');
      expect(PaymentReference.create('REF-ABC').value).toBe('REF-ABC');
    });

    it('should strip whitespaces', () => {
      expect(AuthorizationCode.create('  AUTH123  ').value).toBe('AUTH123');
      expect(GatewayReference.create(' GW_9999 ').value).toBe('GW_9999');
    });

    it('should reject empty strings', () => {
      expect(() => AuthorizationCode.create(' ')).toThrow('AuthorizationCode cannot be empty');
      expect(() => GatewayReference.create('')).toThrow('GatewayReference cannot be empty');
      expect(() => PaymentReference.create('   ')).toThrow('PaymentReference cannot be empty');
    });

    it('should reject overly long strings', () => {
      expect(() => AuthorizationCode.create('A'.repeat(51))).toThrow('AuthorizationCode is too long');
      expect(() => GatewayReference.create('A'.repeat(256))).toThrow('GatewayReference is too long');
    });
  });

  describe('PaymentMetadata', () => {
    it('should create empty metadata', () => {
      const meta = PaymentMetadata.create();
      expect(meta.toMap().size).toBe(0);
    });

    it('should accept valid key value pairs', () => {
      const meta = PaymentMetadata.create({ tip: '500', device: 'iOS' });
      expect(meta.get('tip')).toBe('500');
      expect(meta.get('device')).toBe('iOS');
      expect(meta.toMap().size).toBe(2);
    });

    it('should reject empty keys', () => {
      expect(() => PaymentMetadata.create({ '': 'value' })).toThrow('Metadata keys cannot be empty');
    });
  });

  describe('PaymentTimestamp', () => {
    it('should create with current time', () => {
      const ts = PaymentTimestamp.now();
      expect(ts.value).toBeInstanceOf(Date);
    });

    it('should create with specific time', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      const ts = PaymentTimestamp.create(date);
      expect(ts.value).toEqual(date);
    });

    it('should reject invalid dates', () => {
      expect(() => PaymentTimestamp.create(new Date('invalid'))).toThrow('PaymentTimestamp must be a valid Date object');
      expect(() => PaymentTimestamp.create(null as any)).toThrow('PaymentTimestamp must be a valid Date object');
    });
  });

});
