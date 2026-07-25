import { Module } from '@nestjs/common';
import { AuthenticationController, AuthorizationController } from './infrastructure/controllers';
import {
  AuthenticationService,
  SessionService,
  TokenService,
  PasswordService,
  PasskeyService,
  MfaService,
  IdentityProviderService,
  TrustedDeviceService,
  AuthorizationService,
  RoleService,
  PermissionService,
  PolicyEngineService,
  ResourceAuthorizationService,
  DelegationService,
  PermissionInheritanceService,
  AuthorizationAuditService,
} from './application/services';

@Module({
  controllers: [
    AuthenticationController,
    AuthorizationController,
  ],
  providers: [
    AuthenticationService,
    SessionService,
    TokenService,
    PasswordService,
    PasskeyService,
    MfaService,
    IdentityProviderService,
    TrustedDeviceService,
    AuthorizationService,
    RoleService,
    PermissionService,
    PolicyEngineService,
    ResourceAuthorizationService,
    DelegationService,
    PermissionInheritanceService,
    AuthorizationAuditService,
  ],
  exports: [
    AuthenticationService,
    SessionService,
    TokenService,
    AuthorizationService,
    RoleService,
    PermissionService,
  ],
})
export class SecurityModule {}
