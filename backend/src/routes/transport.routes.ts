import { Router } from 'express';
import { list, add, update, remove } from '../controllers/transport.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/plan/:planId', list);
router.post('/plan/:planId', add);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
