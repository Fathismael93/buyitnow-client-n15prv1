import ErrorHandler from '../utils/errorHandler';
import { getServerSession } from 'next-auth';
import { authFunction } from '@/app/api/auth/[...nextauth]/route';

const isAuthenticatedUser = async (req, res) => {
  const session = await getServerSession(authFunction);

  if (!session) {
    return new ErrorHandler('Login first to access this route', 401);
  }

  req.user = session.user;

  res.next();
};

export default isAuthenticatedUser;
