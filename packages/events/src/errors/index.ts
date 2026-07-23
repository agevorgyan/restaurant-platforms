export class EventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnknownEventError extends EventError {}
export class DuplicateEventError extends EventError {}
export class InvalidEventVersionError extends EventError {}
export class SerializationError extends EventError {}
export class ReplayError extends EventError {}
export class DispatchError extends EventError {}
