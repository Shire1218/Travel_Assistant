import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listSchedules(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const date = req.query.date as string | undefined;
    const where: any = { planId };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }

    const items = await prisma.scheduleItem.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    success(res, items);
  } catch (err: any) { error(res, '获取日程失败', 500, err.message); }
}

export async function addSchedule(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const { date, startTime, endTime, title, description, type } = req.body;
    if (!date || !startTime || !endTime || !title) {
      error(res, '日期、开始时间、结束时间和标题为必填项', 400);
      return;
    }

    const item = await prisma.scheduleItem.create({
      data: { planId, date: new Date(date), startTime, endTime, title, description, type: type || 'other' },
    });
    success(res, item, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function updateSchedule(req: AuthRequest, res: Response): Promise<void> {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.scheduleItem.findFirst({
      where: { id: itemId },
      include: { plan: true },
    });
    if (!item || item.plan.userId !== req.user!.id) { error(res, '日程不存在', 404); return; }

    const { date, startTime, endTime, title, description, type } = req.body;
    const updated = await prisma.scheduleItem.update({
      where: { id: itemId },
      data: {
        date: date ? new Date(date) : undefined,
        startTime, endTime, title, description, type,
      },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteSchedule(req: AuthRequest, res: Response): Promise<void> {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.scheduleItem.findFirst({
      where: { id: itemId },
      include: { plan: true },
    });
    if (!item || item.plan.userId !== req.user!.id) { error(res, '日程不存在', 404); return; }

    await prisma.scheduleItem.delete({ where: { id: itemId } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}

export async function checkConflicts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const date = req.query.date as string;
    if (!date) { error(res, '请提供日期参数', 400); return; }

    const items = await prisma.scheduleItem.findMany({
      where: {
        planId,
        date: {
          gte: new Date(date),
          lte: new Date(date + 'T23:59:59'),
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const conflicts: Array<{ item1: number; item2: number }> = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (items[i].startTime < items[j].endTime && items[i].endTime > items[j].startTime) {
          conflicts.push({ item1: items[i].id, item2: items[j].id });
        }
      }
    }

    success(res, { hasConflict: conflicts.length > 0, conflicts, items });
  } catch (err: any) { error(res, '检测冲突失败', 500, err.message); }
}
