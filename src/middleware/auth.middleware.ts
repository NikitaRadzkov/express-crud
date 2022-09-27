import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import WrongAuthenticationTokenException from '../exceptions/wrong-auth-token.exception';
import usersModel from '../app/users/user.model';
import DataStoredInToken from '../interfaces/data-stored-in-token';
import AuthenticationTokenMissingException from '../exceptions/auth-token-missing.exception';

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const verificationResponse = jwt.verify(cookies.Authorization, secret!) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await usersModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (e) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
