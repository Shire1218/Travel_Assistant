import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('错误:', err);

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      error(res, '数据已存在', 409, err.meta?.target?.toString());
      return;
    }
    if (err.code === 'P2025') {
      error(res, '记录不存在', 404);
      return;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    error(res, 'Token无效', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    error(res, 'Token已过期', 401);
    return;
  }

  error(res, err.message || '服务器内部错误', err.status || 500);
}
