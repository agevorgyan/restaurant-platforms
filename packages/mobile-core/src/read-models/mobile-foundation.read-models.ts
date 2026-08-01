/**
 * Enterprise Mobile Foundation Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Device Catalog, Hardware Capability Catalog,
 * App Lifecycle History, Mobile Navigation History, and Permission Status.
 */

import { AppState, DeviceType } from '../domain/enums/mobile-foundation.enums';

export interface DeviceSummaryReadModel {
  deviceId: string;
  deviceType: DeviceType;
  osName: string;
  osVersion: string;
  modelName: string;
}

export interface DeviceCatalogReadModel {
  totalDevicesRegistered: number;
  devices: DeviceSummaryReadModel[];
}

export interface CapabilitySummaryReadModel {
  name: string;
  isAvailable: boolean;
  isGranted: boolean;
}

export interface CapabilityCatalogReadModel {
  totalCapabilitiesCount: number;
  capabilities: CapabilitySummaryReadModel[];
}

export interface LifecycleEventEntry {
  state: AppState;
  timestamp: string;
}

export interface LifecycleHistoryReadModel {
  totalStateTransitionsCount: number;
  currentState: AppState;
  history: LifecycleEventEntry[];
}

export interface MobileNavigationEntry {
  routePath: string;
  timestamp: string;
}

export interface NavigationHistoryReadModel {
  totalNavigationsCount: number;
  history: MobileNavigationEntry[];
}

export interface PermissionStatusReadModel {
  cameraPermission: 'granted' | 'denied' | 'undetermined';
  locationPermission: 'granted' | 'denied' | 'undetermined';
  notificationsPermission: 'granted' | 'denied' | 'undetermined';
  bluetoothPermission: 'granted' | 'denied' | 'undetermined';
  biometricsPermission: 'granted' | 'denied' | 'undetermined';
}
