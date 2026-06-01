import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error, paginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listPlans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      prisma.travelPlan.count({ where }),
      prisma.travelPlan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    paginated(res, items, total, page, limit);
  } catch (err: any) { error(res, '获取计划列表失败', 500, err.message); }
}

export async function getPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const plan = await prisma.travelPlan.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user!.id },
      include: {
        routeSpots: { orderBy: { displayOrder: 'asc' } },
        scheduleItems: { orderBy: [{ date: 'asc' }, { startTime: 'asc' }] },
        spotDetails: true,
        checkins: { orderBy: { date: 'desc' } },
        foods: true,
        transports: true,
        accommodations: true,
        expenses: true,
        todos: true,
      },
    });
    if (!plan) { error(res, '计划不存在', 404); return; }
    success(res, plan);
  } catch (err: any) { error(res, '获取计划失败', 500, err.message); }
}

export async function createPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, destination, startDate, endDate, budget, description, imageUrl } = req.body;
    if (!title || !destination || !startDate || !endDate) {
      error(res, '标题、目的地、开始日期和结束日期为必填项', 400);
      return;
    }
    const plan = await prisma.travelPlan.create({
      data: {
        userId: req.user!.id,
        title, destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget || 0,
        description, imageUrl,
      },
    });
    success(res, plan, '创建成功', 201);
  } catch (err: any) { error(res, '创建失败', 500, err.message); }
}

export async function updatePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.id);
    const existing = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!existing) { error(res, '计划不存在', 404); return; }

    const { title, destination, startDate, endDate, budget, spent, status, description, imageUrl, notes } = req.body;
    const plan = await prisma.travelPlan.update({
      where: { id: planId },
      data: {
        title, destination,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget, spent, status, description, imageUrl, notes,
      },
    });
    success(res, plan, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deletePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.id);
    const existing = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!existing) { error(res, '计划不存在', 404); return; }

    await prisma.travelPlan.delete({ where: { id: planId } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const total = await prisma.travelPlan.count({ where: { userId: req.user!.id } });
    const ongoing = await prisma.travelPlan.count({ where: { userId: req.user!.id, status: 'ongoing' } });
    const completed = await prisma.travelPlan.count({ where: { userId: req.user!.id, status: 'completed' } });
    const totalBudget = await prisma.travelPlan.aggregate({
      where: { userId: req.user!.id },
      _sum: { budget: true },
    });
    const totalSpent = await prisma.travelPlan.aggregate({
      where: { userId: req.user!.id },
      _sum: { spent: true },
    });

    success(res, {
      total,
      ongoing,
      completed,
      totalBudget: totalBudget._sum.budget || 0,
      totalSpent: totalSpent._sum.spent || 0,
    });
  } catch (err: any) { error(res, '获取统计失败', 500, err.message); }
}
