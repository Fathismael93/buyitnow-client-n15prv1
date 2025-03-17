import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import { getProducts } from '@/backend/controllers/productControllers';
import onError from '@/backend/middlewares/errors';

const router = createRouter();

console.log('We are in the Get products api');

dbConnect();

router.get(getProducts);

export default router.handler({
  onError,
});
