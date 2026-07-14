import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { prisma } from '@saas/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
  private readonly accessTokenExpiresIn = '15m';
  private readonly refreshTokenExpiresIn = '7d';

  async register(email: string, passwordHash: string, name: string, tenantName: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await prisma.$transaction(async (tx) => {
      let tenant;
      if (tenantName) {
        tenant = await tx.tenant.create({
          data: { 
            name: tenantName,
            slug: tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6)
          },
        });
      }

      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: tenant ? "OWNER" : "USER",
          tenantId: tenant?.id,
        },
      });
      return newUser;
    });

    return this.generateTokens(user.id, user.role);
  }

  async login(email: string, passwordHashInput: string, device?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(passwordHashInput, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.role, device, ipAddress);
  }

  private async generateTokens(userId: string, role: string, device?: string, ipAddress?: string) {
    const payload = { sub: userId, role };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.accessTokenExpiresIn });
    const refreshToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.refreshTokenExpiresIn });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId,
        refreshToken,
        device,
        ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshSession(refreshToken: string, device?: string, ipAddress?: string) {
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    
    return this.generateTokens(session.userId, session.user.role, device, ipAddress);
  }

  async logout(refreshToken: string) {
    await prisma.session.delete({
      where: { refreshToken },
    });
  }

  async generateMagicLink(email: string) {
    return { success: true };
  }

  async handleGoogleCallback(code: string) {
     return { accessToken: 'dummy', refreshToken: 'dummy' };
  }

  async handleAppleCallback(code: string) {
     return { accessToken: 'dummy', refreshToken: 'dummy' };
  }
}
