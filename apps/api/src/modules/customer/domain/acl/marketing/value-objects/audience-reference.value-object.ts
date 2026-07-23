import { ValueObject } from '@saas/core';

export interface AudienceReferenceProps { audienceId: string; }

export class AudienceReference extends ValueObject<AudienceReferenceProps> {
  get audienceId(): string { return this.props.audienceId; }
  private constructor(props: AudienceReferenceProps) { super(props); }
  public static create(audienceId: string): AudienceReference {
    return new AudienceReference({ audienceId });
  }
}