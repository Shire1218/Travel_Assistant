import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, openid: true, username: true, email: true, nickname: true, avatarUrl: true, phone: true, gender: true, createdAt: true },
    });
    if (!user) { error(res, '用户不存在', 404); return; }
    success(res, user);
  } catch (err: any) { error(res, '获取用户信息失败', 500, err.message); }
}

export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { nickname, avatarUrl, phone, gender } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { nickname, avatarUrl, phone, gender },
    });
    success(res, user, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function uploadAvatar(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) { error(res, '请提供头像URL', 400); return; }
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl },
    });
    success(res, user, '头像更新成功');
  } catch (err: any) { error(res, '上传失败', 500, err.message); }
}
