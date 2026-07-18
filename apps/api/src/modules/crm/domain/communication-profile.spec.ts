import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { PreferredChannel } from './value-objects/preferred-channel.value-object';
import { PreferredLanguage } from './value-objects/preferred-language.value-object';
import { QuietHours } from './value-objects/quiet-hours.value-object';
import { ConsentStatus } from './value-objects/consent-status.value-object';
import { PrivacyPreference } from './value-objects/privacy-preference.value-object';
import { CommunicationProfileDomainService } from './services/communication-profile.domain.service';
import { ICommunicationProfileRepository } from './repositories/communication-profile.repository.interface';
import { ICommunicationProfile } from './entities/communication-profile.interface';
import { validateCreateCommunicationProfile, validateGrantConsent } from '../application/validation/communication-profile.schema';

describe('Communication Profile Domain', () => {
  describe('Value Objects', () => {
    it('PreferredChannel should validate', () => {
      assert.doesNotThrow(() => new PreferredChannel('Email'));
      assert.throws(() => new PreferredChannel('Post' as any));
    });

    it('PreferredLanguage should validate', () => {
      assert.doesNotThrow(() => new PreferredLanguage('en'));
      assert.throws(() => new PreferredLanguage(''));
    });

    it('QuietHours should validate format', () => {
      assert.doesNotThrow(() => new QuietHours('22:00', '08:00'));
      assert.throws(() => new QuietHours('25:00', '08:00'));
    });

    it('ConsentStatus should validate', () => {
      assert.doesNotThrow(() => new ConsentStatus('Granted'));
      assert.throws(() => new ConsentStatus('Unknown' as any));
    });

    it('PrivacyPreference should accept booleans', () => {
      const p = new PrivacyPreference(true, false, true);
      assert.strictEqual(p.marketingOptIn, true);
    });
  });

  describe('Validation', () => {
    it('should validate CreateCommunicationProfileDto', () => {
      const err = validateCreateCommunicationProfile({
        restaurantId: 'r1',
        customerId: 'c1',
        preferredLanguage: 'en',
        preferredChannels: ['Email', 'Email'],
        privacyPreferences: { marketingOptIn: true, dataSharingOptIn: false, trackingOptIn: false }
      });
      assert.ok(err.includes('Preferred channels must be unique'));
    });

    it('should validate GrantConsentDto', () => {
      const err = validateGrantConsent({ purpose: '', source: '', version: '' });
      assert.strictEqual(err.length, 3);
    });
  });

  describe('CommunicationProfileDomainService', () => {
    let mockProfiles: ICommunicationProfile[] = [];
    const mockRepo: ICommunicationProfileRepository = {
      findById: async (id) => mockProfiles.find(p => p.id === id) || null,
      findByCustomerId: async (rid, cid) => mockProfiles.find(p => p.restaurantId === rid && p.customerId === cid) || null,
      save: async (p) => {
        const i = mockProfiles.findIndex(mp => mp.id === p.id);
        if (i >= 0) mockProfiles[i] = p;
        else mockProfiles.push(p);
      }
    };
    const service = new CommunicationProfileDomainService(mockRepo);

    beforeEach(() => {
      mockProfiles = [];
    });

    it('should enforce one profile per customer', async () => {
      await service.createProfile('p1', {
        restaurantId: 'r1',
        customerId: 'c1',
        preferredLanguage: 'en',
        preferredChannels: ['Email'],
        privacyPreferences: { marketingOptIn: true, dataSharingOptIn: true, trackingOptIn: true }
      });

      try {
        await service.createProfile('p2', {
          restaurantId: 'r1',
          customerId: 'c1',
          preferredLanguage: 'es',
          preferredChannels: ['SMS'],
          privacyPreferences: { marketingOptIn: true, dataSharingOptIn: true, trackingOptIn: true }
        });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Each customer may have only one communication profile');
      }
    });

    it('should manage consent properly and strictly enforce immutability behavior', async () => {
      await service.createProfile('p1', {
        restaurantId: 'r1',
        customerId: 'c1',
        preferredLanguage: 'en',
        preferredChannels: ['Email'],
        privacyPreferences: { marketingOptIn: true, dataSharingOptIn: true, trackingOptIn: true }
      });

      let profile = await service.grantConsent('p1', { purpose: 'Marketing', source: 'Web', version: 'v1' });
      assert.strictEqual(profile.consentRecords.length, 1);
      assert.strictEqual(profile.consentRecords[0].status.value, 'Granted');

      profile = await service.revokeConsent('p1', { purpose: 'Marketing' });
      assert.strictEqual(profile.consentRecords.length, 2);
      assert.strictEqual(profile.consentRecords[1].status.value, 'Revoked');

      try {
        await service.grantConsent('p1', { purpose: 'Marketing', source: 'Web', version: 'v1' });
        assert.fail('Should throw revoked modification');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Revoked consent cannot be modified');
      }
    });

    it('should update quiet hours and channels', async () => {
      await service.createProfile('p1', {
        restaurantId: 'r1',
        customerId: 'c1',
        preferredLanguage: 'en',
        preferredChannels: ['Email'],
        privacyPreferences: { marketingOptIn: true, dataSharingOptIn: true, trackingOptIn: true }
      });

      const profile = await service.updateQuietHours('p1', { startTime: '22:00', endTime: '08:00' });
      assert.strictEqual(profile.quietHours?.startTime, '22:00');

      const updatedChannels = await service.updatePreferredChannels('p1', ['SMS', 'Push']);
      assert.strictEqual(updatedChannels.preferredChannels[0].value, 'SMS');

      try {
        await service.updatePreferredChannels('p1', ['SMS', 'SMS']);
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Preferred channels must be unique');
      }
    });

    it('should enforce read-only on archived profiles', async () => {
      await service.createProfile('p1', {
        restaurantId: 'r1',
        customerId: 'c1',
        preferredLanguage: 'en',
        preferredChannels: ['Email'],
        privacyPreferences: { marketingOptIn: true, dataSharingOptIn: true, trackingOptIn: true }
      });

      await service.archiveProfile('p1');

      try {
        await service.updateQuietHours('p1', { startTime: '22:00', endTime: '08:00' });
        assert.fail('Should throw archived');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Archived profiles are read-only');
      }
    });
  });
});
