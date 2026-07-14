import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@saas/database';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ error: 'Invalid or expired token' }); return;
      }

      req.user = user as { userId: string; role: Role };
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' }); return;
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' }); return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' }); return;
    }

    next();
  };
};
