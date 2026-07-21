import { Entity } from '@saas/core';
import { ChannelTypeEnum } from '../value-objects/notification-channel-type.value-object';
import { NotificationCategoryEnum } from '../value-objects/notification-category.value-object';
import { NotificationLanguage } from '../value-objects/notification-language.value-object';

export interface CommunicationPreferenceProps {
  userId: string;
  preferredLanguage: NotificationLanguage;
  optedInChannels: ChannelTypeEnum[];
  optedOutCategories: NotificationCategoryEnum[];
  marketingConsent: boolean;
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string; // HH:mm
}

export class CommunicationPreference extends Entity<CommunicationPreferenceProps> {
  private constructor(id: string, props: CommunicationPreferenceProps) {
    super(id, props);
  }

  public static create(id: string, props: CommunicationPreferenceProps): CommunicationPreference {
    return new CommunicationPreference(id, props);
  }

  public allows(channel: ChannelTypeEnum, category: NotificationCategoryEnum): boolean {
    if (category === NotificationCategoryEnum.MARKETING && !this.props.marketingConsent) {
      return false;
    }
    if (this.props.optedOutCategories.includes(category)) {
      return false;
    }
    if (!this.props.optedInChannels.includes(channel)) {
      return false;
    }
    return true;
  }
}
