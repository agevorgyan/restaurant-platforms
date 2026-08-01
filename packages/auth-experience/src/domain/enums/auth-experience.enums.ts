/**
 * Enterprise Authentication Experience Platform - Domain Enums
 *
 * Defines core domain enumerations for frontend authentication status and session state transitions.
 */

export enum AuthenticationStatus {
  ANONYMOUS = 'ANONYMOUS',
  AUTHENTICATING = 'AUTHENTICATING',
  AUTHENTICATED = 'AUTHENTICATED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  REFRESHING = 'REFRESHING',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}
