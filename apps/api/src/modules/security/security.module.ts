import { Module } from '@nestjs/common';
import { AuthenticationController } from './infrastructure/controllers';
import {
  AuthenticationService,
  SessionService,
  TokenService,
  PasswordService,
  PasskeyService,
  MfaService,
  IdentityProviderService,
  TrustedDeviceService,
} from './application/services';

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    SessionService,
    TokenService,
    PasswordService,
    PasskeyService,
    MfaService,
    IdentityProviderService,
    TrustedDeviceService,
  ],
  exports: [
    AuthenticationService,
    SessionService,
    TokenService,
  ],
})
export class SecurityModule {}
