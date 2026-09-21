import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type UserRole = 'SuperAdmin' | 'OperationsLead' | 'Analyst';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'pulseops-hyper-secure-jwt-secret-key-2026';

/**
 * Authentication Middleware
 * Validates JWT from httpOnly secure cookie or Bearer header
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Acceso no autorizado: Token de sesión ausente o expirado.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token de autenticación inválido o manipulado.',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts endpoint to authorized roles (e.g. SuperAdmin, OperationsLead)
 */
export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesión no iniciada.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Acceso restringido. Tu rol (${req.user.role}) no tiene permisos suficientes para esta operación.`,
      });
      return;
    }

    next();
  };
};
