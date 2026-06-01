import { Response } from 'express';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export function success<T>(res: Response, data: T, message = '操作成功', statusCode = 200): Response {
  const response: ApiResponse<T> = {
    code: 0,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function error(res: Response, message = '服务器错误', statusCode = 500, error?: string): Response {
  const response: ApiResponse = {
    code: statusCode === 500 ? -1 : statusCode,
    message,
    error,
  };
  return res.status(statusCode).json(response);
}

export function paginated<T>(res: Response, data: T[], total: number, page: number, limit: number, message = '操作成功'): Response {
  return success(res, {
    items: data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }, message);
}
