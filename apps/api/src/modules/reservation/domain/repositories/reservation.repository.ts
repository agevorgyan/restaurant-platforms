export interface ReservationRepository {
  findById(id: string): Promise<any>;
  save(reservation: any): Promise<void>;
}