import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listFoods(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const where: any = { planId };
    if (req.query.category) where.category = req.query.category;
    const foods = await prisma.food.findMany({ where, orderBy: { rating: 'desc' } });
    success(res, foods);
  } catch (err: any) { error(res, '获取美食列表失败', 500, err.message); }
}

export async function addFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { name, address, rating, category, pricePerPerson, dishes, imageUrl, mapX, mapY } = req.body;
    if (!name || !address) { error(res, '店铺名称和地址为必填项', 400); return; }
    const food = await prisma.food.create({ data: { planId, name, address, rating: rating || 3, category, pricePerPerson, dishes, imageUrl, mapX, mapY } });
    success(res, food, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function updateFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const food = await prisma.food.findFirst({ where: { id }, include: { plan: true } });
    if (!food || food.plan.userId !== req.user!.id) { error(res, '美食不存在', 404); return; }
    const { name, address, rating, category, pricePerPerson, dishes, imageUrl, mapX, mapY } = req.body;
    const updated = await prisma.food.update({
      where: { id },
      data: { name, address, rating, category, pricePerPerson, dishes, imageUrl, mapX, mapY },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const food = await prisma.food.findFirst({ where: { id }, include: { plan: true } });
    if (!food || food.plan.userId !== req.user!.id) { error(res, '美食不存在', 404); return; }
    await prisma.food.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
