/**
 * Enterprise Mobile Hardware Integration Platform - Domain Events
 *
 * Domain events emitted during peripheral discovery, connection state changes,
 * print job queueing/completion, barcode scanning, and permission grants.
 */

import { PeripheralStatus } from '../enums/mobile-hardware.enums';

export interface PeripheralDiscoveredEvent {
  eventName: 'PeripheralDiscovered';
  peripheralId: string;
  name: string;
  type: string;
  timestamp: Date;
}

export interface PeripheralConnectedEvent {
  eventName: 'PeripheralConnected';
  peripheralId: string;
  status: PeripheralStatus;
  timestamp: Date;
}

export interface PeripheralDisconnectedEvent {
  eventName: 'PeripheralDisconnected';
  peripheralId: string;
  reason?: string;
  timestamp: Date;
}

export interface PrintJobQueuedEvent {
  eventName: 'PrintJobQueued';
  jobId: string;
  printerId: string;
  timestamp: Date;
}

export interface PrintJobCompletedEvent {
  eventName: 'PrintJobCompleted';
  jobId: string;
  printerId: string;
  durationMs: number;
  timestamp: Date;
}

export interface BarcodeScannedEvent {
  eventName: 'BarcodeScanned';
  barcode: string;
  format: string;
  timestamp: Date;
}

export interface QrCodeScannedEvent {
  eventName: 'QrCodeScanned';
  qrData: string;
  timestamp: Date;
}

export interface PermissionGrantedEvent {
  eventName: 'PermissionGranted';
  permissionName: string;
  timestamp: Date;
}

export type MobileHardwareDomainEvent =
  | PeripheralDiscoveredEvent
  | PeripheralConnectedEvent
  | PeripheralDisconnectedEvent
  | PrintJobQueuedEvent
  | PrintJobCompletedEvent
  | BarcodeScannedEvent
  | QrCodeScannedEvent
  | PermissionGrantedEvent;
