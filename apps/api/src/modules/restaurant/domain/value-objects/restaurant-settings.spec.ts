import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { OrderingSettings } from './ordering-settings.value-object';
import { DeliverySettings } from './delivery-settings.value-object';
import { PickupSettings } from './pickup-settings.value-object';
import { ReservationSettings } from './reservation-settings.value-object';
import { ContactInformation } from './contact-information.value-object';
import { SocialLinks } from './social-links.value-object';
import { RestaurantSettings } from './restaurant-settings.value-object';

describe('RestaurantSettings Value Objects', () => {
  describe('OrderingSettings', () => {
    it('should create valid ordering settings', () => {
      const ordering = new OrderingSettings(true, true, false, true);
      assert.strictEqual(ordering.dineInEnabled, true);
    });
  });

  describe('DeliverySettings', () => {
    it('should create valid delivery settings', () => {
      const delivery = new DeliverySettings(5, 30, 15, 2.99);
      assert.strictEqual(delivery.deliveryRadius, 5);
    });

    it('should throw on negative values', () => {
      assert.throws(() => new DeliverySettings(-1, 30, 15, 2.99));
      assert.throws(() => new DeliverySettings(5, -30, 15, 2.99));
      assert.throws(() => new DeliverySettings(5, 30, -15, 2.99));
      assert.throws(() => new DeliverySettings(5, 30, 15, -2.99));
    });
  });

  describe('PickupSettings', () => {
    it('should throw on negative time', () => {
      assert.throws(() => new PickupSettings(-10));
    });
  });

  describe('ReservationSettings', () => {
    it('should throw on invalid intervals if enabled', () => {
      assert.throws(() => new ReservationSettings(true, 0, 4));
      assert.throws(() => new ReservationSettings(true, 15, 0));
    });

    it('should not throw on invalid intervals if disabled', () => {
      const settings = new ReservationSettings(false, 0, 0);
      assert.strictEqual(settings.reservationsEnabled, false);
    });
  });

  describe('ContactInformation', () => {
    it('should throw on invalid phone', () => {
      assert.throws(() => new ContactInformation('invalid', 'test@example.com'));
    });

    it('should throw on invalid email', () => {
      assert.throws(() => new ContactInformation('+1234567890', 'invalid-email'));
    });

    it('should throw on invalid website url', () => {
      assert.throws(() => new ContactInformation('+1234567890', 'test@example.com', 'invalid-url'));
    });

    it('should create valid contact info', () => {
      const contact = new ContactInformation('+1234567890', 'test@example.com', 'https://example.com');
      assert.strictEqual(contact.phone, '+1234567890');
    });
  });

  describe('SocialLinks', () => {
    it('should throw on invalid url', () => {
      assert.throws(() => new SocialLinks('invalid'));
    });

    it('should create valid social links', () => {
      const links = new SocialLinks('https://facebook.com', undefined, undefined, 'https://wa.me/123');
      assert.strictEqual(links.facebook, 'https://facebook.com');
      assert.strictEqual(links.whatsapp, 'https://wa.me/123');
    });
  });

  describe('RestaurantSettings', () => {
    const ordering = new OrderingSettings(true, true, true, true);
    const delivery = new DeliverySettings(5, 30, 15, 2.99);
    const pickup = new PickupSettings(15);
    const reservations = new ReservationSettings(true, 15, 4);
    const contact = new ContactInformation('+1234567890', 'test@example.com');
    const social = new SocialLinks();

    it('should create valid RestaurantSettings', () => {
      const settings = new RestaurantSettings(
        'en-US',
        ['en-US', 'es'],
        'America/New_York',
        'USD',
        'US',
        ordering,
        delivery,
        pickup,
        reservations,
        contact,
        social
      );
      assert.strictEqual(settings.currency, 'USD');
    });

    it('should throw on invalid language code', () => {
      assert.throws(() => new RestaurantSettings('english', [], 'UTC', 'USD', 'US', ordering, delivery, pickup, reservations, contact, social));
    });

    it('should throw on invalid currency', () => {
      assert.throws(() => new RestaurantSettings('en-US', [], 'UTC', 'US', 'US', ordering, delivery, pickup, reservations, contact, social));
    });

    it('should throw on invalid timezone', () => {
      assert.throws(() => new RestaurantSettings('en-US', [], 'Invalid/Timezone', 'USD', 'US', ordering, delivery, pickup, reservations, contact, social));
    });
  });
});
