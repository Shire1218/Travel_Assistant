import { Router } from 'express';
import { listPlans, getPlan, createPlan, updatePlan, deletePlan, getStats } from '../controllers/plan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/', listPlans);
router.post('/', createPlan);
router.get('/:id', getPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
