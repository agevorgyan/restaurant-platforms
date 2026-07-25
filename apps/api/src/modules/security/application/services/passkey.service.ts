/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';
import { PasskeyRegisterDto, PasskeyAuthenticateDto } from '../dto';

@Injectable()
export class PasskeyService {
  async getRegistrationOptions(userId: string): Promise<any> {
    return {};
  }

  async verifyRegistration(dto: PasskeyRegisterDto): Promise<void> {}

  async getAuthenticationOptions(userId: string): Promise<any> {
    return {};
  }

  async verifyAuthentication(dto: PasskeyAuthenticateDto): Promise<void> {}
}
