import { Router } from 'express';
import { listFoods, addFood, updateFood, deleteFood } from '../controllers/food.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listFoods);
router.post('/plan/:planId', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;
