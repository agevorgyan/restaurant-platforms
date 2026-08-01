/**
 * Enterprise Mobile Authentication Platform - Domain Enums
 *
 * Defines core domain enumerations for mobile authentication status and hardware biometric types.
 */

export enum AuthenticationStatus {
  ANONYMOUS = 'ANONYMOUS',
  AUTHENTICATING = 'AUTHENTICATING',
  AUTHENTICATED = 'AUTHENTICATED',
  BIOMETRIC_REQUIRED = 'BIOMETRIC_REQUIRED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
}

export enum BiometricType {
  FACE_ID = 'FACE_ID',
  TOUCH_ID = 'TOUCH_ID',
  FINGERPRINT = 'FINGERPRINT',
  DEVICE_CREDENTIAL = 'DEVICE_CREDENTIAL',
  NONE = 'NONE',
}
