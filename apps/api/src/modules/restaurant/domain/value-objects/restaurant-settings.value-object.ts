import { OrderingSettings } from './ordering-settings.value-object';
import { DeliverySettings } from './delivery-settings.value-object';
import { PickupSettings } from './pickup-settings.value-object';
import { ReservationSettings } from './reservation-settings.value-object';
import { ContactInformation } from './contact-information.value-object';
import { SocialLinks } from './social-links.value-object';

export class RestaurantSettings {
  constructor(
    public readonly defaultLanguage: string,
    public readonly supportedLanguages: string[],
    public readonly timezone: string,
    public readonly currency: string,
    public readonly country: string,
    public readonly ordering: OrderingSettings,
    public readonly delivery: DeliverySettings,
    public readonly pickup: PickupSettings,
    public readonly reservations: ReservationSettings,
    public readonly contact: ContactInformation,
    public readonly social: SocialLinks,
  ) {
    this.validateLanguage(defaultLanguage, 'defaultLanguage');
    supportedLanguages.forEach(lang => this.validateLanguage(lang, 'supportedLanguage'));
    this.validateCurrency(currency);
    this.validateTimezone(timezone);
  }

  private validateLanguage(language: string, field: string): void {
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(language)) {
      throw new Error(`Invalid language code for ${field}: ${language}`);
    }
  }

  private validateCurrency(currency: string): void {
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error(`Invalid currency code: ${currency}`);
    }
  }

  private validateTimezone(timezone: string): void {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch {
      throw new Error(`Invalid timezone format: ${timezone}`);
    }
  }
}
