import ErrorHandler from '../utils/errorHandler';
import { getServerSession } from 'next-auth';
import auth from '@/pages/api/auth/[...nextauth]';

const isAuthenticatedUser = async (req, res) => {
  console.log('WE ARE STARTING TO CHECK SESSION');
  const session = await getServerSession(req, res, auth);

  console.log('WE HAVE GOT SESSION FROM NEXTAUTH');

  if (!session) {
    console.log('THIS SESSION DOES NOT EXIST');
    return new ErrorHandler('Login first to access this route', 401);
  }

  console.log('THIS SESSION DOES EXIST');

  req.user = session.user;

  res.next();
};

export { isAuthenticatedUser };
