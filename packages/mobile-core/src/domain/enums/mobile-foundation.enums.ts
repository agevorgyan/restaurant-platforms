/**
 * Enterprise Mobile Foundation Platform - Domain Enums
 *
 * Defines core domain enumerations for mobile device types and native application lifecycle states.
 */

export enum DeviceType {
  PHONE = 'PHONE',
  TABLET = 'TABLET',
  HANDHELD_POS = 'HANDHELD_POS',
  KIOSK = 'KIOSK',
  SCANNER = 'SCANNER',
}

export enum AppState {
  LAUNCHING = 'LAUNCHING',
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
}
