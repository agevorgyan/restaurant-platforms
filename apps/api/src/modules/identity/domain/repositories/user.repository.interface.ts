import { IUser } from '../entities';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
  delete(id: string): Promise<boolean>;
}
