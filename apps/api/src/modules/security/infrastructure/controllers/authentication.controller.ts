/* eslint-disable @typescript-eslint/no-unused-vars */import { Controller, Post, Get, Delete, Body, Param, Req } from '@nestjs/common';
import { AuthenticationService, SessionService, PasswordService, PasskeyService, MfaService } from '../../application/services';
import {
  LoginDto,
  RefreshDto,
  PasswordResetDto,
  PasswordChangeDto,
  MfaSetupDto,
  MfaVerifyDto,
  PasskeyRegisterDto,
  PasskeyAuthenticateDto,
} from '../../application/dto';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly passkeyService: PasskeyService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authenticationService.login(dto);
  }

  @Post('logout')
  async logout(@Req() req: any) {
    // Normally extracted from authenticated request context
    const sessionId = req.sessionId || 'dummy-session-id';
    return this.authenticationService.logout(sessionId);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.authenticationService.refresh(dto);
  }

  @Post('password/reset')
  async resetPassword(@Body() dto: PasswordResetDto) {
    return this.passwordService.resetPassword(dto);
  }

  @Post('password/change')
  async changePassword(@Req() req: any, @Body() dto: PasswordChangeDto) {
    const userId = req.userId || 'dummy-user-id';
    return this.passwordService.changePassword(userId, dto);
  }

  @Post('mfa/setup')
  async setupMfa(@Req() req: any, @Body() dto: MfaSetupDto) {
    const userId = req.userId || 'dummy-user-id';
    return this.mfaService.setupMfa(userId, dto);
  }

  @Post('mfa/verify')
  async verifyMfa(@Req() req: any, @Body() dto: MfaVerifyDto) {
    const userId = req.userId || 'dummy-user-id';
    return this.mfaService.verifyMfa(userId, dto);
  }

  @Post('passkey/register')
  async registerPasskey(@Body() dto: PasskeyRegisterDto) {
    return this.passkeyService.verifyRegistration(dto);
  }

  @Post('passkey/authenticate')
  async authenticatePasskey(@Body() dto: PasskeyAuthenticateDto) {
    return this.passkeyService.verifyAuthentication(dto);
  }

  @Get('sessions')
  async getSessions(@Req() req: any) {
    const userId = req.userId || 'dummy-user-id';
    return this.sessionService.getActiveSessions(userId);
  }

  @Delete('sessions/:id')
  async revokeSession(@Req() req: any, @Param('id') id: string) {
    const userId = req.userId || 'dummy-user-id';
    return this.sessionService.revokeSession(id, userId);
  }
}
