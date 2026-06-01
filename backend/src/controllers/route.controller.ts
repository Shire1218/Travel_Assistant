import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listSpots(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const spots = await prisma.routeSpot.findMany({
      where: { planId },
      orderBy: { displayOrder: 'asc' },
    });
    success(res, spots);
  } catch (err: any) { error(res, '获取路线失败', 500, err.message); }
}

export async function addSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const { name, distanceKm, durationMin } = req.body;
    if (!name) { error(res, '景点名称为必填项', 400); return; }

    const maxOrder = await prisma.routeSpot.aggregate({
      where: { planId },
      _max: { displayOrder: true },
    });
    const order = (maxOrder._max.displayOrder || 0) + 1;

    const spot = await prisma.routeSpot.create({
      data: {
        planId, name,
        displayOrder: order,
        distanceKm: distanceKm || 0,
        durationMin: durationMin || 0,
      },
    });
    success(res, spot, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function updateSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const spotId = parseInt(req.params.id);
    const spot = await prisma.routeSpot.findFirst({
      where: { id: spotId },
      include: { plan: true },
    });
    if (!spot || spot.plan.userId !== req.user!.id) { error(res, '景点不存在', 404); return; }

    const { name, distanceKm, durationMin } = req.body;
    const updated = await prisma.routeSpot.update({
      where: { id: spotId },
      data: { name, distanceKm, durationMin },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteSpot(req: AuthRequest, res: Response): Promise<void> {
  try {
    const spotId = parseInt(req.params.id);
    const spot = await prisma.routeSpot.findFirst({
      where: { id: spotId },
      include: { plan: true },
    });
    if (!spot || spot.plan.userId !== req.user!.id) { error(res, '景点不存在', 404); return; }

    const deletedOrder = spot.displayOrder;
    await prisma.routeSpot.delete({ where: { id: spotId } });

    // 重新排序
    await prisma.routeSpot.updateMany({
      where: { planId: spot.planId, displayOrder: { gt: deletedOrder } },
      data: { displayOrder: { decrement: 1 } },
    });

    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}

export async function reorderSpots(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }

    const { order } = req.body; // [{ id: 1, order: 1 }, { id: 2, order: 2 }]
    if (!Array.isArray(order)) { error(res, '参数格式错误', 400); return; }

    for (const item of order) {
      await prisma.routeSpot.update({
        where: { id: item.id },
        data: { displayOrder: item.order },
      });
    }

    const spots = await prisma.routeSpot.findMany({
      where: { planId },
      orderBy: { displayOrder: 'asc' },
    });
    success(res, spots, '排序成功');
  } catch (err: any) { error(res, '排序失败', 500, err.message); }
}
