/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  async generateAccessToken(userId: string, sessionId: string): Promise<string> {
    return 'access_token';
  }

  async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    return 'refresh_token';
  }

  async validateToken(token: string): Promise<any> {}
}
