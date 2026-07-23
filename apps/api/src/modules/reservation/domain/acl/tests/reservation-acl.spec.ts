import { ReservationACL } from '../services/reservation-acl.service';
import { EventPublisher } from '../../../shared/interfaces/event-publisher.interface';
import { ReservationDomainError } from '../../exceptions/reservation.exceptions';

describe('ReservationACL', () => {
  let acl: ReservationACL;
  let mockPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    mockPublisher = { publish: jest.fn(), publishAll: jest.fn() };
    acl = new ReservationACL(mockPublisher);
  });

  it('should successfully process a valid inbound contract', () => {
    const result = acl.processInbound(
      'corr-123',
      'Customer',
      '1.0',
      'CustomerContext',
      'sys-1',
      'ext-123',
      { someData: true }
    );

    expect(result.isSuccess).toBe(true);
    expect(result.translatedData.sanitizedPayload.someData).toBe(true);
    expect(result.translatedData.sanitizedPayload.__translatedAt).toBeDefined();
    
    expect(mockPublisher.publish).toHaveBeenCalledTimes(4);
  });

  it('should reject unsupported contract types', () => {
    expect(() => {
      acl.processInbound('corr-123', 'UnknownContext', '1.0', 'Unknown', 'sys-1', 'ext-123', {});
    }).toThrow(ReservationDomainError);
    
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ reason: expect.stringContaining('not compatible') })
    );
  });

  it('should reject unsupported versions', () => {
    expect(() => {
      acl.processInbound('corr-123', 'Customer', '9.9', 'CustomerContext', 'sys-1', 'ext-123', {});
    }).toThrow(ReservationDomainError);
    
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ reason: expect.stringContaining('not supported') })
    );
  });

  it('should fail if missing correlationId', () => {
    expect(() => {
      acl.processInbound('', 'Customer', '1.0', 'CustomerContext', 'sys-1', 'ext-123', {});
    }).toThrow(ReservationDomainError);
  });

  it('should fail if payload is invalid for translation', () => {
    expect(() => {
      acl.processInbound('corr-123', 'Customer', '1.0', 'CustomerContext', 'sys-1', 'ext-123', null);
    }).toThrow(ReservationDomainError);

    expect(mockPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ reason: expect.stringContaining('Translation Failed') })
    );
  });
});