/**
 * Enterprise Frontend Architecture Platform - Domain Enums
 *
 * Defines core domain enumerations for route access classification and feature module lifecycle status.
 */

export enum RouteType {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  ADMIN = 'ADMIN',
  TENANT = 'TENANT',
  SYSTEM = 'SYSTEM',
}

export enum ModuleStatus {
  EXPERIMENTAL = 'EXPERIMENTAL',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}
