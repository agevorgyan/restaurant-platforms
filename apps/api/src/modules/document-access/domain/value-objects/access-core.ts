import { DomainPrimitive } from '@saas/domain';

// ENUMS

export enum AccessTypeEnum {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  VIEW = 'VIEW',
  DELETE = 'DELETE'
}

export class AccessType extends DomainPrimitive<AccessTypeEnum> {
  private constructor(value: AccessTypeEnum) { super(value); }
  public static create(value: AccessTypeEnum): AccessType {
    if (!Object.values(AccessTypeEnum).includes(value)) throw new Error(`Invalid AccessType: ${value}`);
    return new AccessType(value);
  }
}

export enum PermissionDecisionEnum {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
  EXPIRED = 'EXPIRED'
}

export class PermissionDecision extends DomainPrimitive<PermissionDecisionEnum> {
  private constructor(value: PermissionDecisionEnum) { super(value); }
  public static create(value: PermissionDecisionEnum): PermissionDecision {
    if (!Object.values(PermissionDecisionEnum).includes(value)) throw new Error(`Invalid PermissionDecision: ${value}`);
    return new PermissionDecision(value);
  }
}

// VALUE OBJECTS

export class AccessToken extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccessToken {
    if (!value || value.trim().length === 0) throw new Error('AccessToken cannot be empty');
    return new AccessToken(value);
  }
}

export class SignedUrl extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SignedUrl {
    if (!value || value.trim().length === 0) throw new Error('SignedUrl cannot be empty');
    try {
      new URL(value);
    } catch {
      throw new Error(`Invalid SignedUrl URL: ${value}`);
    }
    return new SignedUrl(value);
  }
}

export class ExpirationTime extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): ExpirationTime {
    return new ExpirationTime(value);
  }
  public isExpired(): boolean {
    return new Date() > this.value;
  }
}

export interface AccessPolicyProps {
  allowedTypes: AccessTypeEnum[];
  tenantId: string;
  allowedRoles?: string[];
  expirationMinutes: number;
}

export class AccessPolicy extends DomainPrimitive<AccessPolicyProps> {
  private constructor(value: AccessPolicyProps) { super(value); }
  public static create(value: AccessPolicyProps): AccessPolicy {
    if (!value.tenantId) throw new Error('AccessPolicy requires a tenantId');
    if (!value.allowedTypes || value.allowedTypes.length === 0) throw new Error('AccessPolicy requires allowedTypes');
    return new AccessPolicy(value);
  }
}

export interface AccessPermissionProps {
  decision: PermissionDecisionEnum;
  reason?: string;
  evaluatedAt: Date;
}

export class AccessPermission extends DomainPrimitive<AccessPermissionProps> {
  private constructor(value: AccessPermissionProps) { super(value); }
  public static create(value: AccessPermissionProps): AccessPermission {
    return new AccessPermission(value);
  }
}

export interface RequesterIdentityProps {
  userId: string;
  tenantId: string;
  roles: string[];
  ipAddress?: string;
}

export class RequesterIdentity extends DomainPrimitive<RequesterIdentityProps> {
  private constructor(value: RequesterIdentityProps) { super(value); }
  public static create(value: RequesterIdentityProps): RequesterIdentity {
    if (!value.userId) throw new Error('RequesterIdentity requires a userId');
    if (!value.tenantId) throw new Error('RequesterIdentity requires a tenantId');
    return new RequesterIdentity(value);
  }
}

export interface ObjectReferenceProps {
  documentId: string;
  provider: string;
  bucket: string;
  key: string;
}

export class ObjectReference extends DomainPrimitive<ObjectReferenceProps> {
  private constructor(value: ObjectReferenceProps) { super(value); }
  public static create(value: ObjectReferenceProps): ObjectReference {
    if (!value.documentId || !value.provider || !value.bucket || !value.key) {
      throw new Error('ObjectReference requires documentId, provider, bucket, and key');
    }
    return new ObjectReference(value);
  }
}

export interface DownloadRequestProps {
  identity: RequesterIdentityProps;
  objectReference: ObjectReferenceProps;
  requestedAt: Date;
}

export class DownloadRequest extends DomainPrimitive<DownloadRequestProps> {
  private constructor(value: DownloadRequestProps) { super(value); }
  public static create(value: DownloadRequestProps): DownloadRequest {
    return new DownloadRequest(value);
  }
}

export interface UploadRequestProps {
  identity: RequesterIdentityProps;
  objectReference: ObjectReferenceProps;
  mimeType: string;
  requestedAt: Date;
}

export class UploadRequest extends DomainPrimitive<UploadRequestProps> {
  private constructor(value: UploadRequestProps) { super(value); }
  public static create(value: UploadRequestProps): UploadRequest {
    return new UploadRequest(value);
  }
}
