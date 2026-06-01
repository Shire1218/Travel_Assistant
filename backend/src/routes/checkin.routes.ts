import { Router } from 'express';
import { listCheckins, addCheckin, updateCheckin, deleteCheckin } from '../controllers/checkin.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', listCheckins);
router.post('/plan/:planId', addCheckin);
router.put('/:id', updateCheckin);
router.delete('/:id', deleteCheckin);

export default router;
