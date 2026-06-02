import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { error } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'travel-assistant-secret-key-dev';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    error(res, '未提供认证Token', 401);
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch {
    error(res, 'Token无效或已过期', 401);
  }
}

export function generateToken(user: { id: number; username: string }): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn } as SignOptions
  );
}

export { JWT_SECRET };
