import { Router } from 'express';
import { listSchedules, addSchedule, updateSchedule, deleteSchedule, checkConflicts } from '../controllers/schedule.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId/conflicts', checkConflicts);
router.get('/plan/:planId', listSchedules);
router.post('/plan/:planId', addSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
