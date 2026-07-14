import { AuthService } from '../auth.service';
import { prisma } from '@saas/database';

jest.mock('@saas/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw BadRequestException if user exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        authService.register('test@test.com', 'password123', 'Test User', 'Test Tenant'),
      ).rejects.toThrow('User already exists');
    });

    it('should create user and tenant inside transaction', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb: any) => {
        return cb({
          tenant: { create: jest.fn().mockResolvedValue({ id: 't1' }) },
          user: { create: jest.fn().mockResolvedValue({ id: 'u1', role: 'OWNER' }) },
        });
      });

      const result = await authService.register('test@test.com', 'hashedpassword', 'Test User', 'Test Tenant');
      
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('test@test.com', 'password123')).rejects.toThrow('Invalid credentials');
    });
  });
});
