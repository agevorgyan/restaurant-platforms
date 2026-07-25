/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';
import { Session } from '../../domain/models';

@Injectable()
export class SessionService {
  async getActiveSessions(userId: string): Promise<Session[]> {
    return [];
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {}

  async revokeAllSessions(userId: string): Promise<void> {}
}
