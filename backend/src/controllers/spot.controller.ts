import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listSpots(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const spots = await prisma.spotDetail.findMany({ where: { planId } });
    success(res, spots);
  } catch (err: any) { error(res, '获取景点失败', 500, err.message); }
}

export async function addSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { name, description, imageUrl, openHours, ticketPrice, contact } = req.body;
    if (!name) { error(res, '景点名称为必填项', 400); return; }
    const spot = await prisma.spotDetail.create({ data: { planId, name, description, imageUrl, openHours, ticketPrice, contact } });
    success(res, spot, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function updateSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const spot = await prisma.spotDetail.findFirst({ where: { id }, include: { plan: true } });
    if (!spot || spot.plan.userId !== req.user!.id) { error(res, '景点不存在', 404); return; }
    const { name, description, imageUrl, openHours, ticketPrice, contact } = req.body;
    const updated = await prisma.spotDetail.update({ where: { id }, data: { name, description, imageUrl, openHours, ticketPrice, contact } });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const spot = await prisma.spotDetail.findFirst({ where: { id }, include: { plan: true } });
    if (!spot || spot.plan.userId !== req.user!.id) { error(res, '景点不存在', 404); return; }
    await prisma.spotDetail.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
