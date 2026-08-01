/**
 * Enterprise Mobile Authentication Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Hardware-Backed Secure Token Storage (Expo SecureStore),
 * Biometric FaceID/TouchID Challenge & Unlock, Trusted Device Registration, Deep Link Token Extraction, Zero-Logout Organization Switching, and CQRS Read Models.
 */

import { AuthenticationStatus, BiometricType } from '../src/domain/enums/mobile-auth.enums';
import {
  BiometricCapability,
  DeviceIdentity,
  MobileSession,
  OrganizationContext,
  SecureCredential,
  SessionExpiration,
} from '../src/domain/value-objects/mobile-auth-vo';
import {
  BiometricService,
  DeepLinkAuthService,
  DeviceTrustService,
  EnterpriseMobileAuthPlatformService,
  MobileAuthenticationService,
  MobileSessionService,
  SecureStorageService,
} from '../src/services/mobile-auth.services';

describe('Enterprise Mobile Authentication Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format BiometricCapability and DeviceIdentity correctly', () => {
      const cap = BiometricCapability.create(BiometricType.FACE_ID, true);
      expect(cap.type).toBe(BiometricType.FACE_ID);
      expect(cap.isEnrolled).toBe(true);

      const identity = DeviceIdentity.create({ deviceName: 'iPad Air KDS' });
      expect(identity.deviceName).toBe('iPad Air KDS');
    });

    it('should calculate SessionExpiration status correctly', () => {
      const expActive = SessionExpiration.create(new Date(Date.now() + 3600000));
      expect(expActive.isExpired).toBe(false);

      const expPassed = SessionExpiration.create(new Date(Date.now() - 1000));
      expect(expPassed.isExpired).toBe(true);
    });
  });

  describe('SecureStorage & Biometric Services', () => {
    let secureStorage: SecureStorageService;
    let biometricService: BiometricService;

    beforeEach(() => {
      secureStorage = new SecureStorageService();
      biometricService = new BiometricService();
    });

    it('should store and retrieve encrypted credentials in Expo SecureStore replacement', async () => {
      await secureStorage.saveCredential('refreshToken', 'rt-secret-12345');
      const retrieved = await secureStorage.getCredential('refreshToken');

      expect(retrieved).toBe('rt-secret-12345');

      await secureStorage.deleteCredential('refreshToken');
      expect(await secureStorage.getCredential('refreshToken')).toBeUndefined();
    });

    it('should evaluate biometric capability and verify biometric unlock challenge', async () => {
      const status = biometricService.getBiometricStatus();
      expect(status.isAvailable).toBe(true);
      expect(status.biometricType).toBe(BiometricType.FACE_ID);

      const success = await biometricService.authenticateBiometric();
      expect(success).toBe(true);
    });
  });

  describe('DeviceTrustService & DeepLinkAuthService', () => {
    let trustService: DeviceTrustService;
    let deepLinkAuthService: DeepLinkAuthService;

    beforeEach(() => {
      trustService = new DeviceTrustService();
      deepLinkAuthService = new DeepLinkAuthService();
    });

    it('should register and evaluate trusted device score', () => {
      const identity = DeviceIdentity.create({ deviceId: 'dev-waiter-99' });
      trustService.registerDevice(identity);

      expect(trustService.isDeviceTrusted('dev-waiter-99')).toBe(true);

      const readModel = trustService.getTrustedDevices('usr-100');
      expect(readModel.totalTrustedDevices).toBe(2);
    });

    it('should extract auth tokens from deep link URLs', () => {
      const token = deepLinkAuthService.resolveAuthTokenFromUrl('restaurant-erp://auth/magic-link?token=magic-tok-777');
      expect(token).toBe('magic-tok-777');
    });
  });

  describe('MobileAuthenticationService & Zero-Logout Org Switcher', () => {
    let secureStorage: SecureStorageService;
    let sessionService: MobileSessionService;
    let biometricService: BiometricService;
    let authService: MobileAuthenticationService;

    beforeEach(() => {
      secureStorage = new SecureStorageService();
      sessionService = new MobileSessionService();
      biometricService = new BiometricService();
      authService = new MobileAuthenticationService(secureStorage, sessionService, biometricService);
    });

    it('should perform mobile user login and store refresh token securely', async () => {
      const ctx = await authService.login('user-waiter-10', 'tenant-bistro');
      expect(ctx.status).toBe(AuthenticationStatus.AUTHENTICATED);

      const savedToken = await secureStorage.getCredential('refreshToken');
      expect(savedToken).toMatch(/^rt-/);
    });

    it('should unlock locked mobile session with biometrics', async () => {
      await authService.login('user-manager-1', 'tenant-bistro');

      const unlocked = await authService.unlockWithBiometrics();
      expect(unlocked).toBe(true);
      expect(authService.getAuthContext().status).toBe(AuthenticationStatus.AUTHENTICATED);
    });

    it('should switch organization without forcing re-login', async () => {
      await authService.login('user-manager-1', 'tenant-bistro');

      const switchedSess = await authService.switchOrganization('org-express-2', 'Express Diner Branch');
      expect(switchedSess.currentOrg.orgId).toBe('org-express-2');
      expect(switchedSess.currentOrg.orgName).toBe('Express Diner Branch');
    });
  });

  describe('EnterpriseMobileAuthPlatformService & Read Models', () => {
    let secureStorage: SecureStorageService;
    let sessionService: MobileSessionService;
    let biometricService: BiometricService;
    let trustService: DeviceTrustService;
    let deepLinkAuthService: DeepLinkAuthService;
    let authService: MobileAuthenticationService;
    let platformService: EnterpriseMobileAuthPlatformService;

    beforeEach(() => {
      secureStorage = new SecureStorageService();
      sessionService = new MobileSessionService();
      biometricService = new BiometricService();
      trustService = new DeviceTrustService();
      deepLinkAuthService = new DeepLinkAuthService();
      authService = new MobileAuthenticationService(secureStorage, sessionService, biometricService);

      platformService = new EnterpriseMobileAuthPlatformService(
        secureStorage,
        biometricService,
        trustService,
        deepLinkAuthService,
        sessionService,
        authService
      );
    });

    it('should query Organization List and Mobile Authentication History read models', () => {
      const orgs = platformService.getOrganizationList('usr-100');
      expect(orgs.totalOrganizations).toBe(2);

      const history = platformService.getAuthenticationHistory('usr-100');
      expect(history.totalLogs).toBe(2);
    });
  });
});
