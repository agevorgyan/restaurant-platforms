import { AccountAggregate } from '../domain/models/account.aggregate';
import { PostingRule } from '../domain/value-objects/posting-rule.vo';
import { ValidationService } from './validation.service';

export class PostingRuleService {
  constructor(private readonly validator: ValidationService = new ValidationService()) {}

  public configurePostingRule(account: AccountAggregate, rule: PostingRule): void {
    account.updatePostingRule(rule);
  }

  public checkPostingEligibility(
    account: AccountAggregate,
    isManualPosting: boolean,
    providedDimensions: string[] = []
  ): boolean {
    this.validator.validatePostingPermitted(account, isManualPosting);
    this.validator.validateDimensionTags(account, providedDimensions);
    return true;
  }
}
