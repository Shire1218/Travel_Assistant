import { Router } from 'express';
import { getMe, updateMe, uploadAvatar } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/avatar', uploadAvatar);

export default router;
