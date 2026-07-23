export interface DomainClock {
  now(): Date;
  today(): Date;
  utcNow(): Date;
}
