export type PreferredChannelValue = 'Email' | 'SMS' | 'Push' | 'WhatsApp' | 'Viber' | 'Phone';

export class PreferredChannel {
  constructor(public readonly value: PreferredChannelValue) {
    const validChannels = ['Email', 'SMS', 'Push', 'WhatsApp', 'Viber', 'Phone'];
    if (!validChannels.includes(value)) {
      throw new Error(`Invalid preferred channel: ${value}`);
    }
  }
}
