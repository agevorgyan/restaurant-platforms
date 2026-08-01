/**
 * Enterprise Mobile Hardware Integration Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Hardware Ports & Adapters, Bluetooth Peripheral Discovery,
 * ESC/POS Thermal Receipt Printer Queueing, Barcode/QR Scanning, Camera Capture, and CQRS Read Models.
 */

import { PeripheralStatus, PrinterType } from '../src/domain/enums/mobile-hardware.enums';
import {
  BarcodeResult,
  PeripheralId,
  PeripheralInfo,
  PrinterConfiguration,
  QrCodeResult,
} from '../src/domain/value-objects/mobile-hardware-vo';
import {
  BluetoothService,
  CameraService,
  CapabilityService,
  EnterpriseMobileHardwarePlatformService,
  HardwareService,
  PermissionService,
  PrinterService,
  ScannerService,
} from '../src/services/mobile-hardware.services';

describe('Enterprise Mobile Hardware Integration Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format PeripheralInfo correctly', () => {
      const p = PeripheralInfo.create({ name: 'Epson POS Printer', category: 'Printer', status: PeripheralStatus.CONNECTED });
      expect(p.name).toBe('Epson POS Printer');
      expect(p.category).toBe('Printer');
      expect(p.status).toBe(PeripheralStatus.CONNECTED);
    });

    it('should format PrinterConfiguration correctly', () => {
      const cfg = PrinterConfiguration.create({ printerType: PrinterType.BLUETOOTH_ESC_POS, paperWidthMm: 80 });
      expect(cfg.printerType).toBe(PrinterType.BLUETOOTH_ESC_POS);
      expect(cfg.paperWidthMm).toBe(80);
    });
  });

  describe('Bluetooth & Hardware Discovery Services', () => {
    let bluetoothService: BluetoothService;

    beforeEach(() => {
      bluetoothService = new BluetoothService();
    });

    it('should discover Bluetooth peripherals and handle connection state', async () => {
      const discovered = await bluetoothService.startDiscovery();
      expect(discovered.length).toBeGreaterThan(0);

      const connected = await bluetoothService.connectPeripheral(discovered[0].peripheralId.id);
      expect(connected.status).toBe(PeripheralStatus.CONNECTED);
    });
  });

  describe('PrinterService & ESC/POS Queue', () => {
    let printerService: PrinterService;

    beforeEach(() => {
      printerService = new PrinterService();
    });

    it('should queue ESC/POS print jobs and execute print job runner', async () => {
      const job = printerService.queuePrintJob('p-bt-1', '\x1b\x40 PRINT_TEST');
      expect(job.jobId).toMatch(/^job-/);

      const statusBefore = printerService.getPrinterStatus('p-bt-1');
      expect(statusBefore.queuedJobsCount).toBe(1);

      const executed = await printerService.executeNextJob();
      expect(executed).toBe(true);

      const history = printerService.getPrintHistory();
      expect(history.totalJobsPrinted).toBe(1);
    });
  });

  describe('ScannerService & CameraService', () => {
    let scannerService: ScannerService;
    let cameraService: CameraService;

    beforeEach(() => {
      scannerService = new ScannerService();
      cameraService = new CameraService();
    });

    it('should scan barcodes and QR codes and record scan history', () => {
      const barcodeRes = scannerService.scanBarcode('9780307476463');
      expect(barcodeRes.barcode).toBe('9780307476463');

      const qrRes = scannerService.scanQrCode('https://table.gourmet.com/t-12');
      expect(qrRes.qrData).toContain('table.gourmet.com');

      const history = scannerService.getScannerHistory();
      expect(history.totalScansCount).toBe(2);
    });

    it('should capture photos via CameraService', async () => {
      const capture = await cameraService.capturePhoto();
      expect(capture.uri).toContain('camera-capture');
    });
  });

  describe('EnterpriseMobileHardwarePlatformService & Read Models', () => {
    let bluetoothService: BluetoothService;
    let printerService: PrinterService;
    let scannerService: ScannerService;
    let cameraService: CameraService;
    let permissionService: PermissionService;
    let capabilityService: CapabilityService;
    let hardwareService: HardwareService;
    let platformService: EnterpriseMobileHardwarePlatformService;

    beforeEach(() => {
      bluetoothService = new BluetoothService();
      printerService = new PrinterService();
      scannerService = new ScannerService();
      cameraService = new CameraService();
      permissionService = new PermissionService();
      capabilityService = new CapabilityService();
      hardwareService = new HardwareService(bluetoothService);

      platformService = new EnterpriseMobileHardwarePlatformService(
        hardwareService,
        bluetoothService,
        printerService,
        scannerService,
        cameraService,
        permissionService,
        capabilityService
      );
    });

    it('should query Peripheral Catalog, Permission Overview, and Hardware Statistics read models', async () => {
      const catalog = await hardwareService.getPeripheralCatalog();
      expect(catalog.totalDiscoveredPeripherals).toBe(1);

      const perms = permissionService.getPermissionOverview();
      expect(perms.cameraPermission).toBe('granted');

      const stats = hardwareService.getHardwareStatistics();
      expect(stats.connectedPeripheralsCount).toBe(1);
    });
  });
});
