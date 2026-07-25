/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityProviderService {
  async handleOAuthCallback(provider: string, code: string): Promise<any> {
    return { accessToken: 'dummy', refreshToken: 'dummy' };
  }

  async handleSamlResponse(response: string): Promise<any> {
    return { accessToken: 'dummy', refreshToken: 'dummy' };
  }
}
