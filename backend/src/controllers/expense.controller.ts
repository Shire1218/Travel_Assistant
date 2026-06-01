import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export async function listExpenses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const expenses = await prisma.expense.findMany({ where: { planId }, orderBy: { date: 'desc' } });
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    success(res, { items: expenses, total });
  } catch (err: any) { error(res, '获取费用失败', 500, err.message); }
}

export async function addExpense(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = parseInt(req.params.planId);
    const plan = await prisma.travelPlan.findFirst({ where: { id: planId, userId: req.user!.id } });
    if (!plan) { error(res, '计划不存在', 404); return; }
    const { category, amount, date, note } = req.body;
    if (!category || !amount) { error(res, '分类和金额为必填项', 400); return; }
    const expense = await prisma.expense.create({ data: { planId, category, amount, date: date || new Date().toISOString().split('T')[0], note } });
    success(res, expense, '添加成功', 201);
  } catch (err: any) { error(res, '添加失败', 500, err.message); }
}

export async function updateExpense(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const expense = await prisma.expense.findFirst({ where: { id }, include: { plan: true } });
    if (!expense || expense.plan.userId !== req.user!.id) { error(res, '费用记录不存在', 404); return; }
    const { category, amount, date, note } = req.body;
    const updated = await prisma.expense.update({
      where: { id },
      data: { category, amount, date, note },
    });
    success(res, updated, '更新成功');
  } catch (err: any) { error(res, '更新失败', 500, err.message); }
}

export async function deleteExpense(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const expense = await prisma.expense.findFirst({ where: { id }, include: { plan: true } });
    if (!expense || expense.plan.userId !== req.user!.id) { error(res, '费用记录不存在', 404); return; }
    await prisma.expense.delete({ where: { id } });
    success(res, null, '删除成功');
  } catch (err: any) { error(res, '删除失败', 500, err.message); }
}
