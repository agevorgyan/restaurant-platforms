import { PoisonMessagePolicy } from '../policies/acl.policy';

export class PoisonMessageHandler {
  public handle(messageId: string, reason: string): void {
    PoisonMessagePolicy.quarantineMessage(messageId, reason);
  }
}