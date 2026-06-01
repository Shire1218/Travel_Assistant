import { Router } from 'express';
import { listSpots, addSpot, updateSpot, deleteSpot } from '../controllers/spot.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listSpots);
router.post('/plan/:planId', addSpot);
router.put('/:id', updateSpot);
router.delete('/:id', deleteSpot);

export default router;
