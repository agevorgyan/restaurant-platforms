import { Injectable } from '@nestjs/common';
import { IUserRepository, IUser } from '../../domain';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private readonly users: Map<string, IUser> = new Map();

  async findById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async save(user: IUser): Promise<IUser> {
    this.users.set(user.id, user);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
