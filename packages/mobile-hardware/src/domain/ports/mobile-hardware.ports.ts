/**
 * Enterprise Mobile Hardware Integration Platform - Ports (API Contracts)
 *
 * Vendor-independent hardware interfaces enforcing Ports & Adapters architecture.
 */

import { BarcodeResult, CameraCapture, PeripheralInfo, PrintJob, QrCodeResult } from '../value-objects/mobile-hardware-vo';

export interface PrinterPort {
  connectPrinter(printerId: string): Promise<boolean>;
  printReceipt(job: PrintJob): Promise<boolean>;
  getPrinterStatus(printerId: string): Promise<string>;
}

export interface ScannerPort {
  startScan(): Promise<BarcodeResult | QrCodeResult>;
  stopScan(): Promise<void>;
}

export interface CameraPort {
  capturePhoto(): Promise<CameraCapture>;
}

export interface BluetoothPort {
  startDiscovery(): Promise<PeripheralInfo[]>;
  stopDiscovery(): Promise<void>;
  connectPeripheral(peripheralId: string): Promise<boolean>;
}

export interface BiometricPort {
  isBiometricAvailable(): Promise<boolean>;
  authenticateBiometric(): Promise<boolean>;
}

export interface LocationPort {
  getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }>;
}
