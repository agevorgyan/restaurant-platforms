/**
 * Enterprise Mobile Hardware Integration Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Peripheral Catalog, Printer Status, Scanner History,
 * Print History, Hardware Statistics, and Permission Overview.
 */

import { PeripheralStatus, PrinterType } from '../domain/enums/mobile-hardware.enums';

export interface PeripheralSummaryReadModel {
  peripheralId: string;
  name: string;
  category: string;
  status: PeripheralStatus;
  connectionType: string;
}

export interface PeripheralCatalogReadModel {
  totalDiscoveredPeripherals: number;
  peripherals: PeripheralSummaryReadModel[];
}

export interface PrinterStatusReadModel {
  printerId: string;
  name: string;
  printerType: PrinterType;
  status: PeripheralStatus;
  queuedJobsCount: number;
  isPaperLow: boolean;
}

export interface ScannerHistoryEntryReadModel {
  scanId: string;
  data: string;
  type: 'BARCODE' | 'QR_CODE';
  scannedAt: string;
}

export interface ScannerHistoryReadModel {
  totalScansCount: number;
  history: ScannerHistoryEntryReadModel[];
}

export interface PrintHistoryEntryReadModel {
  jobId: string;
  printerId: string;
  status: 'COMPLETED' | 'FAILED';
  durationMs: number;
  printedAt: string;
}

export interface PrintHistoryReadModel {
  totalJobsPrinted: number;
  history: PrintHistoryEntryReadModel[];
}

export interface HardwareStatisticsReadModel {
  connectedPeripheralsCount: number;
  totalPrintJobsCount: number;
  totalScansCount: number;
  hardwareFailuresCount: number;
}

export interface PermissionOverviewReadModel {
  cameraPermission: 'granted' | 'denied';
  bluetoothPermission: 'granted' | 'denied';
  locationPermission: 'granted' | 'denied';
}
