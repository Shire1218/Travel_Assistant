import { Router } from 'express';
import { listExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listExpenses);
router.post('/plan/:planId', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
