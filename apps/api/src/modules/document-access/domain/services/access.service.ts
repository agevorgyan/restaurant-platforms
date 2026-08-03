import { 
  RequesterIdentityProps, 
  ObjectReferenceProps, 
  AccessTypeEnum,
  PermissionDecisionEnum,
  AccessPermission,
  SignedUrl
} from '../value-objects';

export class AccessAuditService {
  public async logAccessAttempt(
    identity: RequesterIdentityProps,
    objectRef: ObjectReferenceProps,
    type: AccessTypeEnum,
    decision: PermissionDecisionEnum,
    reason?: string
  ): Promise<void> {
    // In production, this pushes an event to the Enterprise Event Bus or an audit DB
    console.log(`[AUDIT] ${type} attempt on ${objectRef.documentId} by ${identity.userId} (${identity.tenantId}): ${decision} - ${reason || ''}`);
  }
}

export class PolicyEvaluationService {
  public evaluate(
    identity: RequesterIdentityProps,
    objectRef: ObjectReferenceProps,
    type: AccessTypeEnum
  ): AccessPermission {
    // Zero Trust basic policy evaluation
    if (!identity.tenantId || !identity.userId) {
      return AccessPermission.create({
        decision: PermissionDecisionEnum.DENY,
        reason: 'Missing identity information',
        evaluatedAt: new Date()
      });
    }

    // In a real system, this queries the Document metadata via a gRPC/internal call
    // to check if DocumentVisibility === TENANT && Document.TenantId === Requester.TenantId
    
    // Simplistic RBAC mock for this infrastructure layer
    if (type === AccessTypeEnum.DELETE && !identity.roles.includes('ADMIN')) {
      return AccessPermission.create({
        decision: PermissionDecisionEnum.DENY,
        reason: 'Missing required role: ADMIN',
        evaluatedAt: new Date()
      });
    }

    return AccessPermission.create({
      decision: PermissionDecisionEnum.ALLOW,
      evaluatedAt: new Date()
    });
  }
}

export class PermissionValidationService {
  constructor(
    private readonly policyEvaluator: PolicyEvaluationService,
    private readonly auditor: AccessAuditService
  ) {}

  public async validateAccess(
    identity: RequesterIdentityProps,
    objectRef: ObjectReferenceProps,
    type: AccessTypeEnum
  ): Promise<void> {
    const permission = this.policyEvaluator.evaluate(identity, objectRef, type);
    
    await this.auditor.logAccessAttempt(identity, objectRef, type, permission.toValue().decision, permission.toValue().reason);

    if (permission.toValue().decision !== PermissionDecisionEnum.ALLOW) {
      throw new Error(`Access Denied: ${permission.toValue().reason || 'Policy evaluation failed'}`);
    }
  }
}

export class AccessTokenService {
  public generateTemporaryToken(identity: RequesterIdentityProps, objectRef: ObjectReferenceProps, expiresInMinutes: number = 60): string {
    // Returns a JWT or opaque token representing temporary access
    // This allows external users to download documents without a full session
    return `tmp_acc_${crypto.randomUUID()}`;
  }
}

export class SignedUrlService {
  // This service would integrate with the Storage Provider Framework's IStorageProvider
  // to delegate the actual URL generation.
  // Using an abstraction pattern to avoid circular dependencies.

  public async generatePresignedDownloadUrl(
    providerName: string, 
    bucket: string, 
    key: string, 
    expiresInSeconds: number = 3600
  ): Promise<SignedUrl> {
    // Mock implementation delegating to underlying storage provider
    const url = `https://${providerName.toLowerCase()}.storage.com/${bucket}/${key}?sig=${crypto.randomUUID()}&exp=${Date.now() + (expiresInSeconds * 1000)}`;
    return SignedUrl.create(url);
  }

  public async generatePresignedUploadUrl(
    providerName: string, 
    bucket: string, 
    key: string, 
    expiresInSeconds: number = 3600
  ): Promise<SignedUrl> {
    const url = `https://${providerName.toLowerCase()}.storage.com/${bucket}/${key}?upload_id=${crypto.randomUUID()}&exp=${Date.now() + (expiresInSeconds * 1000)}`;
    return SignedUrl.create(url);
  }
}

export class SecureAccessService {
  constructor(
    private readonly validator: PermissionValidationService,
    private readonly signedUrlService: SignedUrlService,
    private readonly tokenService: AccessTokenService
  ) {}

  public async requestDownloadUrl(
    identity: RequesterIdentityProps,
    objectRef: ObjectReferenceProps
  ): Promise<string> {
    // 1. Zero trust validation
    await this.validator.validateAccess(identity, objectRef, AccessTypeEnum.DOWNLOAD);

    // 2. Delegate to Storage Provider abstraction
    const signedUrl = await this.signedUrlService.generatePresignedDownloadUrl(
      objectRef.provider,
      objectRef.bucket,
      objectRef.key,
      3600
    );

    return signedUrl.toValue();
  }

  public async requestUploadUrl(
    identity: RequesterIdentityProps,
    objectRef: ObjectReferenceProps
  ): Promise<string> {
    // 1. Zero trust validation
    await this.validator.validateAccess(identity, objectRef, AccessTypeEnum.UPLOAD);

    // 2. Delegate to Storage Provider abstraction
    const signedUrl = await this.signedUrlService.generatePresignedUploadUrl(
      objectRef.provider,
      objectRef.bucket,
      objectRef.key,
      3600
    );

    return signedUrl.toValue();
  }
}
