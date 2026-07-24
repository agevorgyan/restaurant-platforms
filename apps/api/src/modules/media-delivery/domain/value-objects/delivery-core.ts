import { DomainPrimitive } from '@saas/domain';

// ENUMS

export enum CacheStrategyEnum {
  CACHE_FIRST = 'CACHE_FIRST',
  ORIGIN_FIRST = 'ORIGIN_FIRST',
  NO_CACHE = 'NO_CACHE',
  IMMUTABLE = 'IMMUTABLE'
}

export class CacheStrategy extends DomainPrimitive<CacheStrategyEnum> {
  private constructor(value: CacheStrategyEnum) { super(value); }
  public static create(value: CacheStrategyEnum): CacheStrategy { return new CacheStrategy(value); }
}

export enum DeliveryStatusEnum {
  PENDING = 'PENDING',
  CACHED = 'CACHED',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED'
}

export class DeliveryStatus extends DomainPrimitive<DeliveryStatusEnum> {
  private constructor(value: DeliveryStatusEnum) { super(value); }
  public static create(value: DeliveryStatusEnum): DeliveryStatus { return new DeliveryStatus(value); }
}

// VALUE OBJECTS

export class DeliveryUrl extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DeliveryUrl {
    if (!value.startsWith('http')) throw new Error('Delivery URL must be a valid HTTP/S URL');
    return new DeliveryUrl(value);
  }
}

export class CdnProvider extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CdnProvider { return new CdnProvider(value); }
}

export class EdgeLocation extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EdgeLocation { return new EdgeLocation(value); }
}

export interface CachePolicyProps {
  strategy: CacheStrategyEnum;
  ttlSeconds: number;
  staleWhileRevalidateSeconds?: number;
}

export class CachePolicy extends DomainPrimitive<CachePolicyProps> {
  private constructor(value: CachePolicyProps) { super(value); }
  public static create(value: CachePolicyProps): CachePolicy { return new CachePolicy(value); }
}

export class CacheKey extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CacheKey { return new CacheKey(value); }
}

export class SignedMediaUrl extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SignedMediaUrl { return new SignedMediaUrl(value); }
}

export class ExpirationTime extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): ExpirationTime {
    if (value < new Date()) throw new Error('Expiration time cannot be in the past');
    return new ExpirationTime(value);
  }
}

export interface MediaVariantProps {
  mediaId: string;
  variantKey: string; // e.g., '1080p', 'thumbnail'
  mimeType: string;
}

export class MediaVariant extends DomainPrimitive<MediaVariantProps> {
  private constructor(value: MediaVariantProps) { super(value); }
  public static create(value: MediaVariantProps): MediaVariant { return new MediaVariant(value); }
}

export interface DeliveryProfileProps {
  profileId: string;
  allowedDomains: string[];
  rateLimitPerMinute: number;
  cachePolicy: CachePolicyProps;
}

export class DeliveryProfile extends DomainPrimitive<DeliveryProfileProps> {
  private constructor(value: DeliveryProfileProps) { super(value); }
  public static create(value: DeliveryProfileProps): DeliveryProfile { return new DeliveryProfile(value); }
}
