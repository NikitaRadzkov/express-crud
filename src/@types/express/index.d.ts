import User from '../../app/users/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
