import { ICommunicationProfile } from '../entities/communication-profile.interface';
import { IConsentRecord } from '../entities/consent-record.interface';
import { ICommunicationProfileRepository } from '../repositories/communication-profile.repository.interface';
import { PreferredLanguage } from '../value-objects/preferred-language.value-object';
import { PreferredChannel, PreferredChannelValue } from '../value-objects/preferred-channel.value-object';
import { QuietHours } from '../value-objects/quiet-hours.value-object';
import { PrivacyPreference } from '../value-objects/privacy-preference.value-object';
import { ConsentStatus } from '../value-objects/consent-status.value-object';
import {
  CreateCommunicationProfileDto,
  GrantConsentDto,
  RevokeConsentDto,
  QuietHoursDto,
  PrivacyPreferenceDto
} from '../../application/dto/communication-profile.dto';
import {
  validateCreateCommunicationProfile,
  validateGrantConsent,
  validateRevokeConsent
} from '../../application/validation/communication-profile.schema';
import {
  CommunicationProfileCreatedEvent,
  CommunicationConsentGrantedEvent,
  CommunicationConsentRevokedEvent,
  PreferredChannelChangedEvent,
  CommunicationProfileArchivedEvent
} from '../events/communication-profile.events';

export class CommunicationProfileDomainService {
  constructor(private readonly profileRepo: ICommunicationProfileRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private ensureNotArchived(profile: ICommunicationProfile) {
    if (profile.isArchived) {
      throw new Error('Archived profiles are read-only');
    }
  }

  async createProfile(id: string, dto: CreateCommunicationProfileDto): Promise<ICommunicationProfile> {
    const errors = validateCreateCommunicationProfile(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const existing = await this.profileRepo.findByCustomerId(dto.restaurantId, dto.customerId);
    if (existing) {
      throw new Error('Each customer may have only one communication profile');
    }

    const preferredChannels = dto.preferredChannels.map(c => new PreferredChannel(c as PreferredChannelValue));
    const quietHours = dto.quietHours ? new QuietHours(dto.quietHours.startTime, dto.quietHours.endTime) : undefined;
    const privacyPreferences = new PrivacyPreference(
      dto.privacyPreferences.marketingOptIn,
      dto.privacyPreferences.dataSharingOptIn,
      dto.privacyPreferences.trackingOptIn
    );

    const profile: ICommunicationProfile = {
      id,
      restaurantId: dto.restaurantId,
      customerId: dto.customerId,
      preferredLanguage: new PreferredLanguage(dto.preferredLanguage),
      preferredChannels,
      quietHours,
      privacyPreferences,
      consentRecords: [],
      domainEvents: [new CommunicationProfileCreatedEvent(id, dto.customerId)],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.profileRepo.save(profile);
    return profile;
  }

  async grantConsent(profileId: string, dto: GrantConsentDto): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    this.ensureNotArchived(profile);

    const errors = validateGrantConsent(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const existingConsents = profile.consentRecords.filter(c => c.purpose === dto.purpose);
    const lastConsent = existingConsents.length > 0 ? existingConsents[existingConsents.length - 1] : null;

    if (lastConsent && lastConsent.status.value === 'Revoked') {
      throw new Error('Revoked consent cannot be modified');
    }

    // Conceptually, appending a new record is better than mutating in place if records are immutable.
    // The prompt says "Consent records are immutable after creation." So if they want to re-grant, they could push a new record or we just throw if it exists. Let's push a new record or update if it's pending.
    // Actually, appending a new granted record for the same purpose supersedes the old one. We will just append it.
    
    const record: IConsentRecord = {
      id: this.generateId(),
      purpose: dto.purpose,
      status: new ConsentStatus('Granted'),
      grantedAt: new Date(),
      source: dto.source,
      version: dto.version
    };

    profile.consentRecords.push(record);
    profile.updatedAt = new Date();
    profile.domainEvents = profile.domainEvents || [];
    profile.domainEvents.push(new CommunicationConsentGrantedEvent(profile.id, record.id, record.purpose));

    await this.profileRepo.save(profile);
    return profile;
  }

  async revokeConsent(profileId: string, dto: RevokeConsentDto): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    this.ensureNotArchived(profile);

    const errors = validateRevokeConsent(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    // Finding latest consent for this purpose
    const existingConsents = profile.consentRecords.filter(c => c.purpose === dto.purpose);
    const lastConsent = existingConsents.length > 0 ? existingConsents[existingConsents.length - 1] : null;

    if (lastConsent && lastConsent.status.value === 'Revoked') {
      throw new Error('Revoked consent cannot be modified');
    }

    const record: IConsentRecord = {
      id: this.generateId(),
      purpose: dto.purpose,
      status: new ConsentStatus('Revoked'),
      revokedAt: new Date(),
      source: 'System Revocation', // or from dto
      version: lastConsent ? lastConsent.version : '1.0'
    };

    profile.consentRecords.push(record);
    profile.updatedAt = new Date();
    profile.domainEvents = profile.domainEvents || [];
    profile.domainEvents.push(new CommunicationConsentRevokedEvent(profile.id, record.id, record.purpose));

    await this.profileRepo.save(profile);
    return profile;
  }

  async updatePreferredChannels(profileId: string, channels: string[]): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    this.ensureNotArchived(profile);

    if (new Set(channels).size !== channels.length) {
      throw new Error('Preferred channels must be unique');
    }

    profile.preferredChannels = channels.map(c => new PreferredChannel(c as PreferredChannelValue));
    profile.updatedAt = new Date();
    profile.domainEvents = profile.domainEvents || [];
    profile.domainEvents.push(new PreferredChannelChangedEvent(profile.id, channels));

    await this.profileRepo.save(profile);
    return profile;
  }

  async updateQuietHours(profileId: string, dto: QuietHoursDto): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    this.ensureNotArchived(profile);

    profile.quietHours = new QuietHours(dto.startTime, dto.endTime);
    profile.updatedAt = new Date();
    
    await this.profileRepo.save(profile);
    return profile;
  }

  async updatePrivacyPreferences(profileId: string, dto: PrivacyPreferenceDto): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    
    // Privacy preferences are mutable only while the profile is active
    this.ensureNotArchived(profile);

    profile.privacyPreferences = new PrivacyPreference(
      dto.marketingOptIn,
      dto.dataSharingOptIn,
      dto.trackingOptIn
    );
    profile.updatedAt = new Date();

    await this.profileRepo.save(profile);
    return profile;
  }

  async archiveProfile(profileId: string): Promise<ICommunicationProfile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new Error('Profile not found');

    if (!profile.isArchived) {
      profile.isArchived = true;
      profile.updatedAt = new Date();
      profile.domainEvents = profile.domainEvents || [];
      profile.domainEvents.push(new CommunicationProfileArchivedEvent(profile.id));
      await this.profileRepo.save(profile);
    }
    
    return profile;
  }
}
