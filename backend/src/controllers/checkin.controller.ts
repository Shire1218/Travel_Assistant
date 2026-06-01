import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listCheckins(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const where: any = { planId };
    if (req.query.image === 'true') where.imageUrl = { not: '' };
    const checkins = await prisma.checkin.findMany({ where, orderBy: { date: 'desc' } });
    success(res, checkins);
  } catch (err: any) { error(res, '获取打卡记录失败', 500, err.message); }
}

export async function addCheckin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { location, date, description, imageUrl } = req.body;
    if (!location || !date) { error(res, '地点和日期为必填项', 400); return; }
    const checkin = await prisma.checkin.create({ data: { planId, location, date: new Date(date), description, imageUrl: imageUrl || '' } });
    success(res, checkin, '打卡成功', 201);
  } catch (err: any) { error(res, '打卡失败', 500, err.message); }
}

export async function updateCheckin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const checkin = await prisma.checkin.findFirst({ where: { id }, include: { plan: true } });
    if (!checkin || checkin.plan.userId !== req.user!.id) { error(res, '打卡记录不存在', 404); return; }
    const { location, date, description, imageUrl } = req.body;
    const updated = await prisma.checkin.update({
      where: { id },
      data: { location, date: date ? new Date(date) : undefined, description, imageUrl },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteCheckin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const checkin = await prisma.checkin.findFirst({ where: { id }, include: { plan: true } });
    if (!checkin || checkin.plan.userId !== req.user!.id) { error(res, '打卡记录不存在', 404); return; }
    await prisma.checkin.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
