import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { generateToken } from '../middleware/auth.middleware';
import { z } from 'zod';

const registerSchema = z.object({
  openid: z.string().min(1).max(64),
  nickname: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

const loginSchema = z.object({
  openid: z.string().min(1).max(64),
});

export async function register(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    error(res, '参数验证失败', 400);
    return;
  }

  const { openid, nickname, phone } = result.data;

  try {
    const existing = await prisma.user.findUnique({ where: { openid } });
    if (existing) {
      error(res, '用户已存在', 409);
      return;
    }

    const user = await prisma.user.create({
      data: {
        openid,
        nickname: nickname || `用户_${openid.substring(0, 6)}`,
        phone,
      },
    });

    const token = generateToken({ id: user.id, openid: user.openid });

    success(res, { user, token }, '注册成功', 201);
  } catch (err: any) {
    error(res, '注册失败', 500, err.message);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    error(res, '参数验证失败', 400);
    return;
  }

  const { openid } = result.data;

  try {
    let user = await prisma.user.findUnique({ where: { openid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          openid,
          nickname: `用户_${openid.substring(0, 6)}`,
        },
      });
    }

    const token = generateToken({ id: user.id, openid: user.openid });

    success(res, { user, token }, '登录成功');
  } catch (err: any) {
    error(res, '登录失败', 500, err.message);
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      error(res, '未提供Token', 401);
      return;
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'travel-assistant-secret-key-dev';

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; openid: string };
    const newToken = generateToken({ id: decoded.id, openid: decoded.openid });

    success(res, { token: newToken }, 'Token刷新成功');
  } catch {
    error(res, 'Token无效或已过期', 401);
  }
}
