import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { generateToken } from '../middleware/auth.middleware';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100).optional(),
  password: z.string().min(6).max(50),
  nickname: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(50),
});

export async function register(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    error(res, '参数验证失败', 400);
    return;
  }

  const { username, email, password, nickname, phone } = result.data;

  try {
    const existingByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingByUsername) {
      error(res, '用户名已存在', 409);
      return;
    }

    if (email) {
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        error(res, '邮箱已被注册', 409);
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        nickname: nickname || username,
        phone,
      },
    });

    const token = generateToken({ id: user.id, username: user.username! });

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

  const { username, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      error(res, '用户名或密码错误', 401);
      return;
    }

    if (!user.password) {
      error(res, '该账号未设置密码，请先注册', 401);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      error(res, '用户名或密码错误', 401);
      return;
    }

    const token = generateToken({ id: user.id, username: user.username! });

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

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    const newToken = generateToken({ id: decoded.id, username: decoded.username });

    success(res, { token: newToken }, 'Token刷新成功');
  } catch {
    error(res, 'Token无效或已过期', 401);
  }
}
