import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface AuthUser {
  userId: string;
  householdId: string;
  email: string;
  role: 'owner' | 'member';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Bearer token everywhere; test headers only when NODE_ENV=test (set by Vitest) [CA-0.1, CA-0.2]
  const authHeader = req.headers.authorization;
  const devHouseholdId = req.headers['x-household-id'] as string;
  const devUserId = req.headers['x-user-id'] as string;

  if (config.nodeEnv === 'test' && devHouseholdId && devUserId) {
    req.user = {
      userId: devUserId,
      householdId: devHouseholdId,
      email: (req.headers['x-user-email'] as string) || 'test@example.com',
      role: 'owner',
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès non autorisé : jeton d’authentification requis' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expirée ou jeton invalide' });
  }
}
