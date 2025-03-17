import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import { isAuthenticatedUser } from '@/backend/middlewares/auth';
import onError from '@/backend/middlewares/errors';
import { getCart } from '@/backend/controllers/cartControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser).get(getCart);

export default router.handler({ onError });
