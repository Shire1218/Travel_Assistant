import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function list(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const items = await prisma.transport.findMany({ where: { planId } });
    success(res, items);
  } catch (err: any) { error(res, '获取失败', 500, err.message); }
}

export async function add(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { type, from, to, time, cost, note } = req.body;
    if (!type || !from || !to) { error(res, '交通方式、出发地和目的地为必填项', 400); return; }
    const item = await prisma.transport.create({ data: { planId, type, from, to, time, cost: cost || 0, note } });
    success(res, item, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.transport.findFirst({ where: { id }, include: { plan: true } });
    if (!item || item.plan.userId !== req.user!.id) { error(res, '记录不存在', 404); return; }
    const { type, from, to, time, cost, note } = req.body;
    const updated = await prisma.transport.update({
      where: { id },
      data: { type, from, to, time, cost, note },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.transport.findFirst({ where: { id }, include: { plan: true } });
    if (!item || item.plan.userId !== req.user!.id) { error(res, '记录不存在', 404); return; }
    await prisma.transport.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
