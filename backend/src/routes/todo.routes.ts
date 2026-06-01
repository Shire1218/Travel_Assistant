import { Router } from 'express';
import { listTodos, addTodo, toggleTodo, deleteTodo } from '../controllers/todo.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listTodos);
router.post('/plan/:planId', addTodo);
router.put('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
