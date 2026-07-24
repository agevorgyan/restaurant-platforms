import { Identifier, DomainPrimitive } from '@saas/domain';

export class ApiRouteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApiRouteId { return new ApiRouteId(value); }
  public static generate(): ApiRouteId { return new ApiRouteId(crypto.randomUUID()); }
}

export class ApiVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApiVersion {
    if (!/^v[0-9]+(\.[0-9]+)?$/.test(value)) throw new Error('ApiVersion must be in format v1 or v1.0');
    return new ApiVersion(value);
  }
}

export enum ApiConsumerEnum {
  ADMIN_PORTAL = 'ADMIN_PORTAL',
  RESTAURANT_PORTAL = 'RESTAURANT_PORTAL',
  KITCHEN_DISPLAY = 'KITCHEN_DISPLAY',
  POS = 'POS',
  CUSTOMER_MENU = 'CUSTOMER_MENU',
  MOBILE_APPS = 'MOBILE_APPS',
  PUBLIC_API = 'PUBLIC_API',
  PARTNER_API = 'PARTNER_API'
}

export class ApiConsumer extends DomainPrimitive<ApiConsumerEnum> {
  private constructor(value: ApiConsumerEnum) { super(value); }
  public static create(value: ApiConsumerEnum): ApiConsumer {
    if (!Object.values(ApiConsumerEnum).includes(value)) throw new Error(`Invalid ApiConsumer: ${value}`);
    return new ApiConsumer(value);
  }
}

export enum ApiScopeEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM'
}

export class ApiScope extends DomainPrimitive<ApiScopeEnum> {
  private constructor(value: ApiScopeEnum) { super(value); }
  public static create(value: ApiScopeEnum): ApiScope {
    if (!Object.values(ApiScopeEnum).includes(value)) throw new Error(`Invalid ApiScope: ${value}`);
    return new ApiScope(value);
  }
}

export interface RateLimitPolicyProps {
  windowMs: number;
  maxRequests: number;
}

export class RateLimitPolicy extends DomainPrimitive<RateLimitPolicyProps> {
  private constructor(value: RateLimitPolicyProps) { super(value); }
  public static create(value: RateLimitPolicyProps): RateLimitPolicy {
    if (value.windowMs <= 0) throw new Error('windowMs must be greater than zero');
    if (value.maxRequests <= 0) throw new Error('maxRequests must be greater than zero');
    return new RateLimitPolicy(value);
  }
}

export enum RoutePolicyEnum {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  INTERNAL_ONLY = 'INTERNAL_ONLY'
}

export class RoutePolicy extends DomainPrimitive<RoutePolicyEnum> {
  private constructor(value: RoutePolicyEnum) { super(value); }
  public static create(value: RoutePolicyEnum): RoutePolicy {
    if (!Object.values(RoutePolicyEnum).includes(value)) throw new Error(`Invalid RoutePolicy: ${value}`);
    return new RoutePolicy(value);
  }
}
