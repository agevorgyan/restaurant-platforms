import { AuthenticationId, UserId } from '../value-objects';
import { AuthenticationStatus } from '../enums/authentication-status.enum';
import { AuthenticationMethod } from '../enums/authentication-method.enum';

export class Authentication {
  constructor(
    public readonly id: AuthenticationId,
    public readonly userId: UserId,
    public readonly method: AuthenticationMethod,
    public status: AuthenticationStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public complete(): void {
    this.status = AuthenticationStatus.Authenticated;
    this.updatedAt = new Date();
  }

  public requireChallenge(): void {
    this.status = AuthenticationStatus.ChallengeRequired;
    this.updatedAt = new Date();
  }

  public lock(): void {
    this.status = AuthenticationStatus.Locked;
    this.updatedAt = new Date();
  }

  public revoke(): void {
    this.status = AuthenticationStatus.Revoked;
    this.updatedAt = new Date();
  }
}
