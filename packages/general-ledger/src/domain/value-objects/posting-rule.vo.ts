import { NormalBalance } from '../enums/normal-balance.enum';

export interface PostingRuleProps {
  allowManualPosting: boolean;
  allowAutomatedPosting: boolean;
  requireDimensionTag: boolean;
  restrictedBalanceDirection?: NormalBalance;
}

export class PostingRule {
  private constructor(private readonly props: PostingRuleProps) {}

  public static create(props: Partial<PostingRuleProps> = {}): PostingRule {
    return new PostingRule({
      allowManualPosting: props.allowManualPosting ?? true,
      allowAutomatedPosting: props.allowAutomatedPosting ?? true,
      requireDimensionTag: props.requireDimensionTag ?? false,
      restrictedBalanceDirection: props.restrictedBalanceDirection,
    });
  }

  public static defaultRule(): PostingRule {
    return new PostingRule({
      allowManualPosting: true,
      allowAutomatedPosting: true,
      requireDimensionTag: false,
    });
  }

  public isManualPostingAllowed(): boolean {
    return this.props.allowManualPosting;
  }

  public isAutomatedPostingAllowed(): boolean {
    return this.props.allowAutomatedPosting;
  }

  public isDimensionTagRequired(): boolean {
    return this.props.requireDimensionTag;
  }

  public getRestrictedBalanceDirection(): NormalBalance | undefined {
    return this.props.restrictedBalanceDirection;
  }

  public equals(other: PostingRule): boolean {
    return (
      this.props.allowManualPosting === other.isManualPostingAllowed() &&
      this.props.allowAutomatedPosting === other.isAutomatedPostingAllowed() &&
      this.props.requireDimensionTag === other.isDimensionTagRequired() &&
      this.props.restrictedBalanceDirection === other.getRestrictedBalanceDirection()
    );
  }
}
