/**
 * Enterprise Authentication Experience Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Session Overview, Organization List, Device Sessions,
 * Authentication History, and Invitation Status.
 */

import { AuthenticationStatus, SessionStatus } from '../domain/enums/auth-experience.enums';

export interface SessionOverviewReadModel {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentOrgId: string;
  currentOrgName: string;
  status: SessionStatus;
  expiresAt: string;
  isWarningActive: boolean;
}

export interface OrganizationSummaryReadModel {
  orgId: string;
  orgName: string;
  orgSlug: string;
  isCurrent: boolean;
  userRole: string;
}

export interface OrganizationListReadModel {
  userId: string;
  totalOrganizations: number;
  organizations: OrganizationSummaryReadModel[];
}

export interface DeviceSessionReadModel {
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
}

export interface DeviceSessionsReadModel {
  userId: string;
  totalActiveDevices: number;
  devices: DeviceSessionReadModel[];
}

export interface AuthenticationHistoryEntry {
  logId: string;
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'MFA_CHALLENGE' | 'ORG_SWITCH' | 'SESSION_REFRESH';
  status: AuthenticationStatus;
  ipAddress: string;
  timestamp: string;
}

export interface AuthenticationHistoryReadModel {
  userId: string;
  totalLogs: number;
  history: AuthenticationHistoryEntry[];
}

export interface InvitationStatusReadModel {
  invitationId: string;
  email: string;
  orgName: string;
  role: string;
  isAccepted: boolean;
  expiresAt: string;
}
