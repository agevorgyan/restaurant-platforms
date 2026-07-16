export interface ISession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
