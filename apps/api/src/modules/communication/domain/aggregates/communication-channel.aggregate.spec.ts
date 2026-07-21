import { CommunicationChannel } from './communication-channel.aggregate';
import { ChannelTypeEnum } from '../value-objects/notification-channel-type.value-object';

describe('CommunicationChannel Aggregate', () => {
  describe('Creation', () => {
    it('should create a valid communication channel disabled by default', () => {
      const channel = CommunicationChannel.create('chan-1', ChannelTypeEnum.EMAIL, 'System Email', 'SendGrid', false);
      
      expect(channel.channelId).toBe('chan-1');
      expect(channel.type).toBe(ChannelTypeEnum.EMAIL);
      expect(channel.name).toBe('System Email');
      expect(channel.providerName).toBe('SendGrid');
      expect(channel.isEnabled).toBe(false);
      expect(channel.isSystemRequired).toBe(false);
    });

    it('should throw an error if name is empty', () => {
      expect(() => CommunicationChannel.create('chan-1', ChannelTypeEnum.EMAIL, ''))
        .toThrow('Channel name cannot be empty');
    });
  });

  describe('Enable and Disable', () => {
    let channel: CommunicationChannel;

    beforeEach(() => {
      channel = CommunicationChannel.create('chan-1', ChannelTypeEnum.SMS, 'System SMS', 'Twilio', false);
    });

    it('should enable a channel successfully', () => {
      channel.enable();
      expect(channel.isEnabled).toBe(true);
      expect(channel.domainEvents.some(e => e.constructor.name === 'CommunicationChannelEnabled')).toBe(true);
    });

    it('should disable a channel successfully if not system required', () => {
      channel.enable(); // Enable first
      channel.disable();
      expect(channel.isEnabled).toBe(false);
      expect(channel.domainEvents.some(e => e.constructor.name === 'CommunicationChannelDisabled')).toBe(true);
    });

    it('should throw an error when disabling a system required channel', () => {
      channel.enable();
      channel.markAsSystemRequired();
      
      expect(() => channel.disable()).toThrow('Cannot disable a communication channel that is currently required by active workflows');
    });
  });
});
