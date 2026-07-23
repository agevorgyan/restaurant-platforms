export interface WaitlistRepository {
  findById(id: string): Promise<any>;
  save(waitlist: any): Promise<void>;
}