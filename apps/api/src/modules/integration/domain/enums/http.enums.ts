/**
 * Enterprise HTTP & API Integration Platform - Domain Enums
 */

export enum RequestStatus {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMED_OUT = 'TIMED_OUT',
}

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum AuthenticationType {
  API_KEY = 'API_KEY',
  BEARER_TOKEN = 'BEARER_TOKEN',
  OAUTH2 = 'OAUTH2',
  JWT = 'JWT',
  BASIC_AUTH = 'BASIC_AUTH',
  MTLS = 'MTLS',
}

export enum ProtocolType {
  REST = 'REST',
  GRAPHQL = 'GRAPHQL',
  GRPC = 'GRPC',
  WEBSOCKET = 'WEBSOCKET',
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
}
