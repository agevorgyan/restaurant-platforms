/**
 * Enterprise Mobile Hardware Integration Platform - Value Objects
 *
 * Immutable Value Objects encapsulating peripheral identifiers, metadata, hardware capabilities,
 * printer configs, scanner configs, print jobs, scan results, camera captures, and permissions.
 */

import { PeripheralStatus, PrinterType } from '../enums/mobile-hardware.enums';

/**
 * PeripheralId Value Object
 */
export class PeripheralId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): PeripheralId {
    return new PeripheralId(id || `periph-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * HardwarePermission Value Object
 */
export class HardwarePermission {
  public readonly permissionName: string;
  public readonly isGranted: boolean;

  private constructor(permissionName: string, isGranted: boolean) {
    this.permissionName = permissionName;
    this.isGranted = isGranted;
  }

  public static create(permissionName: string, isGranted: boolean = true): HardwarePermission {
    return new HardwarePermission(permissionName, isGranted);
  }
}

/**
 * DeviceCapability & PeripheralCapabilities Value Objects
 */
export class DeviceCapability {
  public readonly name: string;
  public readonly isSupported: boolean;

  private constructor(name: string, isSupported: boolean) {
    this.name = name;
    this.isSupported = isSupported;
  }

  public static create(name: string, isSupported: boolean = true): DeviceCapability {
    return new DeviceCapability(name, isSupported);
  }
}

export class PeripheralCapabilities {
  public readonly supportsAutoCut: boolean;
  public readonly supportsCashDrawer: boolean;
  public readonly maxPaperWidthMm: number;

  private constructor(supportsAutoCut: boolean, supportsCashDrawer: boolean, maxPaperWidthMm: number) {
    this.supportsAutoCut = supportsAutoCut;
    this.supportsCashDrawer = supportsCashDrawer;
    this.maxPaperWidthMm = maxPaperWidthMm;
  }

  public static defaultThermal(): PeripheralCapabilities {
    return new PeripheralCapabilities(true, true, 80);
  }
}

/**
 * PeripheralInfo Value Object
 */
export class PeripheralInfo {
  public readonly peripheralId: PeripheralId;
  public readonly name: string;
  public readonly category: 'Printer' | 'Scanner' | 'Camera' | 'PaymentDevice' | 'Biometric' | 'Location';
  public readonly status: PeripheralStatus;
  public readonly connectionType: 'Bluetooth' | 'LAN' | 'USB';

  private constructor(peripheralId: PeripheralId, name: string, category: 'Printer' | 'Scanner' | 'Camera' | 'PaymentDevice' | 'Biometric' | 'Location', status: PeripheralStatus, connectionType: 'Bluetooth' | 'LAN' | 'USB') {
    this.peripheralId = peripheralId;
    this.name = name;
    this.category = category;
    this.status = status;
    this.connectionType = connectionType;
  }

  public static create(props: {
    peripheralId?: PeripheralId;
    name: string;
    category?: 'Printer' | 'Scanner' | 'Camera' | 'PaymentDevice' | 'Biometric' | 'Location';
    status?: PeripheralStatus;
    connectionType?: 'Bluetooth' | 'LAN' | 'USB';
  }): PeripheralInfo {
    return new PeripheralInfo(
      props.peripheralId || PeripheralId.create(),
      props.name,
      props.category || 'Printer',
      props.status || PeripheralStatus.DISCONNECTED,
      props.connectionType || 'Bluetooth'
    );
  }
}

/**
 * PrinterConfiguration Value Object
 */
export class PrinterConfiguration {
  public readonly printerType: PrinterType;
  public readonly ipAddress?: string;
  public readonly bluetoothAddress?: string;
  public readonly paperWidthMm: number;

  private constructor(printerType: PrinterType, paperWidthMm: number, ipAddress?: string, bluetoothAddress?: string) {
    this.printerType = printerType;
    this.paperWidthMm = paperWidthMm;
    this.ipAddress = ipAddress;
    this.bluetoothAddress = bluetoothAddress;
  }

  public static create(props: {
    printerType?: PrinterType;
    paperWidthMm?: number;
    ipAddress?: string;
    bluetoothAddress?: string;
  } = {}): PrinterConfiguration {
    return new PrinterConfiguration(
      props.printerType || PrinterType.BLUETOOTH_ESC_POS,
      props.paperWidthMm || 80,
      props.ipAddress,
      props.bluetoothAddress || '00:11:22:33:44:55'
    );
  }
}

/**
 * PrintJob Value Object
 */
export class PrintJob {
  public readonly jobId: string;
  public readonly targetPrinterId: string;
  public readonly rawEscPosContent: string;
  public readonly createdAt: Date;

  private constructor(jobId: string, targetPrinterId: string, rawEscPosContent: string) {
    this.jobId = jobId;
    this.targetPrinterId = targetPrinterId;
    this.rawEscPosContent = rawEscPosContent;
    this.createdAt = new Date();
  }

  public static create(targetPrinterId: string, rawEscPosContent: string): PrintJob {
    return new PrintJob(`job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, targetPrinterId, rawEscPosContent);
  }
}

/**
 * BarcodeResult & QrCodeResult & ScannerConfiguration Value Objects
 */
export class ScannerConfiguration {
  public readonly isContinuousScan: boolean;
  public readonly enableVibration: boolean;

  private constructor(isContinuousScan: boolean, enableVibration: boolean) {
    this.isContinuousScan = isContinuousScan;
    this.enableVibration = enableVibration;
  }

  public static create(isContinuousScan: boolean = false, enableVibration: boolean = true): ScannerConfiguration {
    return new ScannerConfiguration(isContinuousScan, enableVibration);
  }
}

export class BarcodeResult {
  public readonly barcode: string;
  public readonly format: string;
  public readonly scannedAt: Date;

  private constructor(barcode: string, format: string) {
    this.barcode = barcode;
    this.format = format;
    this.scannedAt = new Date();
  }

  public static create(barcode: string, format: string = 'CODE_128'): BarcodeResult {
    return new BarcodeResult(barcode, format);
  }
}

export class QrCodeResult {
  public readonly qrData: string;
  public readonly scannedAt: Date;

  private constructor(qrData: string) {
    this.qrData = qrData;
    this.scannedAt = new Date();
  }

  public static create(qrData: string): QrCodeResult {
    return new QrCodeResult(qrData);
  }
}

/**
 * CameraCapture Value Object
 */
export class CameraCapture {
  public readonly uri: string;
  public readonly width: number;
  public readonly height: number;
  public readonly capturedAt: Date;

  private constructor(uri: string, width: number, height: number) {
    this.uri = uri;
    this.width = width;
    this.height = height;
    this.capturedAt = new Date();
  }

  public static create(uri: string, width: number = 1920, height: number = 1080): CameraCapture {
    return new CameraCapture(uri, width, height);
  }
}
