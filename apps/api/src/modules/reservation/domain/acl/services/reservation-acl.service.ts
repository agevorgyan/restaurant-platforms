import { ReservationContractType } from '../value-objects/reservation-contract-type.value-object';
import { ReservationIntegrationContext } from '../value-objects/reservation-integration-context.value-object';
import { ReservationTranslationResult } from '../value-objects/reservation-translation-result.value-object';

import { ReservationContractRegistry } from './reservation-contract-registry.service';
import { ReservationVersionNegotiator } from './reservation-version-negotiator.service';
import { ReservationContractValidator } from './reservation-contract-validator.service';
import { ReservationReferenceResolver } from './reservation-reference-resolver.service';
import { ReservationContractTranslator } from './reservation-contract-translator.service';
import { ReservationTranslator } from './reservation-translator.service';
import { ReservationIntegrationGuard } from './reservation-integration-guard.service';

import { EventPublisher } from '../../../shared/interfaces/event-publisher.interface';
import { ReservationDomainError } from '../../exceptions/reservation.exceptions';

import {
  ReservationContractTranslatedEvent,
  ReservationContractRejectedEvent,
  ReservationVersionNegotiatedEvent,
  ReservationTranslationFailedEvent,
  ReservationExternalReferenceResolvedEvent,
  ReservationACLValidationCompletedEvent
} from '../events/reservation-acl.events';

export class ReservationACL {
  private readonly guard = new ReservationIntegrationGuard();
  private readonly registry = new ReservationContractRegistry();
  private readonly validator = new ReservationContractValidator(this.registry);
  private readonly negotiator = new ReservationVersionNegotiator();
  private readonly refResolver = new ReservationReferenceResolver();
  private readonly translator = new ReservationTranslator(new ReservationContractTranslator());

  constructor(private readonly eventPublisher: EventPublisher) {}

  public processInbound(
    correlationIdStr: string,
    contractTypeStr: string,
    versionStr: string,
    contextName: string,
    systemId: string,
    externalId: string,
    payload: any
  ): ReservationTranslationResult {
    const correlationId = this.guard.guard(correlationIdStr);

    try {
      // 1. Validate Contract Type
      const contractType = ReservationContractType.create(contractTypeStr);
      this.validator.validate(contractType);

      // 2. Negotiate Version
      const version = this.negotiator.negotiate(versionStr);
      this.eventPublisher.publish(new ReservationVersionNegotiatedEvent(correlationId.id, version.version));

      // 3. Resolve References
      const identity = this.refResolver.resolve(contextName, systemId, externalId);
      this.eventPublisher.publish(new ReservationExternalReferenceResolvedEvent(correlationId.id, identity.reference.externalId));

      this.eventPublisher.publish(new ReservationACLValidationCompletedEvent(correlationId.id));

      // 4. Translate
      const context = ReservationIntegrationContext.create(contextName, payload);
      const translation = this.translator.executeTranslation(context.payload);

      if ('isSuccess' in translation && translation.isSuccess) {
        this.eventPublisher.publish(new ReservationContractTranslatedEvent(correlationId.id, contractTypeStr));
        return translation as ReservationTranslationResult;
      } else {
        const failure = translation as any;
        this.eventPublisher.publish(new ReservationTranslationFailedEvent(correlationId.id, failure.reason));
        throw new ReservationDomainError(`Translation Failed: ${failure.reason}`);
      }

    } catch (error: any) {
      this.eventPublisher.publish(new ReservationContractRejectedEvent(correlationId.id, error.message));
      throw new ReservationDomainError(`ACL Rejected Contract: ${error.message}`);
    }
  }
}