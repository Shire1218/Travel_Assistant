import { Router } from 'express';
import { listSpots, addSpot, updateSpot, deleteSpot, reorderSpots } from '../controllers/route.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listSpots);
router.post('/plan/:planId', addSpot);
router.put('/:id', updateSpot);
router.delete('/:id', deleteSpot);
router.post('/plan/:planId/reorder', reorderSpots);

export default router;
