/**
 * Enterprise Mobile Authentication Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Mobile Session Overview, Trusted Devices,
 * Biometric Status, Authentication History, and Organization List.
 */

import { AuthenticationStatus, BiometricType } from '../domain/enums/mobile-auth.enums';

export interface MobileSessionOverviewReadModel {
  sessionId: string;
  userId: string;
  tenantId: string;
  currentOrgId: string;
  currentOrgName: string;
  status: AuthenticationStatus;
  isBiometricLocked: boolean;
  expiresAt: string;
}

export interface TrustedDeviceSummaryReadModel {
  deviceId: string;
  deviceName: string;
  platform: string;
  isTrusted: boolean;
  trustScore: number;
  registeredAt: string;
}

export interface TrustedDevicesReadModel {
  userId: string;
  totalTrustedDevices: number;
  devices: TrustedDeviceSummaryReadModel[];
}

export interface BiometricStatusReadModel {
  biometricType: BiometricType;
  isAvailable: boolean;
  isEnrolled: boolean;
  isBiometricUnlockEnabled: boolean;
}

export interface MobileAuthHistoryEntry {
  logId: string;
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'BIOMETRIC_UNLOCK' | 'ORG_SWITCH' | 'SESSION_REFRESH';
  status: AuthenticationStatus;
  timestamp: string;
}

export interface MobileAuthenticationHistoryReadModel {
  userId: string;
  totalLogs: number;
  history: MobileAuthHistoryEntry[];
}

export interface OrganizationSummaryReadModel {
  orgId: string;
  orgName: string;
  isCurrent: boolean;
  userRole: string;
}

export interface MobileOrganizationListReadModel {
  userId: string;
  totalOrganizations: number;
  organizations: OrganizationSummaryReadModel[];
}
