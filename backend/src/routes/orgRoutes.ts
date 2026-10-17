import { Router } from 'express';
import {
  createOrganization,
  joinOrganization,
  getMyOrganizations,
  getOrgDashboard,
} from '../controllers/orgController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/join', joinOrganization);
router.get('/me', getMyOrganizations);

router.post('/', authorizeRoles('ADMIN'), createOrganization);
router.get('/:id/dashboard', getOrgDashboard);

export default router;
