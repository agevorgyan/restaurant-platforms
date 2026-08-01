/**
 * Enterprise Mobile Hardware Integration Platform - Domain Enums
 *
 * Defines core domain enumerations for hardware peripheral statuses and ESC/POS printer types.
 */

export enum PeripheralStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR',
}

export enum PrinterType {
  BLUETOOTH_ESC_POS = 'BLUETOOTH_ESC_POS',
  NETWORK_ESC_POS = 'NETWORK_ESC_POS',
  USB_ESC_POS = 'USB_ESC_POS',
  VENDOR_SDK = 'VENDOR_SDK',
}
