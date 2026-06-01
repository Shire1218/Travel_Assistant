import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listTodos(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const todos = await prisma.todo.findMany({ where: { planId }, orderBy: { createdAt: 'desc' } });
    success(res, todos);
  } catch (err: any) { error(res, '获取待办失败', 500, err.message); }
}

export async function addTodo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { text } = req.body;
    if (!text) { error(res, '待办内容为必填项', 400); return; }
    const todo = await prisma.todo.create({ data: { planId, text } });
    success(res, todo, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function toggleTodo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const todo = await prisma.todo.findFirst({ where: { id }, include: { plan: true } });
    if (!todo || todo.plan.userId !== req.user!.id) { error(res, '待办不存在', 404); return; }
    const updated = await prisma.todo.update({ where: { id }, data: { completed: !todo.completed } });
    success(res, updated, '状态已更新');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteTodo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const todo = await prisma.todo.findFirst({ where: { id }, include: { plan: true } });
    if (!todo || todo.plan.userId !== req.user!.id) { error(res, '待办不存在', 404); return; }
    await prisma.todo.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
