import { 
  PushMessage,
  PushDelivery,
  PushStatistics,
  ProviderHealth,
  RegisteredDevice
} from '../read-models';

export interface IPushProvider {
  name: string;
  isAvailable(): boolean;
  sendPush(message: PushMessage): Promise<string>;
}

export class MockFcmProvider implements IPushProvider {
  name = 'FCM';
  isAvailable() { return true; }
  async sendPush(message: PushMessage): Promise<string> {
    console.log(`[FCM] Sending push to ${message.recipientToken}`);
    return `fcm-${crypto.randomUUID()}`;
  }
}

export class MockApnsProvider implements IPushProvider {
  name = 'APNS';
  isAvailable() { return true; }
  async sendPush(message: PushMessage): Promise<string> {
    console.log(`[APNS] Sending push to ${message.recipientToken}`);
    return `apns-${crypto.randomUUID()}`;
  }
}

export class TokenValidationService {
  public isValid(token: string): boolean {
    return token && token.length > 10;
  }
}

export class DeviceRegistrationService {
  private devices: Map<string, RegisteredDevice> = new Map();

  public async registerDevice(device: RegisteredDevice): Promise<void> {
    this.devices.set(device.token, device);
    console.log(`[DeviceRegistrationService] Registered device ${device.deviceId}`);
  }

  public async unregisterDevice(token: string): Promise<void> {
    const device = this.devices.get(token);
    if (device) {
      device.isActive = false;
      this.devices.set(token, device);
      console.log(`[DeviceRegistrationService] Unregistered device token ${token}`);
    }
  }

  public async getDeviceByToken(token: string): Promise<RegisteredDevice | null> {
    return this.devices.get(token) || null;
  }
}

export class ProviderHealthService {
  public getHealth(providerName: string): ProviderHealth {
    return {
      providerName,
      isAvailable: true,
      latencyMs: 45,
      errorRatePercentage: 0.01,
      lastCheckedAt: new Date()
    };
  }
}

export class PushProviderRegistry {
  private providers: Map<string, IPushProvider> = new Map();

  constructor(private readonly healthService: ProviderHealthService) {
    this.providers.set('FCM', new MockFcmProvider());
    this.providers.set('APNS', new MockApnsProvider());
  }

  public getProviderForPlatform(platform: string): IPushProvider {
    let providerName = 'FCM';
    if (platform === 'IOS') {
      providerName = 'APNS';
    }
    
    const provider = this.providers.get(providerName);
    if (!provider || !this.healthService.getHealth(providerName).isAvailable) {
      throw new Error(`No push provider available for platform ${platform}`);
    }
    return provider;
  }

  public getAllProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export class PushTrackingService {
  public async recordDelivery(delivery: PushDelivery): Promise<void> {
    console.log(`[PushTrackingService] Push delivered via ${delivery.providerName}, id: ${delivery.providerMessageId}`);
  }

  public getStatistics(): PushStatistics {
    return {
      tenantId: 'global',
      period: new Date().toISOString().slice(0, 7),
      totalSent: 25000,
      totalDelivered: 24500,
      totalFailed: 200,
      totalUnregistered: 300,
      deliveryRatePercentage: 98.0,
      averageLatencyMs: 85
    };
  }
}

export class PushDeliveryService {
  constructor(
    private readonly registry: PushProviderRegistry,
    private readonly registrationService: DeviceRegistrationService,
    private readonly tokenValidator: TokenValidationService,
    private readonly tracking: PushTrackingService
  ) {}

  public async dispatchPush(message: PushMessage): Promise<PushDelivery> {
    if (!message.recipientToken || !this.tokenValidator.isValid(message.recipientToken)) {
      throw new Error('Invalid device token');
    }

    const device = await this.registrationService.getDeviceByToken(message.recipientToken);
    
    // Default to FCM if device unknown (e.g. testing)
    const platform = device ? device.platform : 'ANDROID';
    const provider = this.registry.getProviderForPlatform(platform);

    try {
      const providerMessageId = await provider.sendPush(message);

      const delivery: PushDelivery = {
        deliveryId: crypto.randomUUID(),
        pushId: message.pushId,
        providerName: provider.name as any,
        providerMessageId,
        dispatchedAt: new Date()
      };

      await this.tracking.recordDelivery(delivery);
      return delivery;
    } catch (error: any) {
      // Simulate token cleanup on Unregistered/NotRegistered error
      if (error.message?.includes('Unregistered') || error.message?.includes('NotRegistered')) {
        await this.registrationService.unregisterDevice(message.recipientToken);
      }
      throw error;
    }
  }
}
