export type EventId = string;
export type EventName = string;
export type EventType = string;
export type EventVersion = string;
export type AggregateVersion = number;
export type CorrelationId = string;
export type CausationId = string;
export type TraceId = string;

export enum EventCompatibility {
  Compatible = 'Compatible',
  BackwardCompatible = 'BackwardCompatible',
  ForwardCompatible = 'ForwardCompatible',
  Breaking = 'Breaking',
  Unsupported = 'Unsupported'
}
