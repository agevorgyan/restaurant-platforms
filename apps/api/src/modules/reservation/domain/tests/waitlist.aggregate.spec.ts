import { Waitlist } from '../aggregates/waitlist.aggregate';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

describe('Waitlist Aggregate', () => {
  it('should successfully create a waitlist and add an entry', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    expect(waitlist.entries.length).toBe(0);

    const entryId = waitlist.addEntry(4, 1, 'cust-1');
    expect(waitlist.entries.length).toBe(1);
    expect(waitlist.entries[0].id).toBe(entryId);
    expect(waitlist.entries[0].position.position).toBe(1);
  });

  it('should enforce unique customer reference', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    waitlist.addEntry(2, 1, 'cust-1');
    expect(() => waitlist.addEntry(4, 1, 'cust-1')).toThrow(ReservationDomainError);
  });

  it('should promote an entry and enforce future deadlines', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    const entryId = waitlist.addEntry(4, 1, 'cust-1');

    const pastDeadline = new Date(Date.now() - 10000);
    expect(() => waitlist.promote(entryId, pastDeadline)).toThrow(ReservationDomainError);

    const futureDeadline = new Date(Date.now() + 600000); // 10 mins
    waitlist.promote(entryId, futureDeadline);

    expect(waitlist.entries[0].status.status).toBe('PROMOTED');
  });

  it('should accept a promotion and assign a reservation reference', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    const entryId = waitlist.addEntry(4, 1, 'cust-1');
    
    waitlist.promote(entryId, new Date(Date.now() + 600000));
    waitlist.acceptPromotion(entryId, 'res-1');

    expect(waitlist.entries[0].status.status).toBe('ACCEPTED');
    expect(waitlist.entries[0].reservationRef?.reference).toBe('res-1');
  });

  it('should expire a promotion', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    const entryId = waitlist.addEntry(4, 1, 'cust-1');
    
    waitlist.promote(entryId, new Date(Date.now() + 600000));
    waitlist.expirePromotion(entryId);

    expect(waitlist.entries[0].status.status).toBe('EXPIRED');
  });
  
  it('should order queue by priority then FIFO', () => {
    const waitlist = Waitlist.create('WL-001', 'branch-1', new Date());
    
    // Add normal priority
    const e1 = waitlist.addEntry(2, 1);
    
    // Add high priority, should jump to pos 1
    const e2 = waitlist.addEntry(2, 5);
    
    // Add normal priority, should be pos 3
    const e3 = waitlist.addEntry(2, 1);

    expect(waitlist.entries.find(e => e.id === e2)?.position.position).toBe(1);
    expect(waitlist.entries.find(e => e.id === e1)?.position.position).toBe(2);
    expect(waitlist.entries.find(e => e.id === e3)?.position.position).toBe(3);
  });
});